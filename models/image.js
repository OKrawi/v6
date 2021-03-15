'use strict';

// Require modules for Mongoose
const mongoose   = require("mongoose"),
      Schema     = mongoose.Schema;

// Image schema setup
const ImageSchema= new Schema({
  encoding: {
    type: String
  },
  mimetype: {
    type: String
  },
  filename: {
    type: String,
    index: {
      unique: true
    },
  },
  path: {
    type: String,
    index: {
      unique: true
    },
  },
  avatar_path:{
    type: String
  },
  size: {
    type: String
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  course_title_dashed: {
    type: String,
    ref: 'Course'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Ecport model
module.exports = mongoose.model("Image", ImageSchema);
