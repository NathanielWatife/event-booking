const AsyncLock = require('async-lock');
const lock = new AsyncLock();


class EventService {
  constructor() {
    this.events = new Map();
    this.waitingLists = new Map();
  }

  async initializeEvent(eventId, totalTickets) {
    return lock.acquire(eventId, () => {
      if (this.events.has(eventId)) {
        throw new Error('Event already initialized');
      }
      this.events.set(eventId, {
        totalTickets: parseInt(totalTickets),
        bookedTickets: 0
      });
      this.waitingLists.set(eventId, []);
      return { eventId, totalTickets, bookedTickets: 0 };
    });
  }

  async bookTicket(eventId, userId, orderModel) {
    return lock.acquire(eventId, async () => {
      if (!this.events.has(eventId)) {
        throw new Error('Event not found');
      }

      const event = this.events.get(eventId);
      const waitingList = this.waitingLists.get(eventId);

      const existingOrder = await orderModel.findOne({
        where: { userId, eventId, status: 'confirmed' }
      });
      if (existingOrder) {
        throw new Error('User already has a ticket for this event');
      }

      if (event.bookedTickets < event.totalTickets) {
        event.bookedTickets++;
        await orderModel.create({
          userId,
          eventId,
          status: 'confirmed'
        });
        return { status: 'confirmed', position: null };
      } else {
        const position = waitingList.length + 1;
        waitingList.push({ userId, timestamp: Date.now() });
        await orderModel.create({
          userId,
          eventId,
          status: 'waiting'
        });
        return { status: 'waiting', position };
      }
    });
  }

  async cancelBooking(eventId, userId, orderModel) {
    return lock.acquire(eventId, async () => {
      if (!this.events.has(eventId)) {
        throw new Error('Event not found');
      }

      const event = this.events.get(eventId);
      const waitingList = this.waitingLists.get(eventId);

      const order = await orderModel.findOne({
        where: { userId, eventId, status: 'confirmed' }
      });
      
      if (!order) {
        throw new Error('No active booking found for this user');
      }

      await order.update({ status: 'cancelled' });

      if (waitingList.length > 0) {
        const nextUser = waitingList.shift();
        await orderModel.create({
          userId: nextUser.userId,
          eventId,
          status: 'confirmed'
        });
        
        return { reassigned: true, toUserId: nextUser.userId };
      } else {
        event.bookedTickets--;
        return { reassigned: false };
      }
    });
  }

  async getEventStatus(eventId) {
    if (!this.events.has(eventId)) {
      throw new Error('Event not found');
    }

    const event = this.events.get(eventId);
    const waitingList = this.waitingLists.get(eventId);

    return {
      eventId,
      totalTickets: event.totalTickets,
      bookedTickets: event.bookedTickets,
      availableTickets: event.totalTickets - event.bookedTickets,
      waitingListCount: waitingList.length
    };
  }
}

module.exports = new EventService();