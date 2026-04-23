import mongoose from "mongoose";

const prayerRequestSchema = new mongoose.Schema({
  name: String,
  email: { type: String, lowercase: true, trim: true },
  phone: String,
  category: String,
  request: { type: String, required: true },
  isConfidential: { type: Boolean, default: false },
  status: { type: String, enum: ["new", "reviewed", "in_prayer", "closed"], default: "new" },
  assignedPastor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("PrayerRequest", prayerRequestSchema);
