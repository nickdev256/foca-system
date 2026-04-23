import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, lowercase: true, trim: true },
  phone: String,
  gender: String,
  maritalStatus: String,
  address: String,
  householdName: String,
  status: { type: String, default: "active" },
  joinDate: Date,
  ministries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ministry" }],
  notes: String,
  assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Member", memberSchema);