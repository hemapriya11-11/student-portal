
import {
  createAnnouncementService,
  getAnnouncementsService,
  getAnnouncementByIdService,
  updateAnnouncementService,
  patchAnnouncementService,
  deleteAnnouncementService,
} from "../services/announcementService.js";

import { STATUS_CODES } from "../constants/statusCodes.js";
import { getIO } from "../config/socket.js";

export const createAnnouncement = async (req, res, next) => {
  try {
    const announcement = await createAnnouncementService({
      ...req.body,
      created_by: req.user.id,
      created_by_role: req.user.role,
    });

    const io = getIO();

    if (announcement.audience === "ALL") {
      io.emit("announcement:created", announcement);
    }

    if (announcement.audience === "STUDENTS") {
      io.to("student").emit(
        "announcement:created",
        announcement,
      );
    }

    if (announcement.audience === "STAFF") {
      io.to("staff").emit(
        "announcement:created",
        announcement,
      );
    }

    return res
      .status(STATUS_CODES.CREATED)
      .json({
        message: "Announcement created successfully",
        id: announcement.id,
      });
  } catch (error) {
    next(error);
  }
};

export const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await getAnnouncementsService({
      role: req.user.role,
    });

    return res
      .status(STATUS_CODES.OK)
      .json(announcements);
  } catch (error) {
    next(error);
  }
};

export const getAnnouncementById = async (req, res, next) => {
  try {
    const announcement =
      await getAnnouncementByIdService({
        id: req.params.id,
        role: req.user.role,
      });

    return res
      .status(STATUS_CODES.OK)
      .json(announcement);
  } catch (error) {
    next(error);
  }
};

export const updateAnnouncement = async (req, res, next) => {
  try {
    const announcement =
      await updateAnnouncementService({
        id: req.params.id,
        ...req.body,
      });

    const io = getIO();

    if (announcement.audience === "ALL") {
      io.emit("announcement:updated", announcement);
    }

    if (announcement.audience === "STUDENTS") {
      io.to("student").emit(
        "announcement:updated",
        announcement,
      );
    }

    if (announcement.audience === "STAFF") {
      io.to("staff").emit(
        "announcement:updated",
        announcement,
      );
    }

    return res
      .status(STATUS_CODES.OK)
      .json({
        message: "Announcement updated successfully",
      });
  } catch (error) {
    next(error);
  }
};

export const patchAnnouncement = async (req, res, next) => {
  try {
    const announcement =
      await patchAnnouncementService({
        id: req.params.id,
        ...req.body,
      });

    const io = getIO();

    if (announcement.audience === "ALL") {
      io.emit("announcement:updated", announcement);
    }

    if (announcement.audience === "STUDENTS") {
      io.to("student").emit(
        "announcement:updated",
        announcement,
      );
    }

    if (announcement.audience === "STAFF") {
      io.to("staff").emit(
        "announcement:updated",
        announcement,
      );
    }

    return res
      .status(STATUS_CODES.OK)
      .json({
        message: "Announcement updated successfully",
      });
  } catch (error) {
    next(error);
  }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement =
      await deleteAnnouncementService({
        id: req.params.id,
      });

    const io = getIO();

    io.emit("announcement:deleted", {
      id: announcement.id,
      audience: announcement.audience,
    });

    return res
      .status(STATUS_CODES.OK)
      .json({
        message: "Announcement deleted successfully",
      });
  } catch (error) {
    next(error);
  }
};

