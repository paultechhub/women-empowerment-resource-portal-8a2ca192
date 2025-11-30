const express = require('express');
const { Mentor } = require('../models/Mentorship');
const SuccessStory = require('../models/SuccessStory');
const User = require('../models/User');
const UserRole = require('../models/UserRole');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [totalUsers, totalMentors, pendingMentors, pendingStories] = await Promise.all([
      User.countDocuments(),
      Mentor.countDocuments({ is_approved: true }),
      Mentor.countDocuments({ is_approved: false }),
      SuccessStory.countDocuments({ is_approved: false })
    ]);

    res.json({
      totalUsers,
      totalMentors,
      pendingMentors,
      pendingStories
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all pending approvals
router.get('/pending-approvals', adminAuth, async (req, res) => {
  try {
    const [mentors, stories] = await Promise.all([
      Mentor.find({ is_approved: false }).populate('user_id', 'full_name email'),
      SuccessStory.find({ is_approved: false }).populate('user_id', 'full_name email')
    ]);

    res.json({ mentors, stories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve item
router.put('/approve/:type/:id', adminAuth, async (req, res) => {
  try {
    const { type, id } = req.params;
    let result;

    if (type === 'mentor') {
      result = await Mentor.findByIdAndUpdate(id, { is_approved: true }, { new: true });
    } else if (type === 'story') {
      result = await SuccessStory.findByIdAndUpdate(id, { is_approved: true }, { new: true });
    } else {
      return res.status(400).json({ message: 'Invalid type' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject item
router.delete('/reject/:type/:id', adminAuth, async (req, res) => {
  try {
    const { type, id } = req.params;

    if (type === 'mentor') {
      await Mentor.findByIdAndDelete(id);
    } else if (type === 'story') {
      await SuccessStory.findByIdAndDelete(id);
    } else {
      return res.status(400).json({ message: 'Invalid type' });
    }

    res.json({ message: 'Item rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Manage user roles
router.post('/users/:userId/roles', adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    const userRole = new UserRole({
      user_id: req.params.userId,
      role
    });
    await userRole.save();
    res.status(201).json(userRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove user role
router.delete('/users/:userId/roles/:role', adminAuth, async (req, res) => {
  try {
    await UserRole.findOneAndDelete({
      user_id: req.params.userId,
      role: req.params.role
    });
    res.json({ message: 'Role removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;