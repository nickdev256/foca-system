import Sermon from "../models/Sermon.js";

/* =========================
   GET ALL SERMONS
========================= */
export const getSermons = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {};

    // 🔥 allow filtering
    if (status) {
      filter.status = status;
    }

    const sermons = await Sermon.find(filter).sort({ createdAt: -1 });

    res.json(sermons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET SINGLE SERMON
========================= */
export const getSermonById = async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);

    if (!sermon) {
      return res.status(404).json({ message: "Sermon not found" });
    }

    res.json(sermon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   CREATE SERMON (manual)
========================= */
export const createSermon = async (req, res) => {
  try {
    const sermon = await Sermon.create({
      ...req.body,
      status: req.body.status || "draft"
    });

    res.status(201).json(sermon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPLOAD FILE (PPT/PDF/etc)
========================= */
export const uploadSermonFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const fileType = req.file.mimetype;

    const sermon = await Sermon.create({
      title: req.body.title || req.file.originalname,
      speaker: req.body.speaker || "Unknown",
      category: req.body.category || "General",

      fileUrl,
      fileType,

      status: "published",
    });

    res.status(201).json(sermon);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE SERMON
========================= */
export const updateSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!sermon) {
      return res.status(404).json({ message: "Sermon not found" });
    }

    res.json(sermon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE SERMON
========================= */
export const deleteSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findByIdAndDelete(req.params.id);

    if (!sermon) {
      return res.status(404).json({ message: "Sermon not found" });
    }

    res.json({ message: "Sermon deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};