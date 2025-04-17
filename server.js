const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Mock database
const users = [];

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    // In a real app, hash the password and save to a database
    users.push({ name, email, password, isEmailVerified: false });
    res.json({ message: "Sign up successful", token: "mock-token", isEmailVerified: false });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({ message: "Login successful", token: "mock-token", isEmailVerified: user.isEmailVerified });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

app.post('/send-verification', (req, res) => {
    const { email } = req.body;
    // In a real app, send an email with a code
    console.log(`Verification code for ${email}: 123456`);
    res.json({ message: "Verification code sent" });
});

app.post('/verify-code', (req, res) => {
    const { email, code } = req.body;
    // In a real app, verify the code against a stored value
    if (code === "123456") {
        const user = users.find(u => u.email === email);
        if (user) {
            user.isEmailVerified = true;
            res.json({ message: "Email verified successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } else {
        res.status(400).json({ message: "Invalid code" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
