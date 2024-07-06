import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/Users.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const userByUsername = await UserModel.findOne({ username });
    const userByEmail = await UserModel.findOne({ email });
    if (userByUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    if (userByEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'Username does not exist' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Incorrect password' });
    }
    const token = jwt.sign({ id: user._id }, "secret");
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/checkEmail', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (user) {
      res.status(200).json({ emailExists: true });
    } else {
      res.status(200).json({ emailExists: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/resetPassword', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Email does not exist' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Get all rules
router.get('/rules', async (req, res) => {
  try {
    const rules = await Rule.find();
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new rule
router.post('/rules', async (req, res) => {
  try {
    const { windowNumber, temperature, lux, tintLevel } = req.body;
    const newRule = new Rule({ windowNumber, temperature, lux, tintLevel });
    await newRule.save();
    res.status(201).json(newRule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a rule
router.delete('/rules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Rule.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as userRouter };
