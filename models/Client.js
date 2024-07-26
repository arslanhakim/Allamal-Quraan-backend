const mongoose = require("mongoose");
const clientSchema = new mongoose.Schema({
  name: String,
  email: String,
  monthlyPayment: Number,
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Client", clientSchema);
