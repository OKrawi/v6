'use strict';

// Require modules for Mongoose
const mongoose   = require("mongoose"),
      Schema     = mongoose.Schema;

// Response schema setup
const responseSchema= new Schema({
  body: {
    type: String,
    required: true
  },
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },
  voters_count: {
    type: Number,
    default: 0
  },
  voters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  created_at: {
    type: Date,
    default: Date.now
   },
  updated_at: {
    type: Date
  }
});

// Ecport model
module.exports = mongoose.model("Response", responseSchema);
