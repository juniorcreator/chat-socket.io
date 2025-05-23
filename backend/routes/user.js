import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

router.put('/settings', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId, ' userId');
    console.log(req.body, ' req.body');
    // const { settings } = req.body;
    const { updatedUser } = req.body;
    console.log(updatedUser, ' updatedUser');

    if (!updatedUser || typeof updatedUser !== 'object') {
      return res.status(400).json({ msg: 'Invalid settings data' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (updatedUser.name) {
      user.name = updatedUser.name;
    }

    if (updatedUser.settings && typeof updatedUser.settings === 'object') {
      user.settings = {
        ...user.settings.toObject(), // убедимся, что это обычный объект
        ...updatedUser.settings,
      };
    }

    await user.save();

    res.json({ msg: 'Settings updated',  user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

export default router;
