const express = require('express'),
      router = express.Router(),
      middleware = require('../middleware/index.js'),
      passport = require('passport'),
      Question = require('../models/question');

// Get Questions
router.get('/', passport.authenticate('jwt', {session:false}), (req, res) => {

  let query = {};

  if(req.query.lecture_id){
    query.lecture_id = req.query.lecture_id;
  }

  if(req.query.course_title_dashed){
    query.course_title_dashed = req.query.course_title_dashed;
  }

  if(req.query.last_question_id){
    query._id = { $lt : req.query.last_question_id }
  }

  if(req.query.search){
    query.title = new RegExp(escapeRegex(req.query.search), 'gi');
  }

  if (req.query.no_responses === "true") {
    query.responses_count = 0;
  }

  if (req.query.see_following === "true") {
    query.followers = req.user._id;
  }
  let sort = '-created_at';

  if (req.query.sort_by_popularity  === "true") {
    sort = '-responses_count -created_at';
  }

  Question.find(query)
    .sort(sort)
    .limit(10)
    .populate({
      path: 'responses',
      options: {limit: 12},
      populate: {
        path: 'user',
        select: 'avatar_path username'
      }
    })
    .populate({
      path: 'user',
      select: 'avatar_path username'
    })
    .exec((err, questions) => {
    if (err) {
      return res.json({success: false, msg: err});
    }
    res.json({success: true, questions: questions});
  });
});

// Get a question
router.get('/:question_id', (req, res) => {
  let query = {};

  query._id = req.params.question_id;
  query.course_title_dashed = req.query.course_title_dashed;

  Question.findOne(query)
  .populate({
    path: 'responses',
    options: {limit: 12},
    populate: {
      path: 'user',
      select: 'avatar_path username'
    }
  })
  .populate({
  path: 'user',
  select: 'avatar_path username'
  })
  .exec((err, question) => {
    if (err) {
      return res.json({success: false, msg: err});
    }
    if (!question) {
      return res.json({success: false, msg: 'Question not found'});
    }
    res.json({success: true, question: question});
  });
});

// // Add a question
router.post('/', passport.authenticate('jwt', {session:false}), middleware.checkEnrolled, (req, res) => {

  let question = new Question();

  if(req.body.question_title){
    question.title = req.body.question_title;
    question.body = req.body.question_body;
    question.lecture_id = req.body.lecture_id;
    question.course_title_dashed = req.body.course_title_dashed;
    question.user = req.user._id;
    question.followers = [req.user._id];
  } else {
    return res.json({success: false, msg: "Question title is needed"});
  }

  Question.create(question, (err, question) => {
    if(err){
      return res.json({success: false, msg: err});
    }

    Question.populate(question, {path: 'user', select: 'avatar_path username'}, (err, quesiton) => {
      if(err){
        return res.json({success: false, msg: err});
      }
      res.json({success: true, msg:'Question Created', question: question});
    });
  });
});

// Edit a question
router.patch('/:question_id', passport.authenticate('jwt', {session:false}), (req, res) => {
    let question = {}

    if(req.body.question_title){
      question.title = req.body.question_title;
      question.body = req.body.question_body;
      question.updated_at = new Date();
    } else {
      return res.json({success: false, msg: "Question title is needed"});
    }

    Question.findOneAndUpdate({_id: req.params.question_id, user: req.user._id }, question,
      {new: true})
      .populate({
        path: 'user',
        select: 'avatar_path username'
      })
      .exec((err, question) => {
        if(err) {
          return res.json({success: false, msg: err});
        }
        if (!question){
          return res.json({success: false, msg: "Question not found or you don't have permission to edit this question"});
        }
       res.json({success: true, msg:'Question Updated', question: question});
    });
});

router.patch('/:question_id/follow', passport.authenticate('jwt', {session:false}), (req, res) => {

  let update = {};

  if(!req.body.following){
    update = { '$addToSet': { followers : req.user._id }};
  } else {
    update = { '$pull': { followers: req.user._id }}
  }

  Question.findByIdAndUpdate(req.params.question_id, update, { new: true })
    .exec((err, question) => {
      if(err) {
        return res.json({success: false, msg: err});
      }
      if (!question){
        return res.json({success: false, msg: "Question not found or you don't have permission to edit this question"});
      }
     res.json({success: true, msg:'Question Updated', question: question});
    });
});

router.patch('/:question_id/vote', passport.authenticate('jwt', {session:false}), middleware.checkEnrolled, (req, res) => {

  let update = {};

  if(req.body.vote){
    update = {
      '$addToSet':{ voters: req.user._id },
      '$inc': { voters_count: 1 }
    }
  } else {
    update = {
      '$pull':{ voters: req.user._id },
      '$inc': { voters_count: -1 }
    }
  }


  Question.findByIdAndUpdate(req.params.question_id, update, { new: true }).exec((err, question) => {
    if(err) {
      return res.json({success: false, msg: err});
    }
    if (!question){
      return res.json({success: false, msg: "Question not found"});
    }
    res.json({success: true, msg:'Question Updated', question: question});
  });
});


// Edit a question
router.patch('/:question_id/top-response', passport.authenticate('jwt', {session:false}), (req, res) => {

    let query = {
      _id: req.params.question_id,
      user: req.user._id
    }
    let update = {}

    if(req.body.remove_top_response_id){
      update.top_response_id = null;
    } else {
      update.top_response_id = req.body.top_response_id;

    }

    Question.findOneAndUpdate(query, update,
      {new: true})
      .populate({
        path: 'user',
        select: 'avatar_path username'
      })
      .exec((err, question) => {
        if(err) {
          return res.json({success: false, msg: err});
        }
        if (!question){
          return res.json({success: false, msg: "Question not found or you don't have permission to edit this question"});
        }
       res.json({success: true, msg:'Question Updated', question: question});
    });
});

// Delete a question
router.delete('/:question_id', passport.authenticate('jwt', {session:false}), (req, res) => {
  let query = {};

  query._id = req.params.question_id;

  if(!req.user.is_admin){
    query.user = req.user._id;
  }

  Question.findOneAndRemove(query)
    .exec((err, question) => {
    if (err) {
      return res.json({success: false, msg: err});
    }
    if(!question){
      return res.json({success: false, msg: "Question not found or you don't have permission to delete this question"});
    }
    res.json({success: true, question: question});
  });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
