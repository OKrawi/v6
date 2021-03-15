const express = require('express'),
      router = express.Router(),
      async = require('async'),
      middleware = require('../middleware/index.js'),
      passport = require('passport'),
      Course = require('../models/course'),
      User = require('../models/user'),
      Chapter = require('../models/chapter');
      Lecture = require('../models/lecture');

// Get a course's curriculum
router.get("/curriculum", passport.authenticate('jwt', {session:false}),
  middleware.hasAccessInstructor, (req, res) => {
  Course.findOne({title_dashed: req.query.course_title_dashed,
    "instructors" : req.user._id}, 'chapters')
      .populate({
         path: 'chapters',
         populate: {
           path: 'lectures',
           select: {'video_lecture': 0, 'created_at': 0, 'questions': 0}
         }
      })
      .exec((err, course) => {
        if(err){
          return res.json({success: false, msg: err});
        }
        if(!course){
          return res.json({success: false, msg: 'Course not found'});
        }
        res.json({success: true, msg:'Course Found', chapters: course.chapters});
      });
});

// Add a chapter
router.post('/', passport.authenticate('jwt', {session:false}),
  middleware.hasAccessInstructor, (req, res) => {

    let chapter = new Chapter();

    if(req.body.chapter_title){
      chapter.title = req.body.chapter_title;
    } else {
      return res.json({success: false, msg: "Chapter title is needed"});
    }

    Course.findOneAndUpdate({title_dashed: req.body.course_title_dashed,
      "instructors" : req.user._id},
      {'$push': {chapters: chapter._id}}).exec((err, course) => {
        if(err){
          return res.json({success: false, msg: err});
        }
        if(!course){
          return res.json({success: false, msg: 'Course not found'});
        }

        Chapter.create(chapter, (err, chapter) => {
          if(err){
            return res.json({success: false, msg: err});
          }

          res.json({success: true, msg:'Chapter Created', chapter: chapter});
      });
  });
});

router.patch('/', passport.authenticate('jwt', {session:false}),
  middleware.hasAccessInstructor, (req, res) => {

    let update = {}

    if(req.body.chapter_title){
      update.title = req.body.chapter_title;
      update.isPublished = req.body.isPublished;
    } else {
      return res.json({success: false, msg: "Chapter title is needed"});
    }

    let course_update = {}

    if(req.body.chapter_isPublished){
      course_update = {
        $inc : { published_lectures_count: - req.body.published_lectures_count}
      }
    }

    Course.findOneAndUpdate({"instructors" : req.user._id, chapters: req.body.chapter_id}, course_update)
      .exec((err, course) => {
        if(err) {
          return res.json({success: false, msg: err});
        }
        if (!course){
          return res.json({success: false, msg: "The Course was not found or you don't have permission to perform this action"});
        }

        Chapter.findByIdAndUpdate(req.body.chapter_id, update,
          {new: true, select: {'video_chapter': 0, 'created_at': 0, 'questions': 0}})
            .exec((err, chapter) => {
              if(err) {
                return res.json({success: false, msg: err});
              }
              if (!chapter){
                return res.json({success: false, msg: 'Chapter not found'});
              }

              if (!chapter.isPublished && req.body.chapter_isPublished) {
                Lecture.update({'_id' : { $in: chapter.lectures }}, {isPublished : chapter.isPublished}, {multi: true})
                  .exec((err, results) => {
                    if(err){
                      return res.json({success: false, msg: err});
                    }

                    User.update({'courses_enrolled.watched_lectures_ids': {$in: chapter.lectures}},
                      {$pullAll: {'courses_enrolled.$.watched_lectures_ids': chapter.lectures }}, {multi: true})
                      .exec((err, results) => {
                        if(err){
                          return res.json({success: false, msg: err});
                        }
                        res.json({success: true, msg:'Chapter Updated', chapter: chapter, results: results});
                      });
                  });
              } else {
                res.json({success: true, msg:'Chapter Updated', chapter: chapter});
              }
            });
      });
});

router.put('/', passport.authenticate('jwt', {session:false}),
  middleware.hasAccessInstructor, (req, res) => {
  Course.findByTitleDashedAndReorderChapter(req.body.course_title_dashed,
    req.body.from_index, req.body.to_index, req.user._id, (err) => {
      if(err) {
        return res.json({success: false, msg: err});
      }
      res.json({success: true, msg: 'Chapters Reordered'});
  });
});


router.delete('/', passport.authenticate('jwt', {session:false}),
  middleware.hasAccessInstructor, (req, res) => {
    let stack= [];

    stack[0] = (next) => {

      update = {
        $pull: {chapters : req.body.chapter_id},
        $inc: {
          total_lectures_count: - req.body.total_lectures_count,
          published_lectures_count: -req.body.published_lectures_count}
      }

      Course.findOneAndUpdate({"instructors" : req.user._id, chapters: req.body.chapter_id},
        update, {new: true})
        .exec((err, course) => {
          if(err) {
            return next(err, null);
          }
          if (!course){
            return next('Course not found', null);
          }
          next(null, course);
        });
    }

    stack[1] = (course, next) => {
      Chapter.findByIdAndRemove(req.body.chapter_id, (err, chapter) => {
        if(err) {
          return next(err, null);
        }
        if (!chapter){
          return next('Chapter not found', null);
        }
        next(null, chapter.lectures);
      });
    }

    stack[2] = (lectures, next) => {
      Lecture.remove({_id: {$in: lectures}}, (err, results) => {
        if(err){
          return next(err, null);
        }
        next(null, lectures);
      });
    }

    stack[3] = (lectures, next) => {
      User.update({'courses_enrolled.watched_lectures_ids': {$in: lectures}},
        {$pullAll: {'courses_enrolled.$.watched_lectures_ids': lectures }}, {multi: true})
        .exec((err, results) => {
          if(err){
            return next(err, null);
          }
          next(null, results);
        });
      }

    async.waterfall(stack, (err, results) => {
      if(err){
        return res.json({success: false, msg: err});
      }

      res.json({success: true, msg:'Chapter deleted'});
    });
});

module.exports = router;
