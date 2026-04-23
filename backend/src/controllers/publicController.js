import Member from '../models/Member.js';
import Event from '../models/Event.js';
import PrayerRequest from '../models/PrayerRequest.js';
import Attendance from '../models/Attendance.js';
import Ministry from '../models/Ministry.js';

export const getPublicSummary = async (req, res) => {
  try {
    const now = new Date();

    // Last 7 days
    const weekStart = new Date();
    weekStart.setDate(now.getDate() - 7);

    const [
      memberCount,
      activePrayerRequests,
      upcomingEvents,
      ministries,
      weeklyAttendance,
    ] = await Promise.all([
      // Total members
      Member.countDocuments({}),

      // Active prayer requests (NOT closed)
      PrayerRequest.countDocuments({
        status: { $ne: 'closed' },
      }),

      // Upcoming events
      Event.countDocuments({
        startDate: { $gte: now },
      }),

      // Departments
      Ministry.find({}).select('name').limit(4),

      // Weekly attendance = count of PRESENT records
      Attendance.countDocuments({
        status: 'present',
        serviceDate: { $gte: weekStart },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        weeklyAttendance,
        activePrayerRequests,
        upcomingEvents,
        memberCount,
        departments: ministries.map((m) => m.name),
        liveNotice:
          'Join us this Sunday for a powerful worship experience at Friends of Christ Assembly.',
      },
    });
  } catch (error) {
    console.error('Public summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public summary',
    });
  }
};