'use strict';

// Require modules for Mongoose
const mongoose   = require("mongoose"),
      Schema     = mongoose.Schema;

// Comment schema setup
const commentSchema= new Schema({
  body: {
    type: String,
    required: true
  },
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
  },
  announcement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Announcement"
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Ecport model
module.exports = mongoose.model("Comment", commentSchema);
