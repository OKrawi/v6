const mongoose = require('mongoose'),
      bcrypt = require('bcryptjs'),
      config = require('../config/database'),
      passport   = require('passport'),
      passportLocalMongoose = require('passport-local-mongoose'),
      Schema                = mongoose.Schema;


// Badge schema setup
// To award users with badges to motivate to participate
const badgeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  data_earned: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  _id : false
});

// Courses Meta data schema setup:
// To view which courses is currently enrolled in
// and which lecture they are at/ which lectures they finished
const courseMetaSchema = new Schema({
  course_title_dashed: {
    type: String,
    required: true
  },
  finished_course:{
    type: Boolean,
    default: false
  },
  last_lecture_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture"
  },
  watched_lectures_ids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture"
    }
  ],
  date_enrolled: {
    type: Date,
    required: true
  }
}, {
  _id : false
});

// User schema
const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is Required"],
    index : {unique: true},
    trim: true
  },
  username: {
    type: String,
    trim: true,
    max: 20
  },
  password: {
    type: String,
  },
  img_path: {
    type: String,
    default: 'http://localhost:8080/images/user/default.png'
  },
  avatar_path: {
    type: String,
    default: 'http://localhost:8080/images/avatar/default.png'
  },
  is_admin: {
    type: Boolean,
    default: false
  },
  is_instructor: {
    type: Boolean,
    default: false
  },
  title: {
    type: String
  },
  biography: {
    type: String
  },
  is_banned: {
    type: Boolean,
    default: false
  },
  joined_at: {
    type: Date,
    default: Date.now,
    required: true
   },
   last_seen_at: {
     type: Date,
     default: Date.now
   },
   badges: [
    badgeSchema
   ],
   courses_enrolled: [
     courseMetaSchema
   ],
   reports_against: [
     {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Report"
     }
   ],
   strikes: {
     type: Number,
     default: 0
   }
});

userSchema.virtual('courses', {
  ref: 'Course',
  localField: 'courses_enrolled.course_title_dashed',
  foreignField: 'title_dashed',
  justOne: false
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

userSchema.plugin(passportLocalMongoose, {usernameField: "email"});

const User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserById = function(id, next) {
  User.findById(id, next);
}

module.exports.getUserByEmail = function(email, next) {
  const query = {email: email}
  User.findOne(query, next);
}

module.exports.registerUser = function(newUser, next) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      User.register(newUser, newUser.password, (err, newUser) => {
        if (err) return next(err);
        next();
      });
    });
  });
}

module.exports.isUserEnrolled = function(course_title_dashed, user_id, next) {
  // Look up the courses which this user is enrolled in
  User.findById(user_id, "courses_enrolled", (err, user) => {
    if (err) {
      return next(err, null);
    }
    var isEnrolled = false;
    // Check if this course is one of them
    user.courses_enrolled.forEach(function(course_enrolled){
      if(course_enrolled.course_title_dashed === course_title_dashed){
        isEnrolled = true;
        return;
      }
    });
    return next(null, isEnrolled);
  });
}

module.exports.changePassword = function(user_id, newPassword, next) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newPassword, salt, (err, hash) => {
      if(err) throw err;
      User.findByIdAndUpdate(user_id, {password: hash}, (err, user) => {
        if (err) return next(err);
        next();
      });
    });
  });
}





// Check if the user is logged in
// module.exports.isLoggedIn = function(req, res, next){
//   if(req.isAuthenticated()){
//     return next();
//   }
  // res.redirect("back");
// }


module.exports.comparePassword = function(candidatePassword, hash, next){
  // if (candidatePassword === undefined || candidatePassword === null) {
  //   next(null, false);
  // } else {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if(err) throw err;
      next(null, isMatch);
    });
  // }
}
