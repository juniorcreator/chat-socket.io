import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: String,
  value: String,
  active: Boolean,
  avatar: { type: String, default: '' },
  lastMessage: { type: String, default: '' },
  createdBy: String,
  creatorName: String,
});

export default mongoose.model('Room', roomSchema);