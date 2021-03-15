'use strict';

// Require modules for Mongoose
const mongoose   = require("mongoose"),
      Schema     = mongoose.Schema;

// Report schema setup
const reportSchema = new Schema({
  body: {
    type: String
  },
  course_title_dashed: {
    type: String
  },
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },
  response_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Response"
  },
  announcement_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Announcement"
  },
  comment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  suspect: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  item_title: {
    type: String
  },
  item_body: {
    type: String
  },
  abuseType: {
    type: String
  },
  resolved: {
    type: Boolean,
    default: false
  },
  is_removed: {
    type: Boolean,
    default: false
  },
  suspect_banned: {
    type: Boolean,
    default: false
  },
  is_ignored:{
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
   }
});

// Report model
module.exports = mongoose.model("Report", reportSchema);
