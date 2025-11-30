const express = require('express');
const { Mentor, MentorshipRequest } = require('../models/Mentorship');
const router = express.Router();

// Get all mentors
router.get('/mentors', async (req, res) => {
  try {
    const mentors = await Mentor.find()
      .populate('user_id', 'full_name email avatar_url')
      .sort({ rating: -1 });
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create mentor profile
router.post('/mentors', async (req, res) => {
  try {
    const mentor = new Mentor(req.body);
    await mentor.save();
    await mentor.populate('user_id', 'full_name email avatar_url');
    res.status(201).json(mentor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create mentorship request
router.post('/requests', async (req, res) => {
  try {
    const request = new MentorshipRequest(req.body);
    await request.save();
    await request.populate([
      { path: 'mentee_id', select: 'full_name email' },
      { path: 'mentor_id', populate: { path: 'user_id', select: 'full_name email' } }
    ]);
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get mentorship requests for mentor
router.get('/requests/mentor/:mentorId', async (req, res) => {
  try {
    const requests = await MentorshipRequest.find({ mentor_id: req.params.mentorId })
      .populate('mentee_id', 'full_name email avatar_url')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update mentorship request status
router.put('/requests/:requestId', async (req, res) => {
  try {
    const { status } = req.body;
    const request = await MentorshipRequest.findByIdAndUpdate(
      req.params.requestId,
      { status },
      { new: true }
    ).populate([
      { path: 'mentee_id', select: 'full_name email' },
      { path: 'mentor_id', populate: { path: 'user_id', select: 'full_name email' } }
    ]);
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single mentor
router.get('/mentors/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate('user_id', 'full_name email avatar_url');
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    res.json(mentor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update mentor profile
router.put('/mentors/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('user_id', 'full_name email avatar_url');
    res.json(mentor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete mentor profile
router.delete('/mentors/:id', async (req, res) => {
  try {
    await Mentor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Mentor profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get mentee requests
router.get('/requests/mentee/:menteeId', async (req, res) => {
  try {
    const requests = await MentorshipRequest.find({ mentee_id: req.params.menteeId })
      .populate([
        { path: 'mentor_id', populate: { path: 'user_id', select: 'full_name email avatar_url' } }
      ])
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete mentorship request
router.delete('/requests/:requestId', async (req, res) => {
  try {
    await MentorshipRequest.findByIdAndDelete(req.params.requestId);
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;