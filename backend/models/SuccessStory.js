const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  story: { type: String, required: true },
  achievement: { type: String, required: true },
  image_url: { type: String },
  is_approved: { type: Boolean, default: false },
  is_featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('SuccessStory', successStorySchema);