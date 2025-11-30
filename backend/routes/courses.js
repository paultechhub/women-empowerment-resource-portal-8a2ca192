const express = require('express');
const { Course, CourseModule, CourseEnrollment } = require('../models/Course');
const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const { level, page = 1, limit = 10 } = req.query;
    const filter = level ? { level } : {};
    
    const courses = await Course.find(filter)
      .populate('created_by', 'full_name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create course
router.post('/', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enroll in course
router.post('/enroll', async (req, res) => {
  try {
    const { user_id, course_id } = req.body;
    
    const existingEnrollment = await CourseEnrollment.findOne({ user_id, course_id });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = new CourseEnrollment({ user_id, course_id });
    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get course modules
router.get('/:courseId/modules', async (req, res) => {
  try {
    const modules = await CourseModule.find({ course_id: req.params.courseId })
      .sort({ order_index: 1 });
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update enrollment progress
router.put('/enrollment/:enrollmentId/progress', async (req, res) => {
  try {
    const { progress } = req.body;
    const enrollment = await CourseEnrollment.findByIdAndUpdate(
      req.params.enrollmentId,
      { progress },
      { new: true }
    );
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('created_by', 'full_name');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update course
router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('created_by', 'full_name');
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete course
router.delete('/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add course module
router.post('/:courseId/modules', async (req, res) => {
  try {
    const module = new CourseModule({
      ...req.body,
      course_id: req.params.courseId
    });
    await module.save();
    res.status(201).json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update course module
router.put('/modules/:moduleId', async (req, res) => {
  try {
    const module = await CourseModule.findByIdAndUpdate(
      req.params.moduleId,
      req.body,
      { new: true }
    );
    res.json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete course module
router.delete('/modules/:moduleId', async (req, res) => {
  try {
    await CourseModule.findByIdAndDelete(req.params.moduleId);
    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user enrollments
router.get('/user/:userId/enrollments', async (req, res) => {
  try {
    const enrollments = await CourseEnrollment.find({ user_id: req.params.userId })
      .populate('course_id');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;