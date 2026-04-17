import admin from '../config/firebase.js';

/**
 * Send a push notification using Firebase Admin SDK
 * @param {string} userId - Target user ID (assumes tokens are stored/managed)
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {string} token - Optional FCM token (if provided directly)
 */
export const sendPushNotification = async (title, body, token) => {
  if (!token) {
    console.warn('No FCM token provided for notification.');
    return;
  }

  const message = {
    notification: {
      title,
      body
    },
    token
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Endpoint: POST /api/notify
export const notifyUser = async (req, res) => {
  const { userId, message, token } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Note: In a real app, you'd fetch the FCM token for the userId from the DB
    // For this example, we expect the token in the request or a simulated send
    const response = await sendPushNotification('New Alert', message, token || 'simulated-token');
    res.json({ success: true, response });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send notification', details: error.message });
  }
};
