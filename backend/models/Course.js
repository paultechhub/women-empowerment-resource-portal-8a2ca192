const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  duration: { type: String, required: true },
  thumbnail: { type: String },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const courseModuleSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  content_url: { type: String },
  video_url: { type: String },
  order_index: { type: Number, required: true }
});

const courseEnrollmentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  enrolled_at: { type: Date, default: Date.now }
});

const Course = mongoose.model('Course', courseSchema);
const CourseModule = mongoose.model('CourseModule', courseModuleSchema);
const CourseEnrollment = mongoose.model('CourseEnrollment', courseEnrollmentSchema);

module.exports = { Course, CourseModule, CourseEnrollment };