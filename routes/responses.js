const express = require('express'),
      router = express.Router(),
      middleware = require('../middleware/index.js'),
      passport = require('passport'),
      Question = require('../models/question'),
      Response = require('../models/response');

// Get Responses
router.get('/', (req, res) => {

  let query = {};

  if(req.query.question_id){
    query.question_id = req.query.question_id;
  }

  if(req.query.last_response_id){
    query._id = { $gt : req.query.last_response_id }
  }

  Response.find(query)
    .limit(12)
    .populate({
      path: 'user',
      select: "avatar_path username"
    })
    .exec((err, responses) => {
    if (err) {
      return res.json({success: false, msg: err});
    }
    res.json({success: true, responses: responses});
  });
});

// // Add an asnwer
router.post('/', passport.authenticate('jwt', {session:false}), middleware.checkEnrolled, (req, res) => {
  let response = { }

  if(req.body.response_body){
    response.body = req.body.response_body;
    response.user = req.user._id;
    response.question = req.body.question_id;
  } else {
    return res.json({success: false, msg: "Response title is needed"});
  }

  Response.create(response, (err, response) => {
    if(err){
      return res.json({success: false, msg: err});
    }
    Question.findByIdAndUpdate(req.body.question_id,
      {
        '$push': { responses: response._id },
        '$inc': { responses_count: 1 },
        '$addToSet': { followers: req.user._id }
      }, {new: true}, (err, question) => {
      if(err){
        return res.json({success: false, msg: err});
      }
      Response.populate(response, {path: 'user', select: 'avatar_path username'}, (err, response) => {
        if(err){
          return res.json({success: false, msg: err});
        }
        res.json({success: true, msg:'Response Added', response: response });
      });
    });
  });
});

// Edit an response
router.put('/:response_id', passport.authenticate('jwt', {session:false}), (req, res) => {

  let query = {}

  query._id = req.params.response_id;
  query.user = req.user._id;

  update = {
    body: req.body.response_body,
    updated_at : new Date()
  }

  Response.findOneAndUpdate(
    query, update, {new: true})
    .populate({
      path: 'user',
      select: "avatar_path username"
    })
      .exec((err, response) => {
        if(err) {
          return res.json({success: false, msg: err});
        }
        if (!response){
          return res.json({success: false, msg: "Response not found or you don't have permission to edit this asnwer"});
        }
       res.json({success: true, msg:'Response Updated', response: response});
    });
});

router.patch('/:response_id/vote', passport.authenticate('jwt', {session:false}), middleware.checkEnrolled, (req, res) => {

  // let query = {}
  // query._id = req.params.response_id;

  Response.findById(req.params.response_id).exec((err, response) => {
    if(err) {
      return res.json({success: false, msg: err});
    }
    if (!response){
      return res.json({success: false, msg: "Response not found or you don't have permission to edit this asnwer"});
    }

    let user = req.user._id;

    if(response.voters.indexOf(user) < 0 && req.body.voters_count === 1 ){
      response.voters_count++;
      response.voters.push(user);
    } else if(response.voters.indexOf(user) > -1 && req.body.voters_count === -1 ){
      response.voters_count--;
      response.voters.splice(response.voters.indexOf(user), 1);
    }

    response.save((err, response) => {
      if(err){
        return res.json({success: false, msg: err});
      }
      Response.populate(response, {path: 'user', select: 'avatar_path username'}, (err, response) => {
        if(err){
          return res.json({success: false, msg: err});
        }
        res.json({success: true, msg:'Response Updated', response: response});
      });
    });
  });
});

// Delete an response
router.delete('/', passport.authenticate('jwt', {session:false}),
                  //  middleware.checkEnrolled,
                   (req, res) => {

  let query = {};

  query._id = req.body.response_id;

  if(!req.user.is_admin){
    query.user = req.user._id;
  }

  Response.findOneAndRemove(query).exec((err, response) => {
    if(err){
      return res.json({success: false, msg: err});
    }
    if(!response){
      return res.json({success: false, msg: "Response not found or you don't have permission to delete this response"});
    }
    Question.findByIdAndUpdate(req.body.question_id,
      {'$pull': {'responses': req.body.response_id}, '$inc': {responses_count: -1}})
      .exec((err, question) => {
        if (err) {
          return res.json({success: false, msg: err});
        }
        if(!question){
          return res.json({success: false, msg: "Question not found or you don't have permission to delete from this question"});
        }
        res.json({success: true, msg: 'Response Deleted'});
      });
  });
});

module.exports = router;
