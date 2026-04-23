import mongoose from "mongoose";

const ministrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  leader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  meetingDay: String
}, { timestamps: true });

export default mongoose.model("Ministry", ministrySchema);
