const { Order, Event, WaitingList } = require("../models")
const eventService = require("../services/eventService")

exports.initializeEvent = async (req, res) => {
  try {
    const { eventId, totalTickets } = req.body
    if (!eventId || !totalTickets) {
      return res.status(400).json({ error: "eventId and totalTickets are required" })
    }

    if (isNaN(Number.parseInt(totalTickets)) || Number.parseInt(totalTickets) <= 0) {
      return res.status(400).json({ error: "totalTickets must be a positive number" })
    }

    const event = await eventService.initializeEvent(eventId, totalTickets, { Event, WaitingList })
    res.status(201).json(event)
  } catch (error) {
    console.error("Error initializing event:", error)
    if (error.message === "Event already initialized") {
      return res.status(409).json({ error: error.message })
    }
    res.status(500).json({ error: error.message })
  }
}

exports.bookTicket = async (req, res) => {
  try {
    const { eventId, userId } = req.body
    if (!eventId || !userId) {
      return res.status(400).json({ error: "eventId and userId are required" })
    }

    const result = await eventService.bookTicket(eventId, userId, { Order, Event, WaitingList })
    res.status(200).json(result)
  } catch (error) {
    console.error("Error booking ticket:", error)
    if (error.message === "Event not found") {
      return res.status(404).json({ error: error.message })
    }
    if (
      error.message === "User already has a ticket for this event" || error.message === "User is already in the waiting list for this event"
    ) {
      return res.status(409).json({ error: error.message })
    }
    res.status(500).json({ error: error.message })
  }
}

exports.cancelBooking = async (req, res) => {
  try {
    const { eventId, userId } = req.body
    if (!eventId || !userId) {
      return res.status(400).json({ error: "eventId and userId are required" })
    }

    const result = await eventService.cancelBooking(eventId, userId, { Order, Event, WaitingList })
    res.status(200).json(result)
  } catch (error) {
    console.error("Error canceling booking:", error)
    if (error.message === "Event not found") {
      return res.status(404).json({ error: error.message })
    }
    if (error.message === "No active booking found for this user") {
      return res.status(404).json({ error: error.message })
    }
    res.status(500).json({ error: error.message })
  }
}

exports.getEventStatus = async (req, res) => {
  try {
    const { eventId } = req.params
    console.log("Requested event ID:", eventId)

    if (!eventId) {
      return res.status(400).json({ error: "eventId is required" })
    }

    const status = await eventService.getEventStatus(eventId, { Event, WaitingList })
    res.status(200).json(status)
  } catch (error) {
    console.error("Error getting event status:", error)
    if (error.message === "Event not found") {
      return res.status(404).json({ error: error.message })
    }
    res.status(500).json({ error: error.message })
  }
}

