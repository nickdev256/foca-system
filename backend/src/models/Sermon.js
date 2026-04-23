import mongoose from "mongoose";

const sermonSchema = new mongoose.Schema(
  {
    title: String,
    speaker: String,
    category: String,

    description: String,

    videoUrl: String,
    slidesUrl: String,

    // 🔥 NEW
    fileUrl: String,
    fileType: String,

    thumbnail: String,

    status: {
      type: String,
      enum: ["draft", "published", "preached"],
      default: "draft"
    },

    featured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Sermon", sermonSchema);