import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const candidate = await User.findOne({ email });
    if (candidate) return res.status(400).json({ msg: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hash,
      avatar: '', // default
      settings: {
        theme: 'light',
        notifications: true,
      },
    });

    await newUser.save();

    res.status(201).json({ msg: 'User registered' });
  } catch (err) {
    res.status(500).json({ msg: 'Error', error: err.message });
  }
});

//login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ msg: 'Неверный email или пароль' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      status: 'ok',
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        settings: user.settings,
      },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Ошибка сервера при логине' });
  }
});

export default router;
