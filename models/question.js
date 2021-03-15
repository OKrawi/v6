'use strict';

// Require modules for Mongoose
const mongoose   = require("mongoose"),
      Schema     = mongoose.Schema;

// Question schema setup
const questionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  responses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Response'
    }
  ],
  responses_count: {
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
   lecture_id: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Lecture"
   },
   followers: [
     {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User"
     }
   ],
   top_response_id: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Response"
   },
   voters: [
     {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User"
     }
   ],
   voters_count: {
     type: Number,
     default: 0
   },
  updated_at: {
    type: Date
  }
});

// questionSchema.pre('findOneAndUpdate', function(next){
//   this.findOneAndUpdate({}, { updated_at: Date.now() });
//   next();
// });

// Ecport model
module.exports = mongoose.model("Question", questionSchema);
