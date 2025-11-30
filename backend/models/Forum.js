const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true }
}, { timestamps: true });

const forumCommentSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true }
}, { timestamps: true });

const forumLikeSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const ForumPost = mongoose.model('ForumPost', forumPostSchema);
const ForumComment = mongoose.model('ForumComment', forumCommentSchema);
const ForumLike = mongoose.model('ForumLike', forumLikeSchema);

module.exports = { ForumPost, ForumComment, ForumLike };