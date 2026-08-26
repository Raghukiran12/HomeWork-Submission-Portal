const Notification = require('../models/Notification');
const { ApiError } = require('../utils/helpers');
const { asyncHandler } = require('../middleware/errorHandler');

const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .populate('recipient', 'firstName lastName role')
    .sort({ createdAt: -1 });
  res.json({ success: true, notifications });
});

const markRead = asyncHandler(async (req, res) => {
  const item = await Notification.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Notification not found.');
  if (String(item.recipient) !== String(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(403, 'You cannot update this notification.');
  }
  item.isRead = true;
  await item.save();
  res.json({ success: true, notification: item });
});

module.exports = { listNotifications, markRead };
