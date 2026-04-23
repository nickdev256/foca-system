import mongoose from "mongoose";

const CounselingSchema = new mongoose.Schema(
  {
    memberName: {
      type: String,
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["open", "ongoing", "closed"], // 🔐 FIXED
      default: "open",
    },

    notes: {
      type: String, // 🔒 (you can encrypt later)
      required: false,
    },

    followUpDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CounselingSession", CounselingSchema);