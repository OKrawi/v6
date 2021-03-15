'use strict'
const Course  = require("../models/course"),
      Question = require("../models/question"),
      User = require("../models/user");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkCourseOwnership = (req, res, next) => {
  let course_title_dashed = req.params.course_title_dashed? req.params.course_title_dashed: req.body.course_title_dashed;
  Course.findOne({title_dashed: course_title_dashed, "instructors" : req.user._id}, (err, course) => {
    if(err){
      return res.json({success: false, msg: err});
    }
    if (course) {
      return next();
    }
    return res.json({success: false, msg: "The Course was not found or you don't have permission to perform this action"});
  });
};


middlewareObj.checkChapterOwnership = (req, res, next) => {
  let chapter_id = req.body.chapter_id? req.body.chapter_id: req.body.from_chapter_id;
  Course.findOne({chapters: chapter_id, "instructors" : req.user._id}, (err, course) => {
    if(err) {
      return res.json({success: false, msg: err});
    }
    if (course) {
      req.course_title_dashed = course.title_dashed;
      return next();
    }
    return res.json({success: false, msg: "The Course was not found or you don't have permission to perform this action"});
  });
};

middlewareObj.checkQuestionOwnership = (req, res, next) => {
  let question_id = req.body.question_id;
  Question.findOne({_id: question_id, user_id : req.user._id}, (err, question) => {
    if(err) {
      return res.json({success: false, msg: err});
    }
    if (question) {
      return next();
    }
    return res.json({success: false, msg: "The Question was not found or you don't have permission to perform this action"});
  });
};

// Check if the user is enrolled
middlewareObj.checkEnrolled = (req, res, next) => {
  let course_title_dashed = req.params.title_dashed || req.query.course_title_dashed || req.body.course_title_dashed;
  User.isUserEnrolled(course_title_dashed, req.user._id, (err, isEnrolled) => {
      if (err) {
        return res.json({success: false, msg: err});
      }

      if (isEnrolled) {
        next();
      } else {
        return res.redirect('/courses/' + course_title_dashed + "/preview")
        // return res.json({success: true, enrolled: isEnrolled,
        //           msg:'Please enroll in this course to continue',
        // });
      }
  });
};

// Check if the user is not enrolled
middlewareObj.checkNotEnrolled = (req, res, next) => {
  User.isUserEnrolled(req.params.course_title_dashed, req.user._id, (err, isEnrolled) => {
      if (err) {
        return res.json({success: false, msg: err});
      }
      if (!isEnrolled) {
        next();
      } else {
        return res.json({success: false, msg: 'User already enrolled', isEnrolled: isEnrolled});
      }
  });
};

// Check if the user has admin access
middlewareObj.hasAccessAdmin = (req, res, next) => {
  if (req.user && req.user.is_admin) {
    return next();
  }
  return res.json({success: false, msg: 'You do not have permission to perform this action'});
};

// Check if the user has instructor access
middlewareObj.hasAccessInstructor = (req, res, next) => {
  if (req.user && req.user.is_instructor) {
    return next();
  }
  return res.json({success: false, msg: 'You do not have permission to perform this action'});
};

// Dash the title to be displayed in the url
middlewareObj.dashTitle = (title) => {
  return title.trim().replace(/\s+/g, '-').toLowerCase();
};

// Export module
module.exports = middlewareObj;
