const express = require('express'),
      router = express.Router(),
      async = require('async'),
      middleware = require('../middleware/index.js'),
      passport = require('passport'),
      Report = require('../models/report'),
      Question = require('../models/question'),
      Response = require('../models/response'),
      Announcement = require('../models/announcement'),
      Comment = require('../models/comment'),
      User = require('../models/user');

// Get Reports
router.get('/', passport.authenticate('jwt', {session:false}), middleware.hasAccessAdmin, (req, res) => {

  let query = {};

  if(req.query.resolved === 'true'){
    query.resolved = true;
  }

  if(req.query.not_resolved === 'true'){
    query.resolved = false;
  }

  if(req.query.is_removed === 'true'){
    query.is_removed = true;
  }

  if(req.query.suspect_banned === 'true'){
    query.suspect_banned = true;
  }

  if(req.query.is_ignored === 'true'){
    query.is_ignored = true;
  }

  if(req.query.abuseType){
    query.abuseType = req.query.abuseType;
  }

  // if(req.query.last_report_id){
  //   query._id = { $lt : req.query.last_report_id }
  // }

  Report.find(query)
    .sort([['resolved', 1], ['created_at', -1]])
    .limit(20)
    .populate({path: 'suspect', select:'avatar_path'})
    .exec((err, reports) => {
    if (err) {
      return res.json({success: false, msg: err});
    }
    res.json({success: true, reports: reports});
  });
});

// Add a report
router.post('/', passport.authenticate('jwt', {session:false}), middleware.checkEnrolled,
  (req, res) => {

    let report = new Report();

    if (!req.body.abuseType) {
      return res.json({success: false, msg: 'Abuse Type was not selected'});
    }

    report.abuseType = req.body.abuseType;
    report.body = req.body.body;
    report.item_title = req.body.item_title;
    report.item_body = req.body.item_body;
    report.course_title_dashed = req.body.course_title_dashed;
    report.question_id = req.body.question_id;
    report.response_id = req.body.response_id;
    report.announcement_id = req.body.announcement_id;
    report.comment_id = req.body.comment_id;
    report.reporter = req.user._id;
    report.suspect = req.body.suspect_id;

    Report.create(report, (err, report) => {
      if(err){
        return res.json({success: false, msg: err});
      }
      User.findByIdAndUpdate(req.body.suspect_id, {$push: {reports_against: report._id}}).exec((err, user) => {
        if (err) {
          return res.json({success: false, msg: err});
        }

        res.json({success: true, msg:'Report Created', report: report});
    });
  });
});


router.put('/ban', passport.authenticate('jwt', {session:false}), middleware.hasAccessAdmin,
  (req, res) => {

    let stack = {}
    stack.report = (next) => {
      Report.update({suspect: req.body.suspect_id}, {resolved : true, suspect_banned: true}, {multi: true})
        .exec((err, res) => {
          if(err){
            return next(err, null);
          }
          return next(null, null);
        });
    }

    stack.user = (next) => {
      User.findByIdAndUpdate(req.body.suspect_id, { is_banned: true, courses_enrolled: [] }, {new: true}).exec((err, user) => {
        if (err) {
          return res.json({success: false, msg: err});
        }
        return next(null, user);
      });
    }

  async.parallel(stack, (err, results) => {
    if(err){
      return res.json({success: false, msg: err});
    }
    results.success = true;
    results.msg = 'Report resolved';
    res.json(results);
  });
});

router.patch('/ignore/:report_id', passport.authenticate('jwt', {session:false}), middleware.hasAccessAdmin,
  (req, res) => {

    let stack = {}

    stack.report = (next) => {
      Report.findByIdAndUpdate( req.params.report_id, {resolved : true, is_ignored: true})
      .populate({path: 'suspect', select:'avatar_path'})
      .exec((err, res) => {
        if(err){
          return next(err, null);
        }
        return next(null, null);
      });
    }

  async.parallel(stack, (err, results) => {
    if(err){
      return res.json({success: false, msg: err});
    }
    results.success = true;
    results.msg = 'Report resolved';
    res.json(results);
  });
});

router.delete('/questions/:question_id', passport.authenticate('jwt', {session:false}), middleware.hasAccessAdmin,
  (req, res) => {

    let stack = {}

    stack.question = (next) => {
      Question.findByIdAndRemove(req.params.question_id).exec((err, question) => {
        if(err){
          return next(err, null);
        }
        if(!question){
          return next('Question not found', null);
        }
        return next(null, question)
      });
    }

    stack.report = (next) => {
      Report.update({question_id: req.params.question_id}, {resolved : true, is_removed: true}, {multi: true})
      .populate({path: 'suspect', select:'avatar_path'})
        .exec((err, res) => {
          if(err){
            return next(err, null);
          }
          return next(null, null)
        });
    }

    stack.user = (next) => {
      User.findByIdAndUpdate(req.query.suspect_id, {$inc: {strikes: 1}}, {new: true}).exec((err, user) => {
        if (err) {
          return res.json({success: false, msg: err});
        }
        return next(null, user);
    });
  }

  async.parallel(stack, (err, results) => {
    if(err){
      return res.json({success: false, msg: err});
    }
    res.json({success: true, msg:'Report resolved', question: results.question,
              user: results.user });
  });
});

router.delete('/responses/:response_id', passport.authenticate('jwt', {session:false}), middleware.hasAccessAdmin,
  (req, res) => {

    let stack = {}

    stack.response = (next) => {
      Response.findByIdAndRemove(req.params.response_id).exec((err, response) => {
        if(err){
          return next(err, null);
        }
        if(!response){
          return next('Response not found', null);
        }
        return next(null, response)
      });
    }

    stack.report = (next) => {
      Report.update({response_id: req.params.response_id}, {resolved : true, is_removed: true}, {multi: true})
      .populate({path: 'suspect', select:'avatar_path'})
        .exec((err, res) => {
          if(err){
            return next(err, null);
          }
          return next(null, null)
        });
    }

    stack.user = (next) => {
      User.findByIdAndUpdate(req.query.suspect_id, {$inc: {strikes: 1}}, {new: true}).exec((err, user) => {
        if (err) {
          return res.json({success: false, msg: err});
        }
        return next(null, user);
      });
    }

  async.parallel(stack, (err, results) => {
    if(err){
      return res.json({success: false, msg: err});
    }
    results.success = true;
    results.msg = 'Report resolved';
    res.json(results);
  });
});

router.delete('/announcements/:announcement_id', passport.authenticate('jwt', {session:false}), middleware.hasAccessAdmin,
  (req, res) => {

    let stack = {}

    stack.announcement = (next) => {
      Announcement.findByIdAndRemove(req.params.announcement_id).exec((err, announcement) => {
        if(err){
          return next(err, null);
        }
        if(!announcement){
          return next('Announcement not found', null);
        }
        return next(null, announcement)
      });
    }

    stack.report = (next) => {
      Report.update({announcement_id: req.params.announcement_id}, {resolved : true, is_removed: true}, {multi: true})
      .populate({path: 'suspect', select:'avatar_path'})
        .exec((err, res) => {
          if(err){
            return next(err, null);
          }
          return next(null, null)
        });
    }

    stack.user = (next) => {
      User.findByIdAndUpdate(req.query.suspect_id, {$inc: {strikes: 1}}, {new: true}).exec((err, user) => {
        if (err) {
          return res.json({success: false, msg: err});
        }
        return next(null, user);
      });
    }

  async.parallel(stack, (err, results) => {
    if(err){
      return res.json({success: false, msg: err});
    }
    results.success = true;
    results.msg = 'Report resolved';
    res.json(results);
  });
});

router.delete('/comments/:comment_id', passport.authenticate('jwt', {session:false}), middleware.hasAccessAdmin,
  (req, res) => {

    let stack = {}

    stack.comment = (next) => {
      Comment.findByIdAndRemove(req.params.comment_id).exec((err, comment) => {
        if(err){
          return next(err, null);
        }
        if(!comment){
          return next('Comment not found', null);
        }
        return next(null, comment)
      });
    }

    stack.report = (next) => {
      Report.update({comment_id: req.params.comment_id}, {resolved : true, is_removed: true}, {multi: true})
      .populate({path: 'suspect', select:'avatar_path'})
        .exec((err, res) => {
          if(err){
            return next(err, null);
          }
          return next(null, null)
        });
    }

    stack.user = (next) => {
      User.findByIdAndUpdate(req.query.suspect_id, {$inc: {strikes: 1}}, {new: true}).exec((err, user) => {
        if (err) {
          return res.json({success: false, msg: err});
        }
        return next(null, user);
      });
    }

  async.parallel(stack, (err, results) => {
    if(err){
      return res.json({success: false, msg: err});
    }
    results.success = true;
    results.msg = 'Report resolved';
    res.json(results);
  });
});

module.exports = router;
