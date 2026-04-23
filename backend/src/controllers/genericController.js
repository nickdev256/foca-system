import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { logAudit } from "../utils/audit.js";

export const createCrudController = (Model, entity) => ({

  /* =========================
     GET ALL
  ========================= */
  getAll: asyncHandler(async (req, res) => {
    const query = {};

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { fullName: { $regex: req.query.search, $options: "i" } },
        { name: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const items = await Model.find(query).sort({ createdAt: -1 });

    res.status(200).json(items);
  }),

  /* =========================
     GET ONE (SAFE)
  ========================= */
  getOne: asyncHandler(async (req, res) => {
    const { id } = req.params;

    // 🔥 Prevent invalid ObjectId crash
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: `Invalid ${entity} ID`,
      });
    }

    const item = await Model.findById(id);

    if (!item) {
      return res.status(404).json({
        message: `${entity} not found`,
      });
    }

    res.status(200).json(item);
  }),

  /* =========================
     CREATE
  ========================= */
  create: asyncHandler(async (req, res) => {
    const payload = { ...req.body };

    if (req.user?._id && Model.schema.path("createdBy")) {
      payload.createdBy = req.user._id;
    }

    const item = await Model.create(payload);

    await logAudit(req.user?._id, "create", entity, item._id, payload);

    res.status(201).json(item);
  }),

  /* =========================
     UPDATE (SAFE)
  ========================= */
  update: asyncHandler(async (req, res) => {
    const { id } = req.params;

    // 🔥 Prevent invalid ObjectId crash
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: `Invalid ${entity} ID`,
      });
    }

    const item = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({
        message: `${entity} not found`,
      });
    }

    await logAudit(req.user?._id, "update", entity, item._id, req.body);

    res.status(200).json(item);
  }),

  /* =========================
     DELETE (SAFE)
  ========================= */
  remove: asyncHandler(async (req, res) => {
    const { id } = req.params;

    // 🔥 Prevent invalid ObjectId crash
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: `Invalid ${entity} ID`,
      });
    }

    const item = await Model.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({
        message: `${entity} not found`,
      });
    }

    await logAudit(req.user?._id, "delete", entity, id);

    res.status(200).json({
      message: `${entity} deleted successfully`,
    });
  }),

});