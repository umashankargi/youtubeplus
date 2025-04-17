const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Configuration values
const JWT_SECRET = '7c4a8d09ca3762af61e59520943dc26494f8941b'; // Replace with a secure secret
const GMAIL_USER = 'burana212620@gmail.com'; // Replace with your Gmail address
const GMAIL_PASS = 'elja eyvt svph hasw'; // Replace with your Gmail App Password
const PORT = 3000;

// In-memory storage for users and OTPs
const users = [];
const otps = new Map();

// Nodemailer transporter configuration for Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS
    }
});

// Middleware to verify JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
}

// Signup endpoint
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
        name,
        email,
        password: hashedPassword,
        isEmailVerified: false
    };
    users.push(user);

    // Generate JWT
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Signup successful! Please verify your email.', token, isEmailVerified: false });
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token, isEmailVerified: user.isEmailVerified });
});

// Send verification code endpoint
app.post('/send-verification', authenticateToken, async (req, res) => {
    const email = req.user.email;

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otps.set(email, otp);

    // Email options
    const mailOptions = {
        from: GMAIL_USER,
        to: email,
        subject: 'Email Verification Code',
        text: `Your verification code is: ${otp}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Verification code sent to your email' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send verification code' });
    }
});

// Verify OTP endpoint
app.post('/verify-code', authenticateToken, (req, res) => {
    const { code } = req.body;
    const email = req.user.email;

    const storedOtp = otps.get(email);
    if (!storedOtp || storedOtp !== code) {
        return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Mark email as verified
    const user = users.find(user => user.email === email);
    if (user) {
        user.isEmailVerified = true;
    }

    // Clear OTP
    otps.delete(email);

    res.status(200).json({ message: 'Email verified successfully' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
