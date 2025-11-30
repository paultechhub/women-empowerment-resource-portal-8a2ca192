const express = require('express');
const SuccessStory = require('../models/SuccessStory');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get all approved success stories
router.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    const filter = { is_approved: true };
    if (featured === 'true') filter.is_featured = true;
    
    const stories = await SuccessStory.find(filter)
      .populate('user_id', 'full_name avatar_url')
      .sort({ createdAt: -1 });
    
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create success story
router.post('/', auth, async (req, res) => {
  try {
    const story = new SuccessStory({
      ...req.body,
      user_id: req.user._id
    });
    await story.save();
    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending stories (admin only)
router.get('/pending', adminAuth, async (req, res) => {
  try {
    const stories = await SuccessStory.find({ is_approved: false })
      .populate('user_id', 'full_name email');
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve story (admin only)
router.put('/:id/approve', adminAuth, async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndUpdate(
      req.params.id,
      { is_approved: true },
      { new: true }
    );
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature story (admin only)
router.put('/:id/feature', adminAuth, async (req, res) => {
  try {
    const { is_featured } = req.body;
    const story = await SuccessStory.findByIdAndUpdate(
      req.params.id,
      { is_featured },
      { new: true }
    );
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete story
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await SuccessStory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;