import mongoose from "mongoose";

const livestreamSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },
    platform: {
      type: String,
      enum: ["youtube", "facebook", "instagram", "other"],
      required: true,
    },
    streamDate: {
      type: Date,
      required: true,
    },
    assignedOperator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    streamUrl: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["planned", "ready", "live", "completed", "cancelled"],
      default: "planned",
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Livestream", livestreamSchema);