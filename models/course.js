'use strict';

// Require modules for Mongoose
const mongoose   = require("mongoose"),
      Schema     = mongoose.Schema;

// Course schema setup
const courseSchema = new Schema({
  title: {
    type: String,
    index: {
      unique: true
    },
    required: true,
    trim: true
  },
  title_dashed: {
    type: String,
    index: {
      unique: true
    },
    required: true,
    trim: true
  },
  img_path: {
    type: String
  },
  previewVideoPath: {
    type: String
    // ,
    // required: true
  },
  subtitle: {
    type: String
  },
  description: {
    type: String
  },
  level: {
    type: Number,
    required: true,
    default: 1
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true
  },
  chapters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter"
    }
  ],
  total_lectures_count: {
    type: Number,
    default: 0
  },
  published_lectures_count: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  instructors:  [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  prerequisites: [
    {
      type: String,
      ref: "Course"
    }
  ],
  goals: [
    {
      type: String
    }
  ],
  enrolled_students_count: {
    type: Number
  },
  finished_students_count: {
    type: Number
  },
  category_title_dashed: {
    type: String
  }
}, { toJSON: { virtuals: true } });

courseSchema.virtual('prerequisite_courses', {
  ref: 'Course',
  localField: 'prerequisites',
  foreignField: 'title_dashed',
  justOne: false
});

// Export model
const Course = module.exports = mongoose.model("Course", courseSchema);

module.exports.findByTitleDashedAndReorderChapter = function(course_title_dashed, from_index, to_index, instructor_id, next){

  Course.findOne({title_dashed: course_title_dashed,
    "instructors.instructor_id" : instructor_id})
    .select('chapters').exec((err, course) => {
      if(err) {
        return next(err);
      }
      if (!course){
        return next("Course not found");
      }

      let chapters_length = course.chapters.length;

      // This is here so that we don't get out of index error and have our server crash
      if(to_index > chapters_length || to_index < 0
          || from_index > chapters_length || from_index < 0 ) {
        return next("Index out of bounds");
      }

      course.chapters.splice(to_index, 0, course.chapters.splice(from_index, 1)[0]);

      course.save((err) => {
        if(err) {
          return next(err);
        }
        next(null);
      });
  });
}
