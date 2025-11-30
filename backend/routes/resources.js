const express = require('express');
const { Resource, ResourceBookmark } = require('../models/Resource');
const router = express.Router();

// Get all resources
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const filter = category ? { category } : {};
    
    const resources = await Resource.find(filter)
      .populate('created_by', 'full_name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Resource.countDocuments(filter);
    
    res.json({
      resources,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create resource
router.post('/', async (req, res) => {
  try {
    const resource = new Resource(req.body);
    await resource.save();
    await resource.populate('created_by', 'full_name');
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bookmark resource
router.post('/bookmark', async (req, res) => {
  try {
    const { user_id, resource_id } = req.body;
    
    const existingBookmark = await ResourceBookmark.findOne({ user_id, resource_id });
    if (existingBookmark) {
      return res.status(400).json({ message: 'Resource already bookmarked' });
    }

    const bookmark = new ResourceBookmark({ user_id, resource_id });
    await bookmark.save();
    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user bookmarks
router.get('/bookmarks/:userId', async (req, res) => {
  try {
    const bookmarks = await ResourceBookmark.find({ user_id: req.params.userId })
      .populate('resource_id');
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single resource
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('created_by', 'full_name');
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update resource
router.put('/:id', async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('created_by', 'full_name');
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete resource
router.delete('/:id', async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove bookmark
router.delete('/bookmark/:id', async (req, res) => {
  try {
    await ResourceBookmark.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;