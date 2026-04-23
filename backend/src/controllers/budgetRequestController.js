import BudgetRequest from "../models/BudgetRequest.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function normalizeRole(role = "") {
  return String(role).trim().toLowerCase().replace(/\s+/g, "_");
}

const financeReviewRoles = ["finance", "super_admin", "admin"];

export const createBudgetRequest = asyncHandler(async (req, res) => {
  const { title, department, purpose, amount, eventName } = req.body;

  if (!title || !department || !purpose || amount === undefined || amount === null) {
    return res.status(400).json({
      message: "Title, department, purpose, and amount are required.",
    });
  }

  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount) || numericAmount < 0) {
    return res.status(400).json({
      message: "Amount must be a valid positive number.",
    });
  }

  const budgetRequest = await BudgetRequest.create({
    title,
    department,
    purpose,
    amount: numericAmount,
    eventName: eventName || "",
    requestedBy: req.user._id,
    requestedByName: req.user.fullName || req.user.name || "Unknown User",
  });

  return res.status(201).json(budgetRequest);
});

export const getBudgetRequests = asyncHandler(async (req, res) => {
  const role = normalizeRole(req.user?.role);

  const query = financeReviewRoles.includes(role)
    ? {}
    : { requestedBy: req.user._id };

  const requests = await BudgetRequest.find(query)
    .populate("requestedBy", "fullName name email role")
    .populate("reviewedBy", "fullName name email role")
    .sort({ createdAt: -1 });

  return res.json(requests);
});

export const getBudgetRequestById = asyncHandler(async (req, res) => {
  const role = normalizeRole(req.user?.role);

  const budgetRequest = await BudgetRequest.findById(req.params.id)
    .populate("requestedBy", "fullName name email role")
    .populate("reviewedBy", "fullName name email role");

  if (!budgetRequest) {
    return res.status(404).json({ message: "Budget request not found." });
  }

  if (
    !financeReviewRoles.includes(role) &&
    String(budgetRequest.requestedBy?._id || budgetRequest.requestedBy) !== String(req.user._id)
  ) {
    return res.status(403).json({ message: "Not authorized to view this budget request." });
  }

  return res.json(budgetRequest);
});

export const reviewBudgetRequest = asyncHandler(async (req, res) => {
  const role = normalizeRole(req.user?.role);

  if (!financeReviewRoles.includes(role)) {
    return res.status(403).json({
      message: "Not authorized to review budget requests.",
    });
  }

  const { status, financeComment } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({
      message: "Status must be either approved or rejected.",
    });
  }

  const budgetRequest = await BudgetRequest.findById(req.params.id);

  if (!budgetRequest) {
    return res.status(404).json({ message: "Budget request not found." });
  }

  budgetRequest.status = status;
  budgetRequest.financeComment = financeComment || "";
  budgetRequest.reviewedBy = req.user._id;
  budgetRequest.reviewedAt = new Date();

  await budgetRequest.save();

  const updatedBudgetRequest = await BudgetRequest.findById(budgetRequest._id)
    .populate("requestedBy", "fullName name email role")
    .populate("reviewedBy", "fullName name email role");

  return res.json(updatedBudgetRequest);
});

export const updateBudgetRequest = asyncHandler(async (req, res) => {
  const budgetRequest = await BudgetRequest.findById(req.params.id);

  if (!budgetRequest) {
    return res.status(404).json({ message: "Budget request not found." });
  }

  if (String(budgetRequest.requestedBy) !== String(req.user._id)) {
    return res.status(403).json({
      message: "Not authorized to update this budget request.",
    });
  }

  if (budgetRequest.status !== "pending") {
    return res.status(400).json({
      message: "Only pending budget requests can be updated.",
    });
  }

  const { title, department, purpose, amount, eventName } = req.body;

  if (title !== undefined) budgetRequest.title = title;
  if (department !== undefined) budgetRequest.department = department;
  if (purpose !== undefined) budgetRequest.purpose = purpose;
  if (eventName !== undefined) budgetRequest.eventName = eventName;

  if (amount !== undefined) {
    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount < 0) {
      return res.status(400).json({
        message: "Amount must be a valid positive number.",
      });
    }
    budgetRequest.amount = numericAmount;
  }

  await budgetRequest.save();

  return res.json(budgetRequest);
});

export const deleteBudgetRequest = asyncHandler(async (req, res) => {
  const role = normalizeRole(req.user?.role);

  const budgetRequest = await BudgetRequest.findById(req.params.id);

  if (!budgetRequest) {
    return res.status(404).json({ message: "Budget request not found." });
  }

  const isOwner = String(budgetRequest.requestedBy) === String(req.user._id);
  const canManage = financeReviewRoles.includes(role);

  if (!isOwner && !canManage) {
    return res.status(403).json({
      message: "Not authorized to delete this budget request.",
    });
  }

  await budgetRequest.deleteOne();

  return res.json({ message: "Budget request deleted successfully." });
});