const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  keyword: {
    type: String,
    lowercase: true,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ["destination", "event", "food"],
    default: "event"
  }
});

const Recommendation = mongoose.model("Recommendation", recommendationSchema);

module.exports.Recommendation = Recommendation;
