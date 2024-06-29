const Event = require('../models/event');

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.getAllEvents();
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve events' });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.getEventById(parseInt(id, 10));
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve event' });
  }
};

const createEvent = async (req, res) => {
  try {
    const eventData = req.body; 
    const newEvent = await Event.createEvent(eventData);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create event' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const eventData = req.body;
    const updatedEvent = await Event.updateEvent(id, eventData);
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update event' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.deleteEvent(id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete event' });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
