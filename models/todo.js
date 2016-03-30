// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var TodoSchema   = new mongoose.Schema({
  todoText: String,
  done: String,
});

// Export the Mongoose model
module.exports = mongoose.model('Todo', TodoSchema);