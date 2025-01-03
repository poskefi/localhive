const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Handle creating a new event
router.post('/', async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    if (!title || !description || !date || !location) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newEvent = await Event.create({ title, description, date, location });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error.message);
    res.status(500).json({ error: 'Failed to create event', details: error.message });
  }
});

// Handle fetching all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error.message);
    res.status(500).json({ error: 'Failed to fetch events', details: error.message });
  }
});

module.exports = router;
