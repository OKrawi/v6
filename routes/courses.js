const express = require('express'),
      router = express.Router(),
      async = require('async'),
      middleware = require('../middleware/index.js'),
      passport = require('passport'),
      User = require('../models/user')
      Course = require('../models/course'),
      Lecture = require('../models/lecture');

// Get all courses
router.get('/', (req, res) => {
  let query = {}
  if(req.query.category_title_dashed){
    query.category_title_dashed = req.query.category_title_dashed;
  }

  query.isPublished = true;

  Course.find(query, 'title title_dashed subtitle img_path')
    .exec((err, courses) => {
    if (err) {
      return res.json({success: false, msg: err});
    }
    res.json({success: true, courses: courses});
  });
});

// Get one course
router.get("/:title_dashed", passport.authenticate('jwt', {session:false}),
  middleware.checkEnrolled, (req, res) => {

    let stack = {};
    stack.getCourse = (next) => {
      Course.findOne({title_dashed: req.params.title_dashed, isPublished: true})
        .populate({ path: 'chapters',
          match: { lectures: {$not: {$size: 0}}, isPublished: true },
          populate: {
             path: 'lectures',
             match: { isPublished: true }
            //  , select: {'video_lecture': 0, 'created_at': 0, 'questions': 0}
          }})
        .populate({path: 'prerequisite_courses', select:'title title_dashed -_id'})
        .populate({path: 'instructors', select: "avatar_path username biography title"})
        .exec((err, course) => {
          if(err){
            return next(err, null);
          }
          if(!course){
            return next('Course not found', null);
          }

          course.chapters = course.chapters.filter((chapter) => {
            return chapter.lectures.length > 0;
          });

          next(null, course);
        });
    }

    async.parallel(stack, (err, results) => {
      if(err){
        return res.json({success: false, msg: err});
      }

      let user_course_data;

      for(let course of req.user.courses_enrolled){
        if(course.course_title_dashed === req.params.title_dashed){
          user_course_data = course;
          break;
        }
      }

      res.json({success: true, enrolled: true, msg:'Course Found',
                course: results.getCourse,
                user_course_data: user_course_data
              });
    });
});

// Get one course preview
router.get("/:title_dashed/preview", (req, res) => {
  let stack = {};
  stack.getCourse = (next) => {
    Course.findOne({title_dashed: req.params.title_dashed, isPublished: true})
      .populate({ path: 'chapters',
        match: { lectures: {$not: {$size: 0}}, isPublished: true },
        populate: {
           path: 'lectures',
           match: { isPublished: true }
          //  , select: {'video_lecture': 0, 'created_at': 0, 'questions': 0}
        }})
      .populate({path: 'prerequisite_courses', select:'title title_dashed -_id'})
      .populate({path: 'instructors', select: "avatar_path username title biography img_path"})
      .exec((err, course) => {
        if(err){
          return next(err, null);
        }
        if(!course){
          return next('Course not found', null);
        }

        course.chapters = course.chapters.filter( chapter => chapter.lectures.length > 0 )
        let lecturesCount = 0;
        course.chapters.map((chapter) => {
          lecturesCount += chapter.lectures.length;
          chapter.lectures.map((lecture) => {
              if(!lecture.isPreview){
                lecture.videoId = null;
              }
          });
        });

        course.published_lectures_count = lecturesCount;

        next(null, course);
      });
  }

  async.parallel(stack, (err, results) => {
    if(err){
      return res.json({success: false, msg: err});
    }

    res.json({success: true, enrolled: false, msg:'Course Found',
              course: results.getCourse
            });
  });
});

// Enroll in a course
router.get("/:course_title_dashed/enroll", passport.authenticate('jwt', {session:false}),
  middleware.checkNotEnrolled, (req, res) => {

  if(req.user.is_banned){
    return res.json({
      success: false,
      msg: 'You are banned from the website. Please contact website administration for further information'
    });
  }

  let update = { $inc: { enrolled_students_count: 1 }};

  Course.findOneAndUpdate({title_dashed: req.params.course_title_dashed}, update)
    .exec((err, course) => {
      if(err) {
        return res.json({success: false, msg: err});
      }
      if(!course){
        return res.json({success: false, msg: "Course not found."});
      }
      User.findByIdAndUpdate(req.user._id,
        { "$addToSet" :
          { "courses_enrolled": {
            course_title_dashed: course.title_dashed,
            date_enrolled: Date.now()
           }
          }
        }, (err, user) => {
        if (err) {
          return res.json({success: false, msg: err});
        }
      res.json({success: true, msg:'Enrolled successfully', isEnrolled: true});
    });
  });
});

router.get("/:course_title_dashed/isenrolled", passport.authenticate('jwt', {session:false}),
  middleware.checkEnrolled, (req, res) => {
  res.json({success: true, msg: "User is enrolled"});
});

module.exports = router;
