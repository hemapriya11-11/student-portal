import {
  createGrievance,
  getMyGrievances,
  getAllGrievances,
  getGrievanceById,
  updateGrievanceStatus,
  assignGrievance,
  updateGrievancePriority,
} from "../services/grievanceService.js";

import { STATUS_CODES } from "../constants/statusCodes.js";


export const createGrievanceController = async (
  req,
  res,
  next,
) => {
  try {
    const grievance = await createGrievance(
      req.user.id,
      req.body,
    );

    return res
      .status(STATUS_CODES.CREATED)
      .json({
        message: "Grievance created successfully",
        grievance,
      });
  } catch (error) {
    next(error);
  }
};


export const getMyGrievancesController = async (
  req,
  res,
  next,
) => {
  try {
    const grievances = await getMyGrievances(
      req.user.id,
    );

    return res
      .status(STATUS_CODES.OK)
      .json(grievances);
  } catch (error) {
    next(error);
  }
};


export const getAllGrievancesController = async (
  req,
  res,
  next,
) => {
  try {
    const grievances = await getAllGrievances();

    return res
      .status(STATUS_CODES.OK)
      .json(grievances);
  } catch (error) {
    next(error);
  }
};


export const getGrievanceByIdController = async (
  req,
  res,
  next,
) => {
  try {
    const grievance = await getGrievanceById(
      req.params.id,
      req.user,
    );

    return res
      .status(STATUS_CODES.OK)
      .json(grievance);
  } catch (error) {
    next(error);
  }
};


export const updateGrievanceStatusController =
  async (req, res, next) => {
    try {
      const grievance =
        await updateGrievanceStatus(
          req.params.id,
          req.body.status,
          req.user,
        );

      return res
        .status(STATUS_CODES.OK)
        .json({
          message:
            "Grievance status updated successfully",
          grievance,
        });
    } catch (error) {
      next(error);
    }
  };


export const assignGrievanceController =
  async (req, res, next) => {
    try {
      const grievance = await assignGrievance(
        req.params.id,
        req.body.assigned_staff_id,
      );

      return res
        .status(STATUS_CODES.OK)
        .json({
          message:
            "Grievance assigned successfully",
          grievance,
        });
    } catch (error) {
      next(error);
    }
  };


export const updateGrievancePriorityController =
  async (req, res, next) => {
    try {
      const grievance =
        await updateGrievancePriority(
          req.params.id,
          req.body.priority,
        );

      return res
        .status(STATUS_CODES.OK)
        .json({
          message:
            "Grievance priority updated successfully",
          grievance,
        });
    } catch (error) {
      next(error);
    }
  };