
import Announcement from "../models/announcement.js";

import { Op } from "sequelize";

import { AppError } from "../utils/appError.js";

import { STATUS_CODES } from "../constants/statusCodes.js";

export const createAnnouncementService = async ({
  title,
  content,
  audience,
  created_by,
  created_by_role,
}) => {
  const announcement = await Announcement.create({
    title,
    content,
    audience,
    created_by,
    created_by_role,
  });

  return announcement;
};

export const getAnnouncementsService = async ({ role }) => {
  let audienceFilter;

  if (role === "admin") {
    audienceFilter = ["ALL", "STUDENTS", "STAFF"];
  }

  if (role === "staff") {
    audienceFilter = ["ALL", "STAFF"];
  }

  if (role === "student") {
    audienceFilter = ["ALL", "STUDENTS"];
  }

  const announcements = await Announcement.findAll({
    where: {
      audience: {
        [Op.in]: audienceFilter,
      },
    },
    order: [["created_at", "DESC"]],
  });

  return announcements;
};

export const getAnnouncementByIdService = async ({
  id,
  role,
}) => {
  let audienceFilter;

  if (role === "admin") {
    audienceFilter = ["ALL", "STUDENTS", "STAFF"];
  }

  if (role === "staff") {
    audienceFilter = ["ALL", "STAFF"];
  }

  if (role === "student") {
    audienceFilter = ["ALL", "STUDENTS"];
  }

  const announcement = await Announcement.findOne({
    where: {
      id,
      audience: {
        [Op.in]: audienceFilter,
      },
    },
  });

  if (!announcement) {
    throw new AppError(
      "Announcement not found",
      STATUS_CODES.NOT_FOUND,
    );
  }

  return announcement;
};

export const updateAnnouncementService = async ({
  id,
  title,
  content,
  audience,
}) => {
  const announcement = await Announcement.findByPk(id);

  if (!announcement) {
    throw new AppError(
      "Announcement not found",
      STATUS_CODES.NOT_FOUND,
    );
  }

  announcement.title = title;
  announcement.content = content;
  announcement.audience = audience;

  await announcement.save();

  return announcement;
};

export const patchAnnouncementService = async ({
  id,
  ...updates
}) => {
  const announcement = await Announcement.findByPk(id);

  if (!announcement) {
    throw new AppError(
      "Announcement not found",
      STATUS_CODES.NOT_FOUND,
    );
  }

  await announcement.update(updates);

  return announcement;
};

export const deleteAnnouncementService = async ({ id }) => {
  const announcement = await Announcement.findByPk(id);

  if (!announcement) {
    throw new AppError(
      "Announcement not found",
      STATUS_CODES.NOT_FOUND,
    );
  }

  const deletedAnnouncement = announcement.toJSON();

  await announcement.destroy();

  return deletedAnnouncement;
};

