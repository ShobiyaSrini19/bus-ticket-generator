const mongoose = require('mongoose');

const conductorSchema = new mongoose.Schema({
  conductorId: String,
  name: String,
  age: String,
  dob: String,
  gender: String,
  phone: String,
  password: String
});

module.exports = mongoose.model('Conductor', conductorSchema);
