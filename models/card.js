const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    required: true,
    validate: /[-a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?/,
    type: String,
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  likes: {
    default: [],
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
