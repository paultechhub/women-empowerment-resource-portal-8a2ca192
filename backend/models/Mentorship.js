const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, required: true },
  expertise: [{ type: String }],
  availability: { type: String },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  is_approved: { type: Boolean, default: false },
  experience_years: { type: Number, default: 0 },
  hourly_rate: { type: Number },
  total_sessions: { type: Number, default: 0 }
}, { timestamps: true });

const mentorshipRequestSchema = new mongoose.Schema({
  mentee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
}, { timestamps: true });

const Mentor = mongoose.model('Mentor', mentorSchema);
const MentorshipRequest = mongoose.model('MentorshipRequest', mentorshipRequestSchema);

module.exports = { Mentor, MentorshipRequest };