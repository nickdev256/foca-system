import mongoose from "mongoose";

const financeTransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["tithe", "offering", "donation", "expense", "pledge"], required: true },
  amount: { type: Number, required: true },
  memberName: String,
  category: String,
  method: String,
  date: { type: Date, default: Date.now },
  note: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("FinanceTransaction", financeTransactionSchema);
