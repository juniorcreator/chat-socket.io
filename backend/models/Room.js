import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: String,
  value: String,
  active: Boolean,
  avatar: { type: String, default: '' },
  lastMessage: { type: String, default: '' },
  hasNewMessage: { type: Boolean, default: false },
  createdBy: String,
  creatorName: String,
});

export default mongoose.model('Room', roomSchema);