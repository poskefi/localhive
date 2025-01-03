const express = require('express');
const router = express.Router();
const Weather = require('../models/Weather'); // Ensure the Weather model is correctly defined

// Handle creating a new weather report
router.post('/', async (req, res) => {
  const { description, temperature, city } = req.body;

  if (!description || !temperature || !city) {
    return res.status(400).json({ error: 'Description, temperature, and city are required' });
  }

  try {
    const newWeather = await Weather.create({ description, temperature, city });
    res.status(201).json(newWeather);
  } catch (error) {
    console.error('Error creating weather report:', error);
    res.status(500).json({ error: 'Failed to create weather report', details: error.message });
  }
});

// Handle retrieving all weather reports
router.get('/', async (req, res) => {
  try {
    const weatherReports = await Weather.findAll();
    res.status(200).json(weatherReports);
  } catch (error) {
    console.error('Error fetching weather reports:', error);
    res.status(500).json({ error: 'Failed to fetch weather reports', details: error.message });
  }
});

module.exports = router;
