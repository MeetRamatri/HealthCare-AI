import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai"
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const MONGO_URL = "mongodb+srv://MeetRamatri:tTHHUcQVac8n7ZKT@healthcareai.01awvoq.mongodb.net/HealthCareDB?appName=HealthCareAI";
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB error:", err));
const userSchema = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  chatHistory: [
    {
      role: { type: String }, 
      message: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ]
});
const User = mongoose.model("User", userSchema);
const JWT_SECRET = "SUPER_SECRET_KEY"; 
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}
app.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashed
    });
    await newUser.save();
    res.json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/chat/history", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({
    chatHistory: user.chatHistory
  });
});
app.post("/chat", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message)
      return res.status(400).json({ error: "Message is required" });
    const user = await User.findById(req.user.id);
    user.chatHistory.push({
      role: "user",
      message
    });
    const ai = new GoogleGenAI({});
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      maxOutputTokens: 1024,
    });
    const aiReply = response?.text ?? "No response from Gemini";
    user.chatHistory.push({
      role: "ai",
      message: aiReply
    });
    await user.save(); 
    res.json({
      reply: aiReply
    });
  } catch (error) {
    console.log(error.response?.data || error);
    res.status(500).json({ error: "Gemini API error" });
  }
});
app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);
