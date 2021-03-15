const express = require('express'),
      router = express.Router(),
      async = require('async'),
      middleware = require('../middleware/index.js'),
      passport = require('passport'),
      Course = require('../models/course'),
      User = require('../models/user'),
      Question = require('../models/question');

// Get all courses
router.get('/courses', passport.authenticate('jwt', {session:false}),
  middleware.hasAccessInstructor, (req, res) => {
  Course.find({"instructors": req.user._id}, 'title title_dashed subtitle').exec((err, courses) => {
    if (err) {
      return res.json({success: false, msg: err});
    }
    res.json({success: true, courses: courses});
  });
});

// Get one course
router.get("/courses/:title_dashed", passport.authenticate('jwt', {session:false}),
  middleware.hasAccessInstructor, (req, res) => {

    let stack = {};

    stack.getCourse = (next) => {
      Course.findOne({title_dashed: req.params.title_dashed, instructors : req.user._id})
        .exec((err, course) =>{
          if(err){
            return next(err, null);
          }
          if(!course){
            return next('Course not found', null);
          }
          next(null, course);
        });
    }

    stack.getCoursesTitles = (next) => {
      Course.find({'title_dashed': {"$ne": req.params.title_dashed}}, "title title_dashed -_id").exec((err, courses) => {
        if (err) {
          return next(err, null);
        }
        next(null, courses);
      });
    }

    stack.lecturesCount = (next) => {
      Lecture.count({course_title_dashed: req.params.title_dashed, isPublished: true }, function(err, count){
        next(null, count);
      });
    }

    stack.questionsCount = (next) => {
      Question.count({course_title_dashed: req.params.title_dashed}, function(err, count){
        next(null, count);
      });
    }

    async.parallel(stack, (err, results) => {
      if(err){
        return res.json({success: false, msg: err});
      }
      res.json({success: true, msg:'Course Found',
                course: results.getCourse,
                courses: results.getCoursesTitles,
                published_lectures_count: results.lecturesCount,
                questions_count: results.questionsCount
              });
    })
});

// Create new Course
router.post('/courses/new', passport.authenticate('jwt', {session:false}),
  middleware.hasAccessInstructor, (req, res) => {

  let course = new Course({
    title: req.body.title,
    title_dashed: middleware.dashTitle(req.body.title),
    instructors: [ req.user._id ]
  });

  Course.create(course, (err, course) => {
    if(err){
      if(err.code === 11000){
        return res.json({success: false, msg: "A course with the given name already exists"});
      }
      return res.json({success: false, msg: err});
    }
    res.json({success: true, msg:'Course Created', course: course});
  });
});

// Update - update existing course
router.put('/courses/:title_dashed', passport.authenticate('jwt', {session:false}),
  middleware.hasAccessInstructor, (req, res) => {
  let course = {}

  if(req.body.title){
    course = {
      title: req.body.title,
      img_path: req.body.img_path,
      subtitle: req.body.subtitle,
      description: req.body.description,
      level: req.body.level,
      category_title_dashed: req.body.category_title_dashed,
      prerequisites: req.body.prerequisites,
      goals: req.body.goals,
      isPublished: req.body.isPublished
    }
  } else {
    return res.json({success: false, msg: "Course title is needed"});
  }

  Course.findOneAndUpdate({title_dashed: req.params.title_dashed,
    "instructors" : req.user._id}, course, {new: true}, (err, course) => {
    if(err){
      if(err.code === 11000){
        return res.json({success: false, msg: "A course with the given name already exists"});
      }
      return res.json({success: false, msg: err});
    }
    res.json({success: true, msg:'Course Updated', course: course});
  });
});

// Get - get instructor biography
router.get('/biography', passport.authenticate('jwt', {session:false}),
  middleware.hasAccessInstructor, (req, res) => {

  User.findById(req.user._id, (err, user) => {
    if(err){
      return res.json({success: false, msg: err});
    }
    res.json({success: true, biography: user.biography, title: user.title});
  });
});

// Update - update instructor biography
router.put('/biography', passport.authenticate('jwt', {session:false}),
  middleware.hasAccessInstructor, (req, res) => {
  if(!req.body.biography || !req.body.title){
    return res.json({success: false, msg: "More info is needed"});
  }


  User.findByIdAndUpdate(req.user._id,
    {'title': req.body.title, 'biography': req.body.biography},
    {new: true},
    (err, user) => {
    if(err){
      return res.json({success: false, msg: err});
    }
    res.json({success: true, msg:'Biography Updated', biography: user.biography});
  });
});

// TODO: delete chapters - lectures - answers - announcements - images, everything!!!
// Delete - remove course from DB
router.delete("/courses/:title_dashed", passport.authenticate('jwt', {session:false}),
  middleware.hasAccessInstructor, (req, res) => {
  Course.findOneAndRemove({title_dashed: req.params.title_dashed,
    "instructors" : req.user._id}, (err, course) => {
    if(err){
      return res.json({success: false, msg: err});
    }
    // Send json data
    res.json({success: true, msg:'Course Deleted'});
  });
});

module.exports = router;
