const express = require('express');
const { ChatRoom, ChatMessage } = require('../models/Chat');
const router = express.Router();

// Get all chat rooms
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await ChatRoom.find()
      .populate('created_by', 'full_name')
      .sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create chat room
router.post('/rooms', async (req, res) => {
  try {
    const room = new ChatRoom(req.body);
    await room.save();
    await room.populate('created_by', 'full_name');
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages for a room
router.get('/rooms/:roomId/messages', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    const messages = await ChatMessage.find({ room_id: req.params.roomId })
      .populate('sender_id', 'full_name avatar_url')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send message
router.post('/rooms/:roomId/messages', async (req, res) => {
  try {
    const message = new ChatMessage({
      ...req.body,
      room_id: req.params.roomId
    });
    await message.save();
    await message.populate('sender_id', 'full_name avatar_url');
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single room
router.get('/rooms/:id', async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.id)
      .populate('created_by', 'full_name');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update room
router.put('/rooms/:id', async (req, res) => {
  try {
    const room = await ChatRoom.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('created_by', 'full_name');
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete room
router.delete('/rooms/:id', async (req, res) => {
  try {
    await ChatRoom.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete message
router.delete('/messages/:id', async (req, res) => {
  try {
    await ChatMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;