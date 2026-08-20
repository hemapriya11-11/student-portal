import bcrypt from "bcrypt";
import { generatetoken } from "../utils/generatetoken.js";
import User from "../models/user.js";

export const signup = async (req, res) => {
  try {
    const { user_name, email, password } = req.body;
    const existingUser = await User.findOne({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const hashedPass = await bcrypt.hash(password, 10);

    await User.create({
      user_name,
      email,
      password: hashedPass,
    });

    return res.status(201).send("User created successfully");
  } catch (error) {
    console.error(error);

    return res.status(500).send("Something went wrong");
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
      return res.status(400).send("Register first");
    }
    console.log("Entered password:", password);
    console.log("Stored password:", users.password);

    const passwordMatch = await bcrypt.compare(password, users.password);

    if (!passwordMatch) {
      return res.status(401).send("Invalid credentials");
    }

    const token = generatetoken(
      {
        id: users.id,
        email: users.email,
        role: users.role,
      },
      "1h",
    );

    return res.status(200).json({
      msg: "Login success",
      token: token,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send("Something went wrong");
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).send("User not found");
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

    return res.status(200).send(token);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
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

    return res.status(200).send("Password reset successful");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
};
