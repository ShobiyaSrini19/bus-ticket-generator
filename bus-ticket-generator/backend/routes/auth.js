const express = require('express');
const router = express.Router();
const Conductor = require('../models/Conductor');

router.post('/signup', async (req, res) => {
  const { name, age, dob, gender, phone } = req.body;

  const dobDate = new Date(dob);
  const day = String(dobDate.getDate()).padStart(2, '0');
  const month = String(dobDate.getMonth() + 1).padStart(2, '0');

  const conductorId = name.substring(0, 3).toLowerCase() + day + month;
  const password = phone;

  const existing = await Conductor.findOne({ conductorId });
  if (existing) {
    return res.status(400).json({ error: 'Conductor already exists' });
  }

  const conductor = new Conductor({ name, age, dob, gender, phone, conductorId, password });
  await conductor.save();

  res.status(201).json({ message: 'Signup successful', conductorId });
});



router.post('/login', async (req, res) => {
  const { conductorId, password } = req.body;

  const conductor = await Conductor.findOne({ conductorId, password });

  if (!conductor) {
    return res.status(401).json({ error: 'Invalid ID or password' });
  }

  res.json({ message: 'Login successful', conductorId });
});
// Get conductor profile by ID
router.get('/profile/:id', async (req, res) => {
  try {
    const conductor = await Conductor.findOne({ conductorId: req.params.id });
    if (!conductor) {
      return res.status(404).json({ error: 'Conductor not found' });
    }
    res.json(conductor);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
// Update conductor profile
router.put('/profile/:id', async (req, res) => {
  try {
    const updated = await Conductor.findOneAndUpdate(
      { conductorId: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Conductor not found' });
    }
    res.json({ message: 'Profile updated', updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
