const express = require('express'),
      router = express.Router(),
      middleware = require('../middleware/index.js'),
      passport = require('passport'),
      Announcement = require('../models/announcement');

// Get Announcements
router.get('/', (req, res) => {

  let query = {};

  if(req.query.course_title_dashed){
    query.course_title_dashed = req.query.course_title_dashed;
  }

  // if(req.query.search){
  //   query.title = new RegExp(escapeRegex(req.query.search), 'gi');
  // }

  if(req.query.last_announcement_id){
    query._id = { $lt : req.query.last_announcement_id }
  }

  Announcement.find(query)
    .sort('-created_at')
    .limit(10)
    .populate({
      path: 'comments',
      options: {limit: 8, sort: '-created_at'},
      populate: {
        path: 'user',
        select: 'avatar_path username'
      }
    })
    .populate({
      path: 'user',
      select: 'avatar_path username'
    })
    .exec((err, announcements) => {
    if (err) {
      return res.json({success: false, msg: err});
    }
    res.json({success: true, announcements: announcements});
  });
});

router.get('/:announcement_id', (req, res) => {

  let query = {};

  query._id = req.params.announcement_id;
  query.course_title_dashed = req.query.course_title_dashed;

  Announcement.findOne(query)
    .populate({
      path: 'comments',
      options: {limit: 8, sort: '-created_at'},
      populate: {
        path: 'user',
        select: 'avatar_path username'
      }
    })
    .populate({
      path: 'user',
      select: 'avatar_path username'
    })
    .exec((err, announcement) => {
    if (err) {
      return res.json({success: false, msg: err});
    }
    if(!announcement){
      return res.json({success: false, msg: "Announcement not found!"});
    }
    res.json({success: true, announcement: announcement});
  });
});

// Add a announcement
router.post('/',passport.authenticate('jwt', {session:false}),
  middleware.hasAccessInstructor, middleware.checkCourseOwnership,
    (req, res) => {

  let announcement = new Announcement();

  if(req.body.announcement_title && req.body.announcement_body){
    announcement.title = req.body.announcement_title;
    announcement.body = req.body.announcement_body;
    announcement.course_title_dashed = req.body.course_title_dashed;
    announcement.user = req.user._id;
  } else {
    return res.json({success: false, msg: "Announcement title and body are needed"});
  }

  Announcement.create(announcement, (err, announcement) => {
    if(err){
      return res.json({success: false, msg: err});
    }
    Announcement.populate(announcement, {path: 'user', select: 'avatar_path username'}, (err, announcement) => {
      if(err){
        return res.json({success: false, msg: err});
      }
      res.json({success: true, msg:'Announcement Created', announcement: announcement});
    });
  });
});

// Edit a announcement
router.patch('/', passport.authenticate('jwt', {session:false}),
  middleware.hasAccessInstructor, middleware.checkCourseOwnership,
    (req, res) => {

      let announcement = {}

      if(req.body.announcement_title){
        announcement.title = req.body.announcement_title;
        announcement.body = req.body.announcement_body;
      } else {
        return res.json({success: false, msg: "Announcement title and body are needed"});
      }

      let query = {}
      query._id = req.body.announcement_id;

      Announcement.findOneAndUpdate(query, announcement,
        {new: true})
        .populate({
          path: 'user',
          select: 'avatar_path username'
        })
        .exec((err, announcement) => {
          if(err) {
            return res.json({success: false, msg: err});
          }
          if (!announcement){
            return res.json({success: false, msg: "Announcement not found or you don't have permission to edit this announcement"});
          }
         res.json({success: true, msg:'Announcement Updated', announcement: announcement});
      });
});

// Delete a announcement
router.delete('/:announcement_id', passport.authenticate('jwt', {session:false}),
  middleware.hasAccessInstructor, middleware.checkCourseOwnership,
    (req, res) => {

    let query = {};

    query._id = req.params.announcement_id;

    Announcement.findOneAndRemove(query)
      .exec((err, announcement) => {
      if (err) {
        return res.json({success: false, msg: err});
      }
      if(!announcement){
        return res.json({success: false, msg: "Announcement not found or you don't have permission to delete this announcement"});
      }
      res.json({success: true, announcement: announcement});
    });
});

module.exports = router;
