import Notification from "../models/notification.js";

import { getIO } from "../socket/socket.js";

import { AppError } from "../utils/appError.js";
import { STATUS_CODES } from "../constants/statusCodes.js";


export const createNotification = async ({
  recipientId,
  recipientRole,
  type,
  title,
  message,
  metadata = null,
}) => {
  const notification = await Notification.create({
    recipient_id: recipientId,
    recipient_role: recipientRole,
    type,
    title,
    message,
    metadata,
  });

  const io = getIO();

  io.to(
    `user:${recipientRole}:${recipientId}`,
  ).emit(
    "notification:new",
    notification,
  );

  return notification;
};


export const getMyNotifications = async (
  userId,
  role,
) => {
  const notifications = await Notification.findAll({
    where: {
      recipient_id: userId,
      recipient_role: role,
    },

    order: [["created_at", "DESC"]],
  });

  return notifications;
};


export const markNotificationAsRead = async (
  notificationId,
  userId,
  role,
) => {
  const notification =
    await Notification.findOne({
      where: {
        id: notificationId,
        recipient_id: userId,
        recipient_role: role,
      },
    });

  if (!notification) {
    throw new AppError(
      "Notification not found",
      STATUS_CODES.NOT_FOUND,
    );
  }

  notification.is_read = true;

  await notification.save();

  return notification;
};


export const markAllNotificationsAsRead = async (
  userId,
  role,
) => {
  await Notification.update(
    {
      is_read: true,
    },
    {
      where: {
        recipient_id: userId,
        recipient_role: role,
        is_read: false,
      },
    },
  );
};


export const getUnreadNotificationCount = async (
  userId,
  role,
) => {
  const count = await Notification.count({
    where: {
      recipient_id: userId,
      recipient_role: role,
      is_read: false,
    },
  });

  return count;
};