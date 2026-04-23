import NewsletterSubscriber from '../models/NewsletterSubscriber.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email, source } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    const existingSubscriber = await NewsletterSubscriber.findOne({
      email: normalizedEmail,
    });

    if (existingSubscriber) {
      if (existingSubscriber.status === 'unsubscribed') {
        existingSubscriber.status = 'active';
        existingSubscriber.subscribedAt = new Date();
        existingSubscriber.source = source || 'footer';
        await existingSubscriber.save();

        return res.status(200).json({
          success: true,
          message: 'You have been resubscribed successfully.',
        });
      }

      return res.status(409).json({
        success: false,
        message: 'This email is already subscribed.',
      });
    }

    await NewsletterSubscriber.create({
      email: normalizedEmail,
      source: source || 'footer',
    });

    return res.status(201).json({
      success: true,
      message: 'Subscription successful.',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while subscribing.',
    });
  }
};

export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await NewsletterSubscriber.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers,
    });
  } catch (error) {
    console.error('Fetch subscribers error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch subscribers.',
    });
  }
};

export const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const subscriber = await NewsletterSubscriber.findOne({
      email: normalizedEmail,
    });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found.',
      });
    }

    subscriber.status = 'unsubscribed';
    await subscriber.save();

    return res.status(200).json({
      success: true,
      message: 'You have been unsubscribed.',
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe.',
    });
  }
};