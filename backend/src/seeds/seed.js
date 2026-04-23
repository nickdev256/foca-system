import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';

import User from '../models/User.js';
import Ministry from '../models/Ministry.js';
import Member from '../models/Member.js';
import Visitor from '../models/Visitor.js';
import Event from '../models/Event.js';
import Sermon from '../models/Sermon.js';
import Announcement from '../models/Announcement.js';
import FinanceTransaction from '../models/FinanceTransaction.js';
import PrayerRequest from '../models/PrayerRequest.js';
import Attendance from '../models/Attendance.js';
import CounselingSession from '../models/CounselingSession.js';
import BudgetRequest from '../models/BudgetRequest.js';
import MediaRequest from '../models/MediaRequest.js';
import ContentSchedule from '../models/ContentSchedule.js';
import Livestream from '../models/Livestream.js';
import MediaAsset from '../models/MediaAsset.js';

dotenv.config();

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Ministry.deleteMany({}),
    Member.deleteMany({}),
    Visitor.deleteMany({}),
    Event.deleteMany({}),
    Sermon.deleteMany({}),
    Announcement.deleteMany({}),
    FinanceTransaction.deleteMany({}),
    PrayerRequest.deleteMany({}),
    Attendance.deleteMany({}),
    CounselingSession.deleteMany({}),
    BudgetRequest.deleteMany({}),
    MediaRequest.deleteMany({}),
    ContentSchedule.deleteMany({}),
    Livestream.deleteMany({}),
    MediaAsset.deleteMany({}),
  ]);

  const users = await User.create([
    {
      fullName: 'FOCA Super Admin',
      email: 'admin@foca.com',
      password: 'Foca123!',
      role: 'super_admin',
    },
    {
      fullName: 'FOCA Pastor',
      email: 'pastor@foca.com',
      password: 'Foca123!',
      role: 'pastor',
    },
    {
      fullName: 'FOCA Finance',
      email: 'finance@foca.com',
      password: 'Foca123!',
      role: 'finance',
    },
    {
      fullName: 'FOCA Media',
      email: 'media@foca.com',
      password: 'Foca123!',
      role: 'media',
    },
    {
      fullName: 'FOCA Member',
      email: 'member@foca.com',
      password: 'Foca123!',
      role: 'member',
    },
    {
      fullName: 'FOCA Followup',
      email: 'followup@foca.com',
      password: 'Foca123!',
      role: 'followup',
    },
    {
      fullName: 'FOCA Admin Office',
      email: 'adminoffice@foca.com',
      password: 'Foca123!',
      role: 'admin',
    },
    {
      fullName: 'FOCA Ministry Leader',
      email: 'leader@foca.com',
      password: 'Foca123!',
      role: 'ministry_leader',
    },
  ]);

  const [superAdmin, pastor, financeUser, mediaUser, memberUser, followupUser, adminUser, ministryLeader] = users;

  const ministries = await Ministry.create([
    {
      name: 'Youth Ministry',
      description: 'Empowering the youth',
      leader: ministryLeader._id,
      meetingDay: 'Saturday',
    },
    {
      name: 'Media Ministry',
      description: 'Sermons, communication, and streaming support',
      leader: mediaUser._id,
      meetingDay: 'Friday',
    },
  ]);

  const [youthMinistry, mediaMinistry] = ministries;

  const members = await Member.create([
    {
      fullName: 'Sarah Kansiime',
      email: 'sarah@example.com',
      phone: '0700000001',
      householdName: 'Kansiime Family',
      status: 'active',
      ministries: [youthMinistry._id],
    },
    {
      fullName: 'John Mugerwa',
      email: 'john@example.com',
      phone: '0700000002',
      householdName: 'Mugerwa Family',
      status: 'active',
      ministries: [mediaMinistry._id],
    },
  ]);

  const [sarahMember, johnMember] = members;

  const visitors = await Visitor.create([
    {
      fullName: 'Grace Nankya',
      phone: '0771234567',
      serviceAttended: 'Sunday Service',
      source: 'Friend',
      assignedTo: followupUser._id,
      followUpStatus: 'new',
    },
    {
      fullName: 'Paul Ssemwanga',
      phone: '0703456789',
      serviceAttended: 'Youth Fellowship',
      source: 'Facebook',
      followUpStatus: 'contacted',
      assignedTo: followupUser._id,
    },
  ]);

  const events = await Event.create([
    {
      title: 'Sunday Worship Service',
      description: 'Main worship experience',
      location: 'FOCA Kyanja',
      startDate: new Date(),
      category: 'Service',
      createdBy: superAdmin._id,
    },
    {
      title: 'Youth Revival Night',
      description: 'Night of prayer and worship',
      location: 'FOCA Hall',
      startDate: new Date(Date.now() + 86400000 * 7),
      category: 'Youth',
      createdBy: ministryLeader._id,
    },
    {
      title: 'Media Training Workshop',
      description: 'Training for communication and livestream support',
      location: 'Media Room',
      startDate: new Date(Date.now() + 86400000 * 3),
      category: 'Training',
      createdBy: mediaUser._id,
    },
  ]);

  const [sundayService, youthRevival, mediaWorkshop] = events;

  const sermons = await Sermon.create([
    {
      title: 'Abiding in Christ',
      preacher: 'Pastor FOCA',
      date: new Date(),
      category: 'Faith',
      description: 'John 15:15 message',
      mediaUrl: 'https://example.com/sermon-abiding-in-christ',
      createdBy: mediaUser._id,
    },
    {
      title: 'Walking in Grace',
      preacher: 'Pastor FOCA',
      date: new Date(Date.now() - 86400000 * 7),
      category: 'Grace',
      description: 'Encouragement for the church',
      mediaUrl: 'https://example.com/sermon-walking-in-grace',
      createdBy: mediaUser._id,
    },
  ]);

  const announcements = await Announcement.create([
    {
      title: 'Welcome to FOCA Connect',
      body: 'A new season of digital ministry excellence.',
      audience: 'all',
      createdBy: superAdmin._id,
    },
    {
      title: 'Youth Revival Reminder',
      body: 'All youth are invited for the upcoming revival night next week.',
      audience: 'youth',
      createdBy: mediaUser._id,
    },
  ]);

  await FinanceTransaction.create([
    {
      type: 'tithe',
      amount: 500000,
      memberName: 'Sarah Kansiime',
      category: 'General',
      method: 'Cash',
      createdBy: financeUser._id,
    },
    {
      type: 'offering',
      amount: 250000,
      memberName: 'John Mugerwa',
      category: 'Sunday Service',
      method: 'Mobile Money',
      createdBy: financeUser._id,
    },
    {
      type: 'donation',
      amount: 800000,
      memberName: 'Church Partner',
      category: 'Project Support',
      method: 'Bank Transfer',
      createdBy: financeUser._id,
    },
    {
      type: 'expense',
      amount: 120000,
      category: 'Media',
      method: 'Cash',
      note: 'Camera battery',
      createdBy: financeUser._id,
    },
    {
      type: 'expense',
      amount: 300000,
      category: 'Youth Event',
      method: 'Mobile Money',
      note: 'Event publicity and refreshments',
      createdBy: financeUser._id,
    },
  ]);

  await PrayerRequest.create([
    {
      name: 'Anonymous',
      category: 'Healing',
      request: 'Pray for healing and restoration',
      status: 'new',
      assignedPastor: pastor._id,
    },
    {
      name: 'Sarah Kansiime',
      category: 'Family',
      request: 'Pray for my family and wisdom in decision making',
      status: 'pending',
      assignedPastor: pastor._id,
      member: sarahMember._id,
    },
  ]);

  await Attendance.create([
    {
      groupType: 'service',
      groupName: 'Sunday Worship',
      total: 320,
    },
    {
      groupType: 'ministry',
      groupName: 'Youth Ministry',
      total: 88,
    },
  ]);

  await CounselingSession.create([
    {
      memberName: 'John Mugerwa',
      topic: 'Family Guidance',
      notes: 'Pastoral follow-up required',
      assignedPastor: pastor._id,
      status: 'pending',
    },
    {
      memberName: 'Sarah Kansiime',
      topic: 'Career and calling',
      notes: 'Encouragement and spiritual direction needed',
      assignedPastor: pastor._id,
      status: 'open',
    },
  ]);

  const budgetRequests = await BudgetRequest.create([
    {
      title: 'Youth Revival Budget',
      department: 'Youth Ministry',
      requestedBy: ministryLeader._id,
      requestedByName: ministryLeader.fullName,
      purpose: 'Support publicity, chairs, refreshments, and prayer materials for youth revival.',
      amount: 650000,
      eventName: 'Youth Revival Night',
      status: 'pending',
    },
    {
      title: 'Media Equipment Budget',
      department: 'Media Ministry',
      requestedBy: mediaUser._id,
      requestedByName: mediaUser.fullName,
      purpose: 'Tripod, extension cables, and livestream accessories.',
      amount: 900000,
      eventName: 'Media Training Workshop',
      status: 'approved',
      financeComment: 'Approved with phased procurement.',
      reviewedBy: financeUser._id,
      reviewedAt: new Date(),
    },
    {
      title: 'Outreach Print Budget',
      department: 'Admin Office',
      requestedBy: adminUser._id,
      requestedByName: adminUser.fullName,
      purpose: 'Printing flyers and church invitation cards for community outreach.',
      amount: 300000,
      eventName: 'Community Outreach',
      status: 'rejected',
      financeComment: 'Adjust estimate and resubmit with supplier quotations.',
      reviewedBy: financeUser._id,
      reviewedAt: new Date(),
    },
  ]);

  await MediaRequest.create([
    {
      title: 'Youth Revival Poster Design',
      ministry: 'Youth Ministry',
      requestType: 'poster',
      description: 'Design a poster for the youth revival night with speaker and date details.',
      deadline: new Date(Date.now() + 86400000 * 2),
      priority: 'high',
      status: 'pending',
      requestedBy: ministryLeader._id,
      assignedTo: mediaUser._id,
      mediaNote: 'Awaiting final speaker photo.',
    },
    {
      title: 'Sunday Service Livestream Support',
      ministry: 'Church Media',
      requestType: 'livestream',
      description: 'Prepare YouTube livestream and camera setup for Sunday worship.',
      deadline: new Date(Date.now() + 86400000),
      priority: 'urgent',
      status: 'in_progress',
      requestedBy: pastor._id,
      assignedTo: mediaUser._id,
      mediaNote: 'Internet check scheduled on Saturday evening.',
    },
    {
      title: 'Community Outreach Photography',
      ministry: 'Admin Office',
      requestType: 'photography',
      description: 'Capture event photos for social media and archive.',
      deadline: new Date(Date.now() + 86400000 * 5),
      priority: 'medium',
      status: 'completed',
      requestedBy: adminUser._id,
      assignedTo: mediaUser._id,
      mediaNote: 'Photos delivered to admin office.',
      assetUrl: 'https://example.com/outreach-photos',
    },
  ]);

  await ContentSchedule.create([
    {
      title: 'Youth Revival Social Poster',
      contentType: 'poster',
      channel: 'instagram',
      publishDate: new Date(Date.now() + 86400000 * 2),
      linkedEvent: youthRevival._id,
      assignedTo: mediaUser._id,
      status: 'scheduled',
      note: 'Post during evening peak hours.',
    },
    {
      title: 'Sunday Worship Announcement',
      contentType: 'announcement',
      channel: 'whatsapp',
      publishDate: new Date(Date.now() + 86400000),
      linkedEvent: sundayService._id,
      assignedTo: mediaUser._id,
      status: 'scheduled',
      note: 'Share with all ministry coordinators.',
    },
    {
      title: 'Media Training Recap Video',
      contentType: 'video',
      channel: 'youtube',
      publishDate: new Date(Date.now() + 86400000 * 6),
      linkedEvent: mediaWorkshop._id,
      assignedTo: mediaUser._id,
      status: 'draft',
      note: 'Pending final edit.',
    },
  ]);

  await Livestream.create([
    {
      title: 'Sunday Worship Live Broadcast',
      event: sundayService._id,
      platform: 'youtube',
      streamDate: new Date(Date.now() + 86400000),
      assignedOperator: mediaUser._id,
      streamUrl: 'https://youtube.com/example-live-stream',
      status: 'ready',
      note: 'Sound and camera test complete.',
    },
    {
      title: 'Youth Revival Live Session',
      event: youthRevival._id,
      platform: 'facebook',
      streamDate: new Date(Date.now() + 86400000 * 7),
      assignedOperator: mediaUser._id,
      streamUrl: 'https://facebook.com/example-live-stream',
      status: 'planned',
      note: 'Poster and teaser video should go out first.',
    },
  ]);

  await MediaAsset.create([
    {
      title: 'Youth Revival Poster Final',
      fileUrl: 'https://example.com/assets/youth-revival-poster.jpg',
      assetType: 'image',
      category: 'Event Poster',
      relatedEvent: youthRevival._id,
      uploadedBy: mediaUser._id,
      description: 'Final approved youth revival poster.',
    },
    {
      title: 'Sunday Worship Thumbnail',
      fileUrl: 'https://example.com/assets/sunday-thumbnail.jpg',
      assetType: 'design',
      category: 'Sermon Thumbnail',
      relatedEvent: sundayService._id,
      uploadedBy: mediaUser._id,
      description: 'Thumbnail artwork for weekly sermon upload.',
    },
    {
      title: 'Media Training Promo Clip',
      fileUrl: 'https://example.com/assets/media-training-promo.mp4',
      assetType: 'video',
      category: 'Promo',
      relatedEvent: mediaWorkshop._id,
      uploadedBy: mediaUser._id,
      description: 'Short promo clip for media team training.',
    },
  ]);

  console.log('Seed complete');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});