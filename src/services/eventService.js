const AsyncLock = require("async-lock")
const lock = new AsyncLock()

class EventService {
  constructor() {
    this.events = new Map()
    this.waitingLists = new Map()
  }

  async initializeEvent(eventId, totalTickets, models) {
    const { Event, WaitingList } = models

    return lock.acquire(eventId.toString(), async () => {
      const existingEvent = await Event.findOne({
        where: { eventId: eventId.toString() },
      })

      if (existingEvent) {
        throw new Error("Event already initialized")
      }
      const event = await Event.create({
        eventId: eventId.toString(),
        totalTickets: Number.parseInt(totalTickets),
        bookedTickets: 0,
      })

      this.events.set(eventId.toString(), {
        totalTickets: Number.parseInt(totalTickets),
        bookedTickets: 0,
      })
      this.waitingLists.set(eventId.toString(), [])

      return {
        eventId,
        totalTickets: Number.parseInt(totalTickets),
        bookedTickets: 0,
      }
    })
  }

  async bookTicket(eventId, userId, models) {
    const { Order, Event, WaitingList } = models

    return lock.acquire(eventId.toString(), async () => {
      const event = await Event.findOne({
        where: { eventId: eventId.toString() },
      })

      if (!event) {
        throw new Error("Event not found")
      }

      const existingOrder = await Order.findOne({
        where: {
          userId,
          eventId: eventId.toString(),
          status: "confirmed",
        },
      })

      if (existingOrder) {
        throw new Error("User already has a ticket for this event")
      }


      const waitingOrder = await Order.findOne({
        where: {
          userId,
          eventId: eventId.toString(),
          status: "waiting",
        },
      })

      if (waitingOrder) {
        throw new Error("User is already in the waiting list for this event")
      }

      if (event.bookedTickets < event.totalTickets) {
        await event.update({ bookedTickets: event.bookedTickets + 1 })

        await Order.create({
          userId,
          eventId: eventId.toString(),
          status: "confirmed",
        })

        this.events.set(eventId.toString(), {
          totalTickets: event.totalTickets,
          bookedTickets: event.bookedTickets + 1,
        })

        return { status: "confirmed", position: null }
      } else {
        // Add to waiting list
        const waitingCount = await WaitingList.count({
          where: { eventId: eventId.toString() },
        })

        const position = waitingCount + 1

        await WaitingList.create({
          eventId: eventId.toString(),
          userId,
          position,
          timestamp: new Date(),
        })

        await Order.create({
          userId,
          eventId: eventId.toString(),
          status: "waiting",
        })

        const waitingList = this.waitingLists.get(eventId.toString()) || []
        waitingList.push({ userId, timestamp: Date.now() })
        this.waitingLists.set(eventId.toString(), waitingList)

        return { status: "waiting", position }
      }
    })
  }

  async cancelBooking(eventId, userId, models) {
    const { Order, Event, WaitingList } = models

    return lock.acquire(eventId.toString(), async () => {
      // Get event from database
      const event = await Event.findOne({
        where: { eventId: eventId.toString() },
      })

      if (!event) {
        throw new Error("Event not found")
      }

      const order = await Order.findOne({
        where: {
          userId,
          eventId: eventId.toString(),
          status: "confirmed",
        },
      })

      if (!order) {
        throw new Error("No active booking found for this user")
      }

      // Cancel booking
      await order.update({ status: "cancelled" })

      // Check waiting list
      const nextInLine = await WaitingList.findOne({
        where: { eventId: eventId.toString() },
        order: [["position", "ASC"]],
      })

      if (nextInLine) {
        // Find the waiting order
        const waitingOrder = await Order.findOne({
          where: {
            userId: nextInLine.userId,
            eventId: eventId.toString(),
            status: "waiting",
          },
        })

        if (waitingOrder) {
          await waitingOrder.update({ status: "confirmed" })
        } else {
          await Order.create({
            userId: nextInLine.userId,
            eventId: eventId.toString(),
            status: "confirmed",
          })
        }

        await nextInLine.destroy()


        const remainingWaitlist = await WaitingList.findAll({
          where: { eventId: eventId.toString() },
          order: [["position", "ASC"]],
        })

        for (let i = 0; i < remainingWaitlist.length; i++) {
          await remainingWaitlist[i].update({ position: i + 1 })
        }

        const waitingList = this.waitingLists.get(eventId.toString()) || []
        const index = waitingList.findIndex((item) => item.userId === nextInLine.userId)
        if (index !== -1) {
          waitingList.splice(index, 1)
          this.waitingLists.set(eventId.toString(), waitingList)
        }

        return { reassigned: true, toUserId: nextInLine.userId }
      } else {

        await event.update({ bookedTickets: event.bookedTickets - 1 })

        this.events.set(eventId.toString(), {
          totalTickets: event.totalTickets,
          bookedTickets: event.bookedTickets - 1,
        })

        return { reassigned: false }
      }
    })
  }

  async getEventStatus(eventId, models) {
    const { Event, WaitingList } = models

    const event = await Event.findOne({
      where: { eventId: eventId.toString() },
    })

    if (!event) {
      throw new Error("Event not found")
    }

    const waitingListCount = await WaitingList.count({
      where: { eventId: eventId.toString() },
    })

    this.events.set(eventId.toString(), {
      totalTickets: event.totalTickets,
      bookedTickets: event.bookedTickets,
    })

    return {
      eventId,
      totalTickets: event.totalTickets,
      bookedTickets: event.bookedTickets,
      availableTickets: event.totalTickets - event.bookedTickets,
      waitingListCount,
    }
  }
}

module.exports = new EventService()

