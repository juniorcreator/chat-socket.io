import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  room: String,
  sender: String,
  userEmail: String,
  toEmail: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  type: { type: String, enum: ['room', 'private'], default: 'room' },
});

export default mongoose.model('Message', messageSchema);