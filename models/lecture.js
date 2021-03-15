'use strict';

// Require modules for Mongoose
const mongoose   = require("mongoose"),
      Schema     = mongoose.Schema;

// Lecture schema setup
const lectureSchema= new Schema({
  title: {
    type:String,
    required: true,
    trim: true
  },
  videoId: {
    type: String
  },
  videoDuration: {
    type: String
  },
  body: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true
  },
  isPreview: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  course_title_dashed: {
    type: String,
    required: true,
    ref: 'Course'
  }
});

// Export model
const Lecture = module.exports = mongoose.model("Lecture", lectureSchema);

// module.exports.unPublish = function(lectures_ids, next){
//
//   Lecture.update({_id: {"$in" : lectures_ids}}, {isPublished: false})
//     .exec((err, results) => {
//       if(err) {
//         return next(err);
//       }
//       if (!lecture){
//         return next("Lecture not found");
//       }
//
//       User.update({'courses_enrolled.watched_lectures_ids': {'$in': lectures_ids }},
//         {'$pull': {'courses_enrolled.$.watched_lectures_ids': lectures_ids }})
//         .exec((err, results) => {
//           if(err) {
//             return next(err);
//           }
//           next(null);
//         });
//   });
// }
