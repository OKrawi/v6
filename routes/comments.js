const express = require('express'),
      router = express.Router(),
      middleware = require('../middleware/index.js'),
      passport = require('passport'),
      Announcement = require('../models/announcement'),
      Comment = require('../models/comment');

// Get Comments
router.get('/', (req, res) => {

  let query = {};

  if(req.query.announcement){
    query.announcement = req.query.announcement;
  }

  if(req.query.last_comment_id){
    query._id = { $lt : req.query.last_comment_id }
  }

  Comment.find(query)
    .sort('-created_at')
    .limit(8)
    .populate({
      path: 'user',
      select: 'avatar_path'
    })
    .exec((err, comments) => {
    if (err) {
      return res.json({success: false, msg: err});
    }
    res.json({success: true, comments: comments});
  });
});

// Add a comment
router.post('/', passport.authenticate('jwt', {session:false}), middleware.checkEnrolled, (req, res) => {
  let comment = { }

  if(req.body.comment_body){
    comment.body = req.body.comment_body;
    comment.user = req.user._id;
    comment.announcement = req.body.announcement;
  } else {
    return res.json({success: false, msg: "Announcement title is needed"});
  }

  Comment.create(comment, (err, comment) => {
    if(err){
      return res.json({success: false, msg: err});
    }
    Announcement.findByIdAndUpdate(req.body.announcement, {'$push': {comments: comment._id}}, {new: true}, (err, announcement) => {
      if(err){
        return res.json({success: false, msg: err});
      }
      if(!announcement){
        return res.json({success: false, msg: "Announcement not found"});
      }
      Comment.populate(comment, {path: 'user', select: 'avatar_path'}, (err, comment) => {
        if(err){
          return res.json({success: false, msg: err});
        }
        res.json({success: true, msg:'Comment Added', comment: comment});
      });
    });
  });
});

// Edit a comment
router.patch('/:comment_id', passport.authenticate('jwt', {session:false}), (req, res) => {

  let query = {}

  query._id = req.body.comment_id;
  query.user = req.user._id;

  Comment.findOneAndUpdate(
    query, {body: req.body.comment_body}, {new: true})
    .populate({
      path: 'user',
      select: 'avatar_path'
    })
    .exec((err, comment) => {
      if(err) {
        return res.json({success: false, msg: err});
      }
      if (!comment){
        return res.json({success: false, msg: "Comment not found or you don't have permission to edit this comment"});
      }
     res.json({success: true, msg:'Comment Updated', comment: comment});
  });
});

// Delete a comment
router.delete('/', passport.authenticate('jwt', {session:false}), (req, res) => {

  let query = {};

  query._id = req.body.comment_id;

  if(!req.user.is_admin){
    query.user = req.user._id;
  }

  Comment.findOneAndRemove(query, (err, comment) => {
    if (err) {
      return res.json({success: false, msg: err});
    }
    if(!comment){
      return res.json({success: false, msg: "Comment not found or you don't have permission to delete this comment"});
    }
    Announcement.findOneAndUpdate(req.body.announcement,
      {'$pull': {'comments': req.body.comment_id}})
      .exec((err, announcement) => {
        if (err) {
          return res.json({success: false, msg: err});
        }
        if(!announcement){
          return res.json({success: false, msg: "Announcement not found or you don't have permission to delete this comment"});
        }
        res.json({success: true, msg: 'Comment Deleted'});
      });
  });
});

module.exports = router;
