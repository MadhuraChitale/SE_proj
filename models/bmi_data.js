const mongoose = require("mongoose");
const bmi_data = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },

  bmi: {
    type: Number,
    required: true,
  },
});

const FirstSch = mongoose.model("BMI", bmi_data);
module.exports = FirstSch;
