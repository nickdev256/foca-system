import Member from "../models/Member.js";
import Visitor from "../models/Visitor.js";
import Event from "../models/Event.js";
import Sermon from "../models/Sermon.js";
import PrayerRequest from "../models/PrayerRequest.js";
import FinanceTransaction from "../models/FinanceTransaction.js";
import Announcement from "../models/Announcement.js";
import CounselingSession from "../models/CounselingSession.js";
import AuditLog from "../models/AuditLog.js";
import BudgetRequest from "../models/BudgetRequest.js";
import MediaRequest from "../models/MediaRequest.js";
import ContentSchedule from "../models/ContentSchedule.js";
import Livestream from "../models/Livestream.js";
import MediaAsset from "../models/MediaAsset.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function normalizeRole(role = "") {
  return String(role).trim().toLowerCase().replace(/\s+/g, "_");
}

export const summary = asyncHandler(async (req, res) => {
  const role = normalizeRole(req.user?.role);
  const userId = req.user?._id;

  if (role === "member") {
    const [events, announcements, prayerRequests, recentAnnouncements, upcomingEvents] =
      await Promise.all([
        Event.countDocuments(),
        Announcement.countDocuments(),
        PrayerRequest.countDocuments({
          $or: [{ member: userId }, { createdBy: userId }, { user: userId }],
        }),
        Announcement.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select("title content createdAt"),
        Event.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select("title eventDate date startDate location createdAt"),
      ]);

    return res.json({
      role: "member",
      stats: {
        events,
        announcements,
        prayer_requests: prayerRequests,
        attendance: 0,
      },
      recentAnnouncements,
      upcomingEvents,
    });
  }

  if (role === "followup") {
    const [visitors, newVisitors, prayers, announcements, recentVisitors, recentPrayerRequests] =
      await Promise.all([
        Visitor.countDocuments(),
        Visitor.countDocuments({ followUpStatus: "new" }),
        PrayerRequest.countDocuments({ status: { $ne: "closed" } }),
        Announcement.countDocuments(),
        Visitor.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select("fullName phone serviceAttended source followUpStatus createdAt"),
        PrayerRequest.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select("name category status request createdAt"),
      ]);

    return res.json({
      role: "followup",
      stats: {
        visitors,
        new_visitors: newVisitors,
        prayer_requests: prayers,
        announcements,
      },
      recentVisitors,
      recentPrayerRequests,
    });
  }

  if (role === "finance") {
    const [
      incomeAgg,
      expenseAgg,
      announcements,
      events,
      recentTransactions,
      pendingBudgets,
      approvedBudgets,
      rejectedBudgets,
      recentBudgetRequests,
    ] = await Promise.all([
      FinanceTransaction.aggregate([
        { $match: { type: { $in: ["tithe", "offering", "donation"] } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      FinanceTransaction.aggregate([
        { $match: { type: "expense" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Announcement.countDocuments(),
      Event.countDocuments(),
      FinanceTransaction.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .select("type amount memberName category method createdAt"),
      BudgetRequest.countDocuments({ status: "pending" }),
      BudgetRequest.countDocuments({ status: "approved" }),
      BudgetRequest.countDocuments({ status: "rejected" }),
      BudgetRequest.find()
        .populate("requestedBy", "fullName name email role")
        .populate("reviewedBy", "fullName name email role")
        .sort({ createdAt: -1 })
        .limit(6),
    ]);

    return res.json({
      role: "finance",
      stats: {
        income: incomeAgg[0]?.total || 0,
        expenses: expenseAgg[0]?.total || 0,
        announcements,
        events,
        pendingBudgets,
        approvedBudgets,
        rejectedBudgets,
      },
      recentTransactions,
      recentBudgetRequests,
    });
  }

  if (role === "media") {
    const [
      sermons,
      announcements,
      events,
      activities,
      recentSermons,
      pendingMediaRequests,
      scheduledContent,
      upcomingLivestreams,
      mediaAssets,
      completedMediaRequests,
      recentMediaRequests,
      recentSchedules,
      recentLivestreams,
      recentAssets,
    ] = await Promise.all([
      Sermon.countDocuments(),
      Announcement.countDocuments(),
      Event.countDocuments(),
      AuditLog.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("actor", "fullName role"),
      Sermon.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title preacher category mediaUrl createdAt"),

      MediaRequest.countDocuments({ status: { $in: ["pending", "in_progress"] } }),
      ContentSchedule.countDocuments({ status: "scheduled" }),
      Livestream.countDocuments({ status: { $in: ["planned", "ready", "live"] } }),
      MediaAsset.countDocuments(),
      MediaRequest.countDocuments({ status: "completed" }),

      MediaRequest.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("requestedBy", "fullName role")
        .populate("assignedTo", "fullName role"),

      ContentSchedule.find()
        .sort({ publishDate: 1, createdAt: -1 })
        .limit(5)
        .populate("linkedEvent", "title startDate location")
        .populate("assignedTo", "fullName role")
        .select("title contentType channel publishDate status note linkedEvent assignedTo createdAt"),

      Livestream.find()
        .sort({ streamDate: 1, createdAt: -1 })
        .limit(5)
        .populate("event", "title startDate location")
        .populate("assignedOperator", "fullName role")
        .select("title platform streamDate status streamUrl note event assignedOperator createdAt"),

      MediaAsset.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("relatedEvent", "title startDate location")
        .populate("uploadedBy", "fullName role")
        .select("title fileUrl assetType category description relatedEvent uploadedBy createdAt"),
    ]);

    return res.json({
      role: "media",
      stats: {
        sermons,
        announcements,
        events,
        activities: activities.length,
        pendingMediaRequests,
        scheduledContent,
        upcomingLivestreams,
        mediaAssets,
        completedMediaRequests,
      },
      activities,
      recentSermons,
      recentMediaRequests,
      recentSchedules,
      recentLivestreams,
      recentAssets,
      mediaNotes: [
        "Review new media requests and assign priority work early.",
        "Keep scheduled content timely and aligned with church programs.",
        "Prepare livestreams before service and event start times.",
        "Maintain a clean and searchable media library for ministry use.",
      ],
    });
  }

  if (role === "pastor") {
    const [
      members,
      prayers,
      counseling,
      events,
      announcements,
      recentPrayerRequests,
      upcomingEvents,
      recentCounseling,
    ] = await Promise.all([
      Member.countDocuments(),
      PrayerRequest.countDocuments({ status: { $ne: "closed" } }),
      CounselingSession.countDocuments({ status: { $ne: "closed" } }),
      Event.countDocuments(),
      Announcement.countDocuments(),
      PrayerRequest.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name category status request createdAt"),
      Event.find()
        .sort({ startDate: 1, createdAt: 1 })
        .limit(5)
        .select("title location startDate category description createdAt"),
      CounselingSession.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("memberName topic status notes createdAt"),
    ]);

    return res.json({
      role: "pastor",
      stats: {
        members,
        prayers,
        counseling,
        events,
        announcements,
      },
      recentPrayerRequests,
      upcomingEvents,
      recentCounseling,
      ministryNotes: [
        "Review urgent prayer cases and assign follow-up where needed.",
        "Check counseling sessions requiring pastoral intervention.",
        "Monitor upcoming events that need leadership presence.",
        "Strengthen member care, discipleship, and communication flow.",
      ],
    });
  }

  if (role === "ministry_leader") {
    const [members, events, announcements, prayers, upcomingEvents] = await Promise.all([
      Member.countDocuments(),
      Event.countDocuments(),
      Announcement.countDocuments(),
      PrayerRequest.countDocuments({ status: { $ne: "closed" } }),
      Event.find()
        .sort({ startDate: 1 })
        .limit(5)
        .select("title location startDate category createdAt"),
    ]);

    return res.json({
      role: "ministry_leader",
      stats: {
        members,
        events,
        announcements,
        prayers,
      },
      upcomingEvents,
    });
  }

  const [members, visitors, events, sermons, prayers, announcements, openCounseling, activities, finance] =
    await Promise.all([
      Member.countDocuments(),
      Visitor.countDocuments(),
      Event.countDocuments(),
      Sermon.countDocuments(),
      PrayerRequest.countDocuments({ status: { $ne: "closed" } }),
      Announcement.countDocuments(),
      CounselingSession.countDocuments({ status: { $ne: "closed" } }),
      AuditLog.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .populate("actor", "fullName role"),
      FinanceTransaction.aggregate([
        { $group: { _id: "$type", total: { $sum: "$amount" } } },
      ]),
    ]);

  return res.json({
    role,
    stats: {
      members,
      visitors,
      events,
      sermons,
      prayers,
      announcements,
      openCounseling,
    },
    activities,
    finance,
  });
});

export const roleReport = asyncHandler(async (req, res) => {
  const [memberCount, visitorNew, prayerNew, titheTotal, expenseTotal, sermonCount] =
    await Promise.all([
      Member.countDocuments(),
      Visitor.countDocuments({ followUpStatus: "new" }),
      PrayerRequest.countDocuments({ status: "new" }),
      FinanceTransaction.aggregate([
        { $match: { type: { $in: ["tithe", "offering", "donation"] } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      FinanceTransaction.aggregate([
        { $match: { type: "expense" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Sermon.countDocuments(),
    ]);

  res.json({
    generatedAt: new Date(),
    memberCount,
    visitorNew,
    prayerNew,
    titheTotal: titheTotal[0]?.total || 0,
    expenseTotal: expenseTotal[0]?.total || 0,
    sermonCount,
  });
});