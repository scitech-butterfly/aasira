import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  'https://scitech-butterfly.github.io/aasira',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// MongoDB Connection with better error handling
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Missing MONGODB_URI in .env");
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ Connected to MongoDB');
  console.log('📦 Database:', mongoose.connection.name);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'organizer'], required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Course Progress Schema
const courseProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moduleStatuses: [{
    moduleId: { type: Number, required: true },
    status: { type: String, enum: ['locked', 'unlocked', 'completed'], default: 'locked' }
  }],
  quizResults: [{
    moduleId: { type: Number, required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    completedAt: { type: Date, default: Date.now }
  }],
  lastUpdated: { type: Date, default: Date.now }
});

// Ensure one progress document per user
courseProgressSchema.index({ userId: 1 }, { unique: true });

const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// AUTHENTICATION ROUTES

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, role, organizerKey } = req.body;

    // Validate input
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Username, password, and role are required' });
    }

    // Validate organizer key
    if (role === 'organizer' && organizerKey !== '2025') {
      return res.status(400).json({ error: 'Invalid organizer key' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      username: username.toLowerCase(),
      password: hashedPassword,
      role
    });

    await user.save();
    console.log('✅ User registered:', username, 'Role:', role);

    // Initialize course progress for students
    if (role === 'student') {
      const initialProgress = new CourseProgress({
        userId: user._id,
        moduleStatuses: [
          { moduleId: 1, status: 'unlocked' },
          { moduleId: 2, status: 'locked' },
          { moduleId: 3, status: 'locked' },
          { moduleId: 4, status: 'locked' },
          { moduleId: 5, status: 'locked' },
          { moduleId: 6, status: 'locked' }
        ],
        quizResults: []
      });
      await initialProgress.save();
      console.log('✅ Course progress initialized for:', username);
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    console.log('✅ User logged in:', username);

    // Generate token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// COURSE PROGRESS ROUTES

// Get user's course progress
app.get('/api/progress', authenticateToken, async (req, res) => {
  try {
    let progress = await CourseProgress.findOne({ userId: req.user.id });

    if (!progress) {
      // Initialize progress if it doesn't exist
      progress = new CourseProgress({
        userId: req.user.id,
        moduleStatuses: [
          { moduleId: 1, status: 'unlocked' },
          { moduleId: 2, status: 'locked' },
          { moduleId: 3, status: 'locked' },
          { moduleId: 4, status: 'locked' },
          { moduleId: 5, status: 'locked' },
          { moduleId: 6, status: 'locked' }
        ],
        quizResults: []
      });
      await progress.save();
      console.log('✅ Course progress initialized for user:', req.user.username);
    }

    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Server error fetching progress' });
  }
});

// Update course progress
app.put('/api/progress', authenticateToken, async (req, res) => {
  try {
    const { moduleStatuses, quizResult } = req.body;

    let progress = await CourseProgress.findOne({ userId: req.user.id });

    if (!progress) {
      progress = new CourseProgress({
        userId: req.user.id,
        moduleStatuses: [],
        quizResults: []
      });
    }

    if (moduleStatuses) {
      progress.moduleStatuses = moduleStatuses;
    }

    if (quizResult) {
      progress.quizResults.push(quizResult);
      console.log('✅ Quiz result saved:', req.user.username, 'Module:', quizResult.moduleId, 'Passed:', quizResult.passed);
    }

    progress.lastUpdated = new Date();
    await progress.save();

    res.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Server error updating progress' });
  }
});

// Get all students' progress (for organizers/admins)
app.get('/api/progress/all', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const allProgress = await CourseProgress.find()
      .populate('userId', 'username')
      .sort({ lastUpdated: -1 });

    res.json(allProgress);
  } catch (error) {
    console.error('Error fetching all progress:', error);
    res.status(500).json({ error: 'Server error fetching progress' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    dbName: mongoose.connection.name
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Aasira API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/register, /api/auth/login',
      progress: '/api/progress',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});