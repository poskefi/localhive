const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert'); // Ensure the Alert model is correctly defined

// Handle creating a new alert
router.post('/', async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  try {
    const newAlert = await Alert.create({ title, description });
    res.status(201).json(newAlert);
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'Failed to create alert', details: error.message });
  }
});

// Handle retrieving all alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.findAll();
    res.status(200).json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts', details: error.message });
  }
});

module.exports = router;
