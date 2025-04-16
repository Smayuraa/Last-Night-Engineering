import express from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "../models/User.js";
import { isLoggedIn, validateUser } from "../middlewares.js";

dotenv.config();

const router = express.Router();
const { FRONTEND_URL, JWT_SECRET, EMAIL_USER, EMAIL_PASS } = process.env;

if (!FRONTEND_URL || !JWT_SECRET || !EMAIL_USER || !EMAIL_PASS) {
  console.error("Missing required environment variables. Check .env file.");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  tls: { rejectUnauthorized: false },
});

const otpStorage = new Map();

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStorage.set(email, otp);
    await transporter.sendMail({
      from: `Last Night Engineering <${EMAIL_USER}>`,
      to: email,
      subject: "🔒 Secure Account Verification - Last Night Engineering",
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="text-align: center; color: #333; margin-bottom: 10px;">🔑 Email Verification</h2>
          <p style="font-size: 16px; color: #555;">Dear Learner,</p>
          <p style="font-size: 16px; color: #555;">We received a request to verify your email for Last Night Engineering. Use the OTP below to complete the process:</p>
          <p style="font-size: 24px; font-weight: bold; text-align: center; color: #333; background: #ff6600; padding: 15px; border-radius: 5px; color: #fff;">${otp}</p>
          <p style="font-size: 14px; color: #777; text-align: center;">This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
          <div style="text-align: center; margin-top: 20px;">
            <h3 style="display: inline-block; background: #ff6600; color: #fff; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">Verify Now</a>
          </div>
          <p style="font-size: 14px; color: #777; margin-top: 20px; text-align: center;">If you did not request this, you can ignore this email. Your security is our priority.</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 14px; color: #555; text-align: center;">© 2025 Last Night Engineering. All rights reserved.</p>
        </div>
      `,
    });
    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!otpStorage.has(email) || otpStorage.get(email) !== otp) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }
  otpStorage.delete(email);
  res.json({ message: "OTP verified successfully" });
});

router.post("/register", validateUser, async (req, res) => {
  const { fullName, email, password, reasonToJoin } = req.body;
  console.log(req.body);
  try {
    let user = await User.findOne({ email });
    if (user) {
      if (!user.password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.fullName = fullName || user.fullName;
        user.reasonToJoin = reasonToJoin || user.reasonToJoin;
        await user.save();
        return res.json({ message: "Google account merged with manual signup" });
      }
      return res.status(400).json({ message: "User already exists with this email" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ fullName, email, password: hashedPassword, reasonToJoin });
    await user.save();
    res.json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ message: "Server error", error: err.message });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: "Login failed", error: err.message });
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({ message: "Login successful", user, redirect: process.env.FRONTEND_URL });
    });
  })(req, res, next);
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: process.env.FRONTEND_URL }), async (req, res) => {
    try {
      let user = await User.findOne({ email: req.user.email });
      if (user) {
        if (!user.googleId) {
          user.googleId = req.user.id;
          await user.save();
        }
      } else {
        user = new User({
          fullName: req.user.displayName,
          email: req.user.email,
          googleId: req.user.id,
          reasonToJoin: "Google User",
        });
        await user.save();
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });
      res.redirect(`${process.env.FRONTEND_URL}`);
    } catch (err) {
      console.error("Error in callback route:", err);
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
  }
);

router.get("/logout", (req, res) => {
  res.cookie("token", "deleted", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    expires: new Date(0),
    maxAge: 0,
    path: "/",
  });
  res.clearCookie("token", { path: "/" });
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    req.session?.destroy(() => {
      res.json({ message: "Logout successful" });
    });
  });
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.password)
      return res
        .status(400)
        .json({ message: "Google-authenticated users cannot reset password" });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    const resetLink = `${FRONTEND_URL}/reset-password/${token}`;
    await transporter.sendMail({
      from: `Last Night Engineering <${EMAIL_USER}>`,
      to: email,
      subject: "🔑 Password Reset Request - Last Night Engineering",
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="text-align: center; color: #333; margin-bottom: 10px;">🔐 Reset Your Password</h2>
          <p style="font-size: 16px; color: #555;">Dear Learner,</p>
          <p style="font-size: 16px; color: #555;">We received a request to reset your password. Click the button below to proceed. This link is valid for <strong>1 hour</strong>.</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetLink}" style="display: inline-block; background: #ff6600; color: #fff; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px; font-weight: bold;">Reset Password</h3>
          </div>
          <p style="font-size: 14px; color: #777; text-align:center;">If you did not request this, ignore this email. Your account remains secure.</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 14px; color: #555; text-align: center;">Need help? Contact our support team at <a href="mailto:support@lastnightengineering.com" style="color: #ff6600;">work4rudrakudale@gmail.com</a>.</p>
          <p style="font-size: 14px; color: #555; text-align: center;">© 2025 Last Night Engineering. All rights reserved.</p>
        </div>
      `,
    });
    res.json({ message: "Reset link sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) return res.status(400).json({ message: "New password cannot be the same as the old password" });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Invalid or expired token" });
  }
});

router.get("/user", isLoggedIn, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
});

export default router;