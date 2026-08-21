import bcrypt from "bcrypt";

import { generatetoken } from "../utils/generatetoken.js";

import User from "../models/user.js";

import { STATUS_CODES } from "../constants/statusCodes.js";

import { MESSAGES } from "../constants/messages.js";

export const signup = async (req, res) => {

  try {

    const { user_name, email, password } = req.body;

    const existingUser = await User.findOne({

      where: {

        email,

      },

    });

    if (existingUser) {

      return res

        .status(STATUS_CODES.BAD_REQUEST)

        .send(MESSAGES.USER_ALREADY_EXISTS);

    }

    const hashedPass = await bcrypt.hash(password, 10);

    await User.create({

      user_name,

      email,

      password: hashedPass,

    });

    return res.status(STATUS_CODES.CREATED).send(MESSAGES.USER_CREATED);

  } catch (error) {

    console.error(error);

    return res

      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)

      .send(MESSAGES.SOMETHING_WENT_WRONG);

  }

};

export const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const users = await User.findOne({

      where: {

        email,

      },

    });

    if (!users) {

      return res

        .status(STATUS_CODES.BAD_REQUEST)

        .send(MESSAGES.REGISTER_FIRST);

    }

    const passwordMatch = await bcrypt.compare(password, users.password);

    if (!passwordMatch) {

      return res

        .status(STATUS_CODES.UNAUTHORIZED)

        .send(MESSAGES.INVALID_CREDENTIALS);

    }

    const token = generatetoken(

      {

        id: users.id,

        email: users.email,

        role: users.role,

      },

      "1h",

    );

    return res.status(STATUS_CODES.OK).json({

      msg: MESSAGES.LOGIN_SUCCESS,

      token: token,

    });

  } catch (error) {

    console.error(error);

    return res

      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)

      .send(MESSAGES.SOMETHING_WENT_WRONG);

  }

};

export const forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({

      where: { email },

    });

    if (!user) {

      return res

        .status(STATUS_CODES.NOT_FOUND)

        .send(MESSAGES.USER_NOT_FOUND);

    }

    const token = generatetoken(

      {

        email: user.email,

      },

      "15m",

    );

    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await User.update(

      {

        reset_token: token,

        reset_token_expiry: expiry,

      },

      {

        where: { id: user.id },

      },

    );

    return res.status(STATUS_CODES.OK).send(token);

  } catch (error) {

    console.error(error);

    return res

      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)

      .send(MESSAGES.SOMETHING_WENT_WRONG);

  }

};

export const resetPassword = async (req, res) => {

  try {

    const { password } = req.body;

    const hashedPass = await bcrypt.hash(password, 10);

    await User.update(

      {

        password: hashedPass,

        reset_token: null,

        reset_token_expiry: null,

      },

      {

        where: { id: req.user.id },

      },

    );

    return res

      .status(STATUS_CODES.OK)

      .send(MESSAGES.PASSWORD_RESET_SUCCESS);

  } catch (error) {

    console.error(error);

    return res

      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)

      .send(MESSAGES.SOMETHING_WENT_WRONG);

  }

};