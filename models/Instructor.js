const mongoose = require("mongoose");
const instructorSchema = new mongoose.Schema({
  name: String,
  subject: String,
  hourlyRate: Number,
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Instructor", instructorSchema);
