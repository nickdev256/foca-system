import User from '../models/User.js';
import Member from '../models/Member.js';
import Visitor from '../models/Visitor.js';
import Event from '../models/Event.js';
import Sermon from '../models/Sermon.js';
import PrayerRequest from '../models/PrayerRequest.js';
import CounselingSession from '../models/CounselingSession.js';
import FinanceTransaction from '../models/FinanceTransaction.js';
import BudgetRequest from '../models/BudgetRequest.js';
import Ministry from '../models/Ministry.js';

export const getSuperAdminSummary = async (req, res) => {
  try {
    const now = new Date();

    const [
      totalUsers,
      activeUsers,
      totalMembers,
      totalVisitors,
      newVisitors,
      upcomingEvents,
      totalSermons,
      openPrayerRequests,
      openCounselingSessions,
      totalMinistries,
      pendingBudgetRequests,
      totalBudgetRequests,
      financeTransactions,
      recentUsers,
      recentVisitors,
      recentPrayerRequests,
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ isActive: true }),
      Member.countDocuments({}),
      Visitor.countDocuments({}),
      Visitor.countDocuments({ followUpStatus: 'new' }),
      Event.countDocuments({ startDate: { $gte: now } }),
      Sermon.countDocuments({}),
      PrayerRequest.countDocuments({ status: { $ne: 'closed' } }),
      CounselingSession.countDocuments({ status: { $ne: 'closed' } }),
      Ministry.countDocuments({}),
      BudgetRequest.countDocuments({ status: 'pending' }),
      BudgetRequest.countDocuments({}),
      FinanceTransaction.aggregate([
        {
          $group: {
            _id: null,
            totalIncome: {
              $sum: {
                $cond: [
                  { $in: ['$type', ['tithe', 'offering', 'donation', 'pledge']] },
                  '$amount',
                  0,
                ],
              },
            },
            totalExpense: {
              $sum: {
                $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
              },
            },
            totalTransactions: { $sum: 1 },
          },
        },
      ]),
      User.find({})
        .select('fullName email role isActive createdAt')
        .sort({ createdAt: -1 })
        .limit(5),
      Visitor.find({})
        .select('fullName followUpStatus visitDate createdAt')
        .sort({ createdAt: -1 })
        .limit(5),
      PrayerRequest.find({})
        .select('name category status createdAt')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const finance = financeTransactions[0] || {
      totalIncome: 0,
      totalExpense: 0,
      totalTransactions: 0,
    };

    const systemStatus = 'Operational';

    res.status(200).json({
      success: true,
      data: {
        topStats: {
          totalUsers,
          activeUsers,
          totalMembers,
          totalVisitors,
          newVisitors,
          upcomingEvents,
          totalSermons,
          openPrayerRequests,
          openCounselingSessions,
          totalMinistries,
          pendingBudgetRequests,
          totalBudgetRequests,
          totalIncome: finance.totalIncome || 0,
          totalExpense: finance.totalExpense || 0,
          totalTransactions: finance.totalTransactions || 0,
          systemStatus,
        },
        alerts: [
          {
            label: 'Pending prayer follow-up cases',
            value: openPrayerRequests,
          },
          {
            label: 'New visitors awaiting review',
            value: newVisitors,
          },
          {
            label: 'Upcoming events',
            value: upcomingEvents,
          },
          {
            label: 'Pending budget requests',
            value: pendingBudgetRequests,
          },
        ],
        recentActivities: [
          ...recentUsers.map((user) => ({
            text: `${user.fullName} joined the system as ${user.role}.`,
            type: 'user',
            createdAt: user.createdAt,
          })),
          ...recentVisitors.map((visitor) => ({
            text: `${visitor.fullName} was recorded as a visitor (${visitor.followUpStatus}).`,
            type: 'visitor',
            createdAt: visitor.createdAt,
          })),
          ...recentPrayerRequests.map((prayer) => ({
            text: `${prayer.name || 'Anonymous'} submitted a prayer request (${prayer.status}).`,
            type: 'prayer',
            createdAt: prayer.createdAt,
          })),
        ]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6),
      },
    });
  } catch (error) {
    console.error('getSuperAdminSummary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch super admin summary',
    });
  }
};