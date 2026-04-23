import mongoose from "mongoose";

const mediaRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    ministry: {
      type: String,
      required: true,
      trim: true,
    },
    requestType: {
      type: String,
      enum: [
        "poster",
        "flyer",
        "video",
        "photography",
        "livestream",
        "social_media",
        "announcement_graphic",
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    deadline: {
      type: Date,
      default: null,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "rejected"],
      default: "pending",
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    mediaNote: {
      type: String,
      trim: true,
      default: "",
    },
    assetUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("MediaRequest", mediaRequestSchema);