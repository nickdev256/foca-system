import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    serviceDate: {
      type: Date,
      required: true,
    },
    serviceType: {
      type: String,
      default: "Sunday Service",
    },
    status: {
      type: String,
      enum: ["present", "absent"],
      default: "present",
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);