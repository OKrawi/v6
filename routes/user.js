const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      jwt = require('jsonwebtoken'),
      middleware = require('../middleware/index.js'),
      config = require('../config/database'),
      User = require('../models/user');

router.get('/', passport.authenticate('jwt', {session:false}), (req, res) => {
  User.findById(req.user._id)
  .select("email username img_path avatar_path courses_enrolled")
    .populate({
      path: 'courses',
      select:'title title_dashed img_path published_lectures_count',
      match: {'isPublished': true}})
      .exec((err, user) => {
      if (err) {
        return res.json({success: false, msg: err});
      }
      res.json({success: true, user: user});
    });
});

router.put('/profile', passport.authenticate('jwt', {session:false}), (req, res) => {
  let update = {
    username: req.body.username.substring(0, 20)
  }
  User.findByIdAndUpdate(req.user._id, update, {new: true}, (err, user) => {
    if(err){
      return res.json({success: false, msg: err});
    }
    res.json({success: true, msg:'User updated', user: user});
  });
});



router.put('/password', passport.authenticate('jwt', {session:false}), (req, res) => {

  if (req.body.oldPassword != req.body.oldPassword2) {
    return res.json({success: false, msg: "Old passwords don't match"});
  }

  User.comparePassword(req.body.oldPassword, req.user.password, (err, isMatch) => {
    if(err) throw err;
    if(isMatch){
      User.changePassword(req.user._id, req.body.newPassword, (err) => {
        if(err){
          return res.json({success: false, msg: err});
        }
        return res.json({success: true})
      })
    } else {
      return res.json({success: false, msg: 'Wrong password'});
    }
  });
});


// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    email: req.body.email,
    username: req.body.username.substring(0, 20),
    password: req.body.password,
    role: "role_user"
  });

  User.registerUser(newUser, (err, user) => {
    if(err) {
      if (err.name === "UserExistsError") {
        return res.json({success: false, msg: "A user with the given email is already registered"});
      }
      // res.json({success: false, msg: err.message});
    } else {
      res.json({success: true, msg:'User registered'});
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'Email not found, need help?'});
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user.toJSON(), config.secret, {
          // expiresIn: 604800 // 1 week
        });
        res.json({
          success: true,
          token: 'Bearer ' + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            is_admin: user.is_admin,
            is_instructor: user.is_instructor
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});


router.get('/admin', passport.authenticate('jwt', {session:false}), middleware.hasAccessAdmin, (req, res) => {
  return res.json({success: true, msg: 'Welcome back :)'});
});

router.get('/instructor', passport.authenticate('jwt', {session:false}), middleware.hasAccessInstructor, (req, res) => {
  return res.json({success: true, msg: 'Welcome back :)'});
});

module.exports = router;
