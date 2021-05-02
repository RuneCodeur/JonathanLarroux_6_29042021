const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
  sauce: {
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  heat: { type: Number, required: true },

  },
  image: { type: String, required: true },
});

module.exports = mongoose.model('Thing', thingSchema);