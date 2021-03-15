const express = require('express'),
      router = express.Router(),
      // mongoose = require('mongoose'),
      passport = require('passport'),
      middleware = require('../middleware/index.js'),
      multer = require('multer'),
      fs = require('fs'),
      sharp = require('sharp'),
      Course = require('../models/course'),
      User = require('../models/user'),
      Image = require('../models/image');

      var ObjectID = require('mongodb').ObjectID;


const maxSize = 2 * 1024 * 1024;

const profile_img_dest = './uploads/users/';
const avatar_dest = './uploads/avatar/';
const courses_dest = './uploads/courses/';

const users_storage = multer.diskStorage({
  destination: function (req, file, next) {
    next(null, profile_img_dest);
  },
  filename: function (req, file, next) {
    next(null, req.user._id.toString());
    // next(null, 'default');
  }
});

const courses_storage = multer.diskStorage({
  destination: function (req, file, next) {
    next(null, courses_dest);
  },
  filename: function (req, file, next) {
    next(null, req.params.course_title_dashed);
  }
});

const imageFilter = function (req, file, next) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return next(new Error('Only image files are allowed!'), false);
    }
    next(null, true);
};

const onFileSizeLimit = function (file) {
                          fs.unlink('./' + file.path);
                        }

const onFilesLimit = function () {
                      console.log('Crossed file limit!')
                    }

const onError = function (error, next) {
                  console.log(error)
                  next(error)
                }

const users_upload = multer({
  storage : users_storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: maxSize,
    files: 1
   },
  onFileSizeLimit: onFileSizeLimit,
  onFilesLimit: onFilesLimit,
  onError: onError
}).single('file');

const courses_upload = multer({
  storage : courses_storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: maxSize,
    files: 1
   },
  onFileSizeLimit: onFileSizeLimit,
  onFilesLimit: onFilesLimit,
  onError: onError
}).single('file');

router.post('/avatar/upload', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  users_upload(req,res,function(err) {
    if(err) {
      return res.sendStatus(400);
    }
    sharp(req.file.path).resize(50, 50).toFile(avatar_dest + '/' + req.file.filename, (err, buf) => {
      if(err){
        return res.json({success: false, msg: err});
      }
      Image.findOneAndRemove({ user_id: req.user._id.toString() }, (err, image) => {
        if(err){
          return res.json({success: false, msg: err});
        }

        req.file.user_id = req.user._id;
        req.file.avatar_path = avatar_dest + req.file.filename;

        let ext = '.' + req.file.mimetype.substr(req.file.mimetype.lastIndexOf('/') + 1);
        req.file.filename = req.file.filename + ext;

        let img_path = 'http://localhost:8080/images/user/' + req.file.filename;
        let avatar_path = 'http://localhost:8080/images/avatar/' + req.file.filename;

        Image.create(req.file, (err, image) => {
          if(err){
            return res.json({success: false, msg: err});
          }

          User.findByIdAndUpdate(req.user._id, {img_path: img_path, avatar_path: avatar_path}, {new: true}, (err, user) => {
            if(err){
              return res.json({success: false, msg: err});
            }
            res.json({success: true, img_path: img_path});
          });
        });
      });
    });
  });
});

router.post('/courses/upload/:course_title_dashed', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  courses_upload(req,res,function(err) {
    if(err) {
      return res.sendStatus(400);
    }
    Image.findOneAndRemove({ course_title_dashed: req.params.course_title_dashed }, (err, image) => {
      if(err){
        return res.json({success: false, msg: err});
      }

      req.file.course_title_dashed = req.params.course_title_dashed;
      let ext = '.' + req.file.mimetype.substr(req.file.mimetype.lastIndexOf('/') + 1);
      req.file.filename = req.file.filename + ext;
      let img_path = 'http://localhost:8080/images/course/' + req.file.filename;

      Image.create(req.file, (err, image) => {
        if(err){
          return res.json({success: false, msg: err});
        }
        Course.findOneAndUpdate({title_dashed: req.params.course_title_dashed}, {img_path: img_path}, {new: true},(err, course) => {
          if(err){
            return res.json({success: false, msg: err});
          }
          res.json({success: true});
        });
      });
    });
  });
});

router.get('/course/:filename', (req,res,next) => {
  Image.findOne({filename: req.params.filename}, (err, image) => {
    if(err){
      return res.json({success: false, msg: err});
    }
    if(!image){
      return res.json({success: false, msg: 'Image not Found'});
    }
    if (fs.existsSync(image.path)) {
        res.setHeader('Content-Type', image.mimetype);
        fs.createReadStream(image.path).pipe(res);
    } else {
      res.sendStatus(404)
    }
  });
});

router.get('/user/:filename', (req,res,next) => {
  Image.findOne({filename: req.params.filename}, (err, image) => {
      if(err){
        return res.json({success: false, msg: err});
      }
      if(!image){
        return res.json({success: false, msg: 'Image not Found'});
      }
      if (fs.existsSync(image.path)) {
          res.setHeader('Content-Type', image.mimetype);
          fs.createReadStream(image.path).pipe(res);
      } else {
        res.sendStatus(404)
      }
    });
});

router.get('/avatar/:filename', (req,res,next) => {
  Image.findOne({filename: req.params.filename}, (err, image) => {
      if(err){
        return res.json({success: false, msg: err});
      }
      if(!image){
        return res.json({success: false, msg: 'Image not Found'});
      }
      if (fs.existsSync(image.avatar_path)) {
          res.setHeader('Content-Type', image.mimetype);
          fs.createReadStream(image.avatar_path).pipe(res);
      } else {
        res.sendStatus(404);
      }
    });
});

router.get('/promo/:filename', (req, res, next) => {
  Image.findOne({filename: req.params.filename}, (err, image) => {
    if(err){
      return res.json({success: false, msg: err});
    }
    if(!image){
      return res.json({success: false, msg: "Image not Found"});
    }
    if(fs.existsSync(image.path)){
      res.setHeader('Content-Type', image.mimetype);
      fs.createReadStream(image.path).pipe(res);
    } else {
      res.sendStatus(404);
    }
  });
});

module.exports = router;
