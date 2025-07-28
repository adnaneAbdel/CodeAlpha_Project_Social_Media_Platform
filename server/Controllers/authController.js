const TableUser = require('../Database/user')
const {generateToken} = require('./jwt')
const bcrypt = require('bcrypt')




exports.Login = async (req, res , next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await TableUser.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        location: user.location,
        profilePicture: user.profilePicture,
        followersCount: user.followers.length,
        followingCount: user.following.length
      }
    });
  } catch (error) {
    return next(error)
  }
};
exports.Register = async (req, res, next) => {
  const { username, email, password, bio, location, profilePicture } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await TableUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new TableUser({
      username,
      email,
      password: hashedPassword,
      bio: bio || '',
      location: location || '',
      profilePicture: profilePicture || '',
      followers: [],
      following: [],
      createdAt: new Date()
    });

    await newUser.save();

    const token = generateToken(newUser);

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        bio: newUser.bio,
        location: newUser.location,
        profilePicture: newUser.profilePicture
      }
    });
  } catch (error) {
    return next(error)
  }
};

