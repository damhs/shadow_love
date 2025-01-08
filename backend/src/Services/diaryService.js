const pool = require('../mysql.js');
const uuid = require('uuid-sequential');
const dotenv = require('dotenv');
dotenv.config();

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const REST_API_KEY = process.env.REST_API_KEY;

const sendPushNotification = async (playerId, title, body) => {
  const payload = {
    app_id: ONESIGNAL_APP_ID,
    include_player_ids: [playerId],
    headings: { en: title },
    contents: { en: body },
  };

  try {
    await axios.post('https://onesignal.com/api/v1/notifications', payload, {
      headers: {
        Authorization: `Basic ${REST_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error.response.data);
  }
};

module.exports = { 
  sendPushNotification,
};