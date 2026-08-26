const Notification = require('../models/Notification');

async function notify(recipient, title, message, type = 'info') {
  return Notification.create({ recipient, title, message, type });
}

async function notifyMany(recipients, title, message, type = 'info') {
  if (!recipients.length) return;
  await Notification.insertMany(recipients.map((recipient) => ({
    recipient,
    title,
    message,
    type
  })));
}

module.exports = { notify, notifyMany };
