import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, lowercase: true, trim: true },
  phone: String,
  visitDate: { type: Date, default: Date.now },
  serviceAttended: String,
  source: String,
  followUpStatus: {
    type: String,
    enum: ["new", "contacted", "unreachable", "integrated", "escalated"],
    default: "new"
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  notes: String
}, { timestamps: true });

export default mongoose.model("Visitor", visitorSchema);
