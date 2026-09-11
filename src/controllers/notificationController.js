import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
} from "../services/notificationService.js";

import { STATUS_CODES } from "../constants/statusCodes.js";


export const getNotifications = async (
  req,
  res,
  next,
) => {
  try {
    const notifications = await getMyNotifications(
      req.user.id,
      req.user.role,
    );

    return res
      .status(STATUS_CODES.OK)
      .json(notifications);
  } catch (error) {
    next(error);
  }
};


export const markAsRead = async (
  req,
  res,
  next,
) => {
  try {
    const notification =
      await markNotificationAsRead(
        req.params.id,
        req.user.id,
        req.user.role,
      );

    return res
      .status(STATUS_CODES.OK)
      .json({
        message: "Notification marked as read",
        notification,
      });
  } catch (error) {
    next(error);
  }
};


export const markAllAsRead = async (
  req,
  res,
  next,
) => {
  try {
    await markAllNotificationsAsRead(
      req.user.id,
      req.user.role,
    );

    return res
      .status(STATUS_CODES.OK)
      .json({
        message: "All notifications marked as read",
      });
  } catch (error) {
    next(error);
  }
};


export const getUnreadCount = async (
  req,
  res,
  next,
) => {
  try {
    const count =
      await getUnreadNotificationCount(
        req.user.id,
        req.user.role,
      );

    return res
      .status(STATUS_CODES.OK)
      .json({
        unread_count: count,
      });
  } catch (error) {
    next(error);
  }
};