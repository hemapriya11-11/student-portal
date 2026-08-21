import jwt from "jsonwebtoken";

import User from "../models/user.js";

import { MESSAGES } from "../constants/messages.js";

import { STATUS_CODES } from "../constants/statusCodes.js";

export const verifyResetToken = async (req, res, next) => {

  try {

    const { token } = req.params;



    const user = await User.findOne({

      where: {

        reset_token: token,

      },

    });

    if (!user) {

      return res.status(STATUS_CODES.BAD_REQUEST).send(MESSAGES.INVALID_TOKEN);

    }



    if (new Date(user.reset_token_expiry) < new Date()) {

      return res.status(STATUS_CODES.BAD_REQUEST).send(MESSAGES.TOKEN_EXPIRED);

    }



    try {

      jwt.verify(token, process.env.JWT_SECRET);

    } catch {

      return res.status(STATUS_CODES.BAD_REQUEST).send(MESSAGES.INVALID_TOKEN);

    }



    req.user = user;

    next();

  } catch (error) {

    console.error(error);

    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send(MESSAGES.SOMETHING_WENT_WRONG);

  }

};