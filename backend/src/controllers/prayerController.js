import PrayerRequest from "../models/PrayerRequest.js";
import mongoose from "mongoose";

/* =========================
   GET INCOMING PRAYERS
========================= */
export const getIncomingPrayers = async (req, res) => {
  try {
    const prayers = await PrayerRequest.find({ status: "new" })
      .sort({ createdAt: -1 });

    res.status(200).json(prayers);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch incoming prayers",
      error: error.message,
    });
  }
};

/* =========================
   GET PRAYER BY ID
========================= */
export const getPrayerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid prayer ID" });
    }

    const prayer = await PrayerRequest.findById(id);

    if (!prayer) {
      return res.status(404).json({ message: "Prayer not found" });
    }

    res.status(200).json(prayer);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching prayer",
      error: error.message,
    });
  }
};

/* =========================
   CREATE PRAYER
========================= */
export const createPrayer = async (req, res) => {
  try {
    const { name, email, phone, category, request, isConfidential } = req.body;

    if (!request) {
      return res.status(400).json({ message: "Prayer request is required" });
    }

    const newPrayer = await PrayerRequest.create({
      name,
      email,
      phone,
      category,
      request,
      isConfidential,
      status: "new",
    });

    res.status(201).json(newPrayer);

  } catch (error) {
    res.status(500).json({
      message: "Failed to create prayer",
      error: error.message,
    });
  }
}; // ✅ CLOSED PROPERLY


/* =========================
   UPDATE PRAYER STATUS
========================= */
export const updatePrayer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid prayer ID" });
    }

    const updated = await PrayerRequest.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Prayer not found" });
    }

    res.status(200).json(updated);

  } catch (error) {
    console.error("UPDATE PRAYER ERROR:", error.message);

    res.status(500).json({
      message: "Failed to update prayer",
      error: error.message,
    });
  }
};