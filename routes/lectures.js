const express = require('express'),
      router = express.Router(),
      async = require('async'),
      middleware = require('../middleware/index.js'),
      passport = require('passport'),
      User = require('../models/user'),
      Course = require('../models/course'),
      Chapter = require('../models/chapter'),
      Lecture = require('../models/lecture');

router.get('/', passport.authenticate('jwt', {session:false}), middleware.checkEnrolled, (req, res) => {
  Lecture.findOne({_id: req.query.lecture_id, isPublished: true, course_title_dashed: req.query.course_title_dashed }, (err, lecture) => {
    if(err){
      return res.json({success: false, msg: err});
    }
    if(!lecture){
      return res.json({success: false, msg: 'Lecture not found'});
    }
    User.findOneAndUpdate({_id: req.user._id, courses_enrolled: {'$elemMatch': {'course_title_dashed': req.query.course_title_dashed }}},
    { $addToSet : { 'courses_enrolled.$.watched_lectures_ids': lecture._id }, $set : {'courses_enrolled.$.last_lecture_id' : lecture._id }}, {new: true},
      (err, user) => {
      if (err) {
        return res.json({success: false, msg: err});
      }
      res.json({success: true, msg:'Lecture Found', lecture: lecture});
    });
  });
});

router.get('/preview', (req, res) => {
  Lecture.findOne({_id: req.query.lecture_id, isPreview: true}, (err, previewLecture) => {
    if(err){
      return res.json({success: false, msg: err});
    }
    if(!previewLecture){
      return res.json({success: false, msg: 'Lecture not found'});
    }
    res.json({success: true, msg:'Lecture Found', previewLecture: previewLecture});
  });
});

// Add a lecture
router.post('/', passport.authenticate('jwt', {session:false}),
  middleware.hasAccessInstructor, middleware.checkChapterOwnership, (req, res) => {

    let lecture = new Lecture();

    if(req.body.lecture_title){
      lecture.title = req.body.lecture_title;
      lecture.course_title_dashed = req.course_title_dashed;
    } else {
      return res.json({success: false, msg: "Lecture title is needed"});
    }

    let stack = {}

    stack.lecture = (next) => {
      Lecture.create(lecture, (err, lecture) => {
        if(err){
          return next(err, null);
        }
        next(null, lecture);
      });
    }

    stack.chapter = (next) => {
      Chapter.findByIdAndUpdate(req.body.chapter_id, {'$push': {lectures: lecture._id}})
        .exec((err, chapter) => {
        if(err){
          return next(err, null);
        }
        if(!chapter){
          return next('Chapter not found', null);
        }
        next(null, null);
      });
    }

    stack.course = (next) => {
      Course.findOneAndUpdate({title_dashed: req.course_title_dashed}, {$inc: {total_lectures_count: 1}})
        .exec((err, course) => {
          if(err){
            return next(err, null);
          }
          next(null, null);
        });
    }

    async.parallel(stack, (err, results) => {
      if(err){
        return res.json({success: false, msg: err});
      }

      let res_lecture = {
        _id: results.lecture._id,
        title: results.lecture.title,
        isPreview: results.lecture.isPreview,
        isPublished: results.lecture.isPublished
      }

        res.json({success: true, msg:'Lecture Created', lecture: res_lecture});
    });
});

// Edit a lecture
router.patch('/', passport.authenticate('jwt', {session:false}),
  middleware.hasAccessInstructor,  middleware.checkChapterOwnership, (req, res) => {

    let update = {}

    if(req.body.title){
      update = {
        title: req.body.title,
        body: req.body.body,
        isPreview: req.body.isPreview,
        isPublished: req.body.isPublished && req.body.chapter_isPublished,
        videoDuration: null
      }
      if(req.body.videoId){
        update.videoId = req.body.videoId;
        update.videoDuration = req.body.videoDuration;
      }
    } else {
      return res.json({success: false, msg: "Lecture title is needed"});
    }

    let stack = {}

    stack.lecture = (next) => {
      Lecture.findByIdAndUpdate(req.body.lecture_id, update,
        {new: true, select: {'video_lecture': 0, 'created_at': 0, 'questions': 0}})
          .exec((err, lecture) => {
            if(err) {
              return next(err, null);
            }
            if (!lecture) {
              return next('Lecture not found', null);
            }
            next(null, lecture);
      });
    }

    if(!update.isPublished && req.body.lecture_isPublished){
      stack.user = (next) => {
        User.update({'courses_enrolled.watched_lectures_ids': req.body.lecture_id },
        {'$pull': {'courses_enrolled.$.watched_lectures_ids': req.body.lecture_id }}, {multi: true})
        .exec((err, results) => {
          if(err){
            return next(err, null);
          }
          next(null, null);
        });
      }

      stack.course = (next) =>{
        let update = {
            $inc : { published_lectures_count: -1 },
          }

        Course.findOneAndUpdate({title_dashed: req.course_title_dashed}, update)
          .exec((err, course) => {
            if(err){
              return next(err, null);
            }
            next(null, null);
          });
      }
    }

    if(update.isPublished && !req.body.lecture_isPublished){
      stack.course = (next) =>{
        let update = {
            $inc : { published_lectures_count: 1 },
          }

        Course.findOneAndUpdate({title_dashed: req.course_title_dashed}, update)
          .exec((err, course) => {
            if(err){
              return next(err, null);
            }
            next(null, null);
          });
      }
    }


    async.parallel(stack, (err, results) => {
      if(err){
        return res.json({success: false, msg: err});
      }
      update._id = req.body.lecture_id;
      res.json({success: true, msg:'Lecture Updated', lecture: update});
    });
});

router.put('/', passport.authenticate('jwt', {session:false}),
  middleware.hasAccessInstructor, middleware.checkChapterOwnership, (req, res) => {
    Chapter.findByIdAndRemoveLectureAtIndex(req.body.from_chapter_id, req.body.from_lecture_index, (err, lecture_id) => {
      if(err){
        return res.json({success: false, msg: err});
      }
      Chapter.findByIdAndInsertLectureAtIndex(
        req.body.to_chapter_id,
        req.body.to_lecture_index,
        lecture_id,
        req.body.lecture_isPublished,
        (err) => {
        if(err){
          return res.json({success: false, msg: err});
        }
         res.json({success: true, msg:'Lecture Relocated'});
      });
   });
});

router.delete('/', passport.authenticate('jwt', {session:false}),
  middleware.hasAccessInstructor, middleware.checkChapterOwnership, (req, res) => {

    let stack = {}

    stack.lecture = (next) => {
      Lecture.findByIdAndRemove(req.body.lecture_id, (err, lecture) => {
        if(err) {
          return next(err, null);
        }
        if (!lecture){
          return next('Lecture not found', null);
        }
        next(null, lecture);
      });
    }

    stack.chapter = (next) => {
      Chapter.findByIdAndUpdate(req.body.chapter_id, {"$pull" : {lectures : req.body.lecture_id}})
          .exec((err, chapter) => {
          if(err){
            return next(err, null);
          }
          if (!chapter){
            return next('Chapter not found', null);
          }
          next(null, null);
      });
    }

    stack.course = (next) => {

      let update = {}

      if(req.body.lecture_isPublished){
        update = {
          $inc : { total_lectures_count: -1, published_lectures_count: -1 },
        }
      } else {
        update = {
          $inc : { total_lectures_count: -1 },
        }
      }

      Course.findOneAndUpdate({title_dashed: req.course_title_dashed}, update)
        .exec((err, course) => {
          if(err){
            return next(err, null);
          }
          next(null, null);
        });
    }

// TODO: last lecture id should also be updated
    stack.user = (next) => {
      User.update({'courses_enrolled.watched_lectures_ids': req.body.lecture_id },
        {'$pull': {'courses_enrolled.$.watched_lectures_ids': req.body.lecture_id }}, {multi: true})
        .exec((err, course) => {
        if(err){
          return next(err, null);
        }
        next(null, null);
      });
    }

    async.parallel(stack, (err, results) => {
      if(err){
        return res.json({success: false, msg: err});
      }
      res.json({success: true, msg:'Lecture Deleted'});
    });

});


module.exports = router;
