import mongoose from "mongoose";

const mediaAssetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    assetType: {
      type: String,
      enum: ["image", "video", "audio", "document", "design"],
      required: true,
    },
    category: {
      type: String,
      trim: true,
      default: "",
    },
    relatedEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("MediaAsset", mediaAssetSchema);