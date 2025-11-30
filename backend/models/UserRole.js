const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['admin', 'user', 'mentor'], required: true }
}, { timestamps: true });

userRoleSchema.index({ user_id: 1, role: 1 }, { unique: true });

module.exports = mongoose.model('UserRole', userRoleSchema);