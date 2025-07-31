const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  
  boarding: String,
  destination: String,
  fare: Number,
  stops: Number,
  gender: String,
  date: String,
  passengerPhone: String,
  date: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });
module.exports = mongoose.model('Ticket', ticketSchema);