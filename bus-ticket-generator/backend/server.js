const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();


const Ticket = require('./models/Ticket');
const authRoutes = require('./routes/auth');

const app = express();   


app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);


mongoose.connect('mongodb://localhost:27017/bus-ticket' ,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));
 

app.post('/api/tickets', async (req, res) => {
  try {
    const ticket = new Ticket(req.body);
    await ticket.save();

    // ✅ Send SMS if passengerPhone exists
    if (req.body.passengerPhone) {
  const message = `e-Ticket:
From: ${ticket.boarding}
To: ${ticket.destination}
Fare: ₹${ticket.fare}
Date: ${ticket.date}`;

  try {
    const response = await axios.post(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        route: 'v3',
        sender_id: 'TXTIND',
        message,
        language: 'english',
        flash: 0,
        numbers: req.body.passengerPhone,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ SMS Response:', response.data);
  } catch (smsError) {
    console.error('⚠️ SMS sending failed:', smsError.response?.data || smsError.message);
  }
}


    res.status(201).json({ message: 'Ticket saved and SMS sent!', ticket });
  } catch (err) {
    console.error('Error saving ticket:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// server.js or routes/tickets.js
app.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .sort({ createdAt: -1 }) // ✅ Sort newest first
      .limit(50);              // ✅ Only 50 tickets
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});
// In server.js or routes/tickets.js
app.get('/api/passenger-count', async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const count = await Ticket.countDocuments({
      date: { $gte: todayStart }
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to count passengers' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(5000, () => console.log(`Server running on port 5000`));
