import mongoose from "mongoose";

const contentScheduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    contentType: {
      type: String,
      enum: ["announcement", "poster", "video", "livestream", "sermon", "social_post"],
      required: true,
    },
    channel: {
      type: String,
      enum: ["facebook", "instagram", "whatsapp", "youtube", "website", "church_screen"],
      required: true,
    },
    publishDate: {
      type: Date,
      required: true,
    },
    linkedEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "published", "cancelled"],
      default: "draft",
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ContentSchedule", contentScheduleSchema);