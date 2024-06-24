const Event = require('../models/event');

const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.getAllEvents();
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve events' });
  }
};

const createEvent = async (req, res, next) => {
  try {
    const eventData = req.body; 
    const newEvent = await Event.createEvent(eventData);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create event' });
  }
};

module.exports = {
  getAllEvents,
  createEvent,
};
