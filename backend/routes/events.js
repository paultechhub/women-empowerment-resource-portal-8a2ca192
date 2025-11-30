const express = require('express');
const { Event, EventRegistration } = require('../models/Event');
const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const { upcoming = false } = req.query;
    let filter = {};
    
    if (upcoming === 'true') {
      filter.date = { $gte: new Date() };
    }
    
    const events = await Event.find(filter)
      .populate('created_by', 'full_name')
      .sort({ date: 1 });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create event
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    await event.populate('created_by', 'full_name');
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register for event
router.post('/register', async (req, res) => {
  try {
    const { user_id, event_id } = req.body;
    
    const existingRegistration = await EventRegistration.findOne({ user_id, event_id });
    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    const registration = new EventRegistration({ user_id, event_id });
    await registration.save();
    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get event registrations
router.get('/:eventId/registrations', async (req, res) => {
  try {
    const registrations = await EventRegistration.find({ event_id: req.params.eventId })
      .populate('user_id', 'full_name email');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('created_by', 'full_name');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('created_by', 'full_name');
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel event registration
router.delete('/register/:registrationId', async (req, res) => {
  try {
    await EventRegistration.findByIdAndDelete(req.params.registrationId);
    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user registrations
router.get('/user/:userId/registrations', async (req, res) => {
  try {
    const registrations = await EventRegistration.find({ user_id: req.params.userId })
      .populate('event_id');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;