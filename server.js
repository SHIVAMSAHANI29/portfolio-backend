// server.js
// Entry point for the portfolio backend API.
const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { generalLimiter } = require('./middleware/rateLimiter');

const contactRoutes = require('./routes/contactRoutes');
const projectRoutes = require('./routes/projectRoutes');
const certificationRoutes = require('./routes/certificationRoutes');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();

// ---------- Database ----------
connectDB();

// ---------- Security middleware ----------
app.use(helmet());

const allowedOrigins = [
    "https://shivamsahani29.github.io"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.options("*", cors());

// ---------- Body parsing ----------
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ---------- Sanitize input against NoSQL injection ----------
app.use(mongoSanitize());

// ---------- General rate limiting ----------
app.use('/api', generalLimiter);

// ---------- Health check ----------
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running.' });
});

// ---------- Routes ----------
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// ---------- Error handling (must be last) ----------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Guard against unhandled promise rejections crashing the process silently
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});
