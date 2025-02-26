require("dotenv").config();
const nodemailer = require("nodemailer");

let otpStore = {}; // Temporary OTP storage

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send OTP function
exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    const mailOptions = {
        from: `"SmartAgriCommerce" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}. It is valid for 5 minutes.`
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log("✅ OTP Sent:", result);
        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("❌ Email Sending Failed:", error);
        res.status(500).json({ error: "Failed to send OTP. Check server logs." });
    }
};

// Verify OTP function
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    console.log(`🔍 Verifying OTP for ${email}: Received ${otp}, Expected ${otpStore[email]}`);

    if (!otpStore[email]) {
        return res.status(400).json({ success: false, error: "OTP expired or not found" });
    }

    if (otpStore[email] !== otp) {
        return res.status(400).json({ success: false, error: "Invalid OTP. Please try again." });
    }

    delete otpStore[email]; // OTP verified, remove it from storage
    return res.json({ success: true, message: "OTP verified successfully" });
};



// gxtm gege yzal qqqi