'use strict';

// Require modules for Mongoose
const mongoose   = require("mongoose"),
      Schema     = mongoose.Schema;

// Chapter schema setup
const chapterSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  lectures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture"
    }
  ],
  isPublished: {
    type: Boolean,
    default: false
  }
});

// Ecport model
const Chapter = module.exports = mongoose.model("Chapter", chapterSchema);

module.exports.findByIdAndRemoveLectureAtIndex = function(chapter_id, index, next){
  Chapter.findById(chapter_id).exec((err,chapter) => {
    if(err){
      return next(err, null);
    }
    if (!chapter){
      return next("Chapter not found", null);
    }
    let lecture_id = chapter.lectures[index];
    chapter.lectures.splice(index, 1);
    chapter.save((err, chapter) => {
      if(err){
        return next(err, null);
      }
      next(null, lecture_id);
    });
  });
}

module.exports.findByIdAndInsertLectureAtIndex = function(chapter_id, index, lecture_id, lecture_isPublished, next){
  Chapter.findByIdAndUpdate(chapter_id,
      {'$push': { 'lectures': {'$each': [ lecture_id ], '$position': index}}})
      .exec((err, chapter) => {
        if(err){
          return next(err);
        }
      if (!chapter){
        return next("Chapter not found");
      }

      if(!chapter.isPublished && lecture_isPublished){
        Lecture.findByIdAndUpdate(lecture_id, {isPublished: false}).exec((err, lecture) => {
          if(err){
            return next(err);
          }

          Course.findOneAndUpdate({chapters: chapter_id}, {$inc: {published_lectures_count: -1}})
            .exec((err, course) => {
              if(err){
                return next(err);
              }
              User.update({'courses_enrolled.watched_lectures_ids': lecture_id },
              {'$pull': {'courses_enrolled.$.watched_lectures_ids': lecture_id }}, {multi: true})
              .exec((err, course) => {
                if(err){
                  return next(err);
                }
                next(null);
              });
          });
        });
      } else {
        next(null);
      }
   });
 }
