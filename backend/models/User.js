import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  hasNewMessagesFrom: [String],
  settings: {
    theme: { type: String, default: 'light', enum: ['light', 'dark'] },
    notifications: { type: Boolean, default: true },
  },
}, { timestamps: true });

export default mongoose.model('User', userSchema);