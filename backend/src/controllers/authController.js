import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { logAudit } from "../utils/audit.js";

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone } = req.body;
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const user = await User.create({ fullName, email, password, phone, role: 'member' });
  await logAudit(user._id, 'register', 'User', user._id);
  res.status(201).json({
    token: generateToken(user),
    user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  await logAudit(user._id, 'login', 'User', user._id);
  res.json({
    token: generateToken(user),
    user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
