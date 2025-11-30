const express = require('express');
const { ForumPost, ForumComment, ForumLike } = require('../models/Forum');
const router = express.Router();

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const filter = category ? { category } : {};
    
    const posts = await ForumPost.find(filter)
      .populate('user_id', 'full_name avatar_url')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create post
router.post('/posts', async (req, res) => {
  try {
    const post = new ForumPost(req.body);
    await post.save();
    await post.populate('user_id', 'full_name avatar_url');
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get post comments
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const comments = await ForumComment.find({ post_id: req.params.postId })
      .populate('user_id', 'full_name avatar_url')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create comment
router.post('/posts/:postId/comments', async (req, res) => {
  try {
    const comment = new ForumComment({
      ...req.body,
      post_id: req.params.postId
    });
    await comment.save();
    await comment.populate('user_id', 'full_name avatar_url');
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like/unlike post
router.post('/posts/:postId/like', async (req, res) => {
  try {
    const { user_id } = req.body;
    const existingLike = await ForumLike.findOne({ post_id: req.params.postId, user_id });
    
    if (existingLike) {
      await ForumLike.findByIdAndDelete(existingLike._id);
      res.json({ message: 'Post unliked' });
    } else {
      const like = new ForumLike({ post_id: req.params.postId, user_id });
      await like.save();
      res.status(201).json({ message: 'Post liked' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single post
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('user_id', 'full_name avatar_url');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update post
router.put('/posts/:id', async (req, res) => {
  try {
    const post = await ForumPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('user_id', 'full_name avatar_url');
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete post
router.delete('/posts/:id', async (req, res) => {
  try {
    await ForumPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update comment
router.put('/comments/:id', async (req, res) => {
  try {
    const comment = await ForumComment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('user_id', 'full_name avatar_url');
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete comment
router.delete('/comments/:id', async (req, res) => {
  try {
    await ForumComment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get post likes
router.get('/posts/:postId/likes', async (req, res) => {
  try {
    const likes = await ForumLike.find({ post_id: req.params.postId })
      .populate('user_id', 'full_name');
    res.json(likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;