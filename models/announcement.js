'use strict';

// Require modules for Mongoose
const mongoose   = require("mongoose"),
      Schema     = mongoose.Schema;

// Announcement schema setup
const announcementSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  comments_count: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
   },
   course_title_dashed: {
     type: String
   },
   user: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "User"
   }
});

// Ecport model
module.exports = mongoose.model("Announcement", announcementSchema);
