const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['funding', 'digital skills', 'mentorship', 'policy', 'other'], required: true },
  file_url: { type: String, required: true },
  thumbnail_url: { type: String },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const resourceBookmarkSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resource_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true }
}, { timestamps: true });

const Resource = mongoose.model('Resource', resourceSchema);
const ResourceBookmark = mongoose.model('ResourceBookmark', resourceBookmarkSchema);

module.exports = { Resource, ResourceBookmark };