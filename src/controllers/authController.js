import bcrypt from "bcrypt";
import { pool } from "../config/db.js";
import {generatetoken} from "../utils/generatetoken.js"


export const signup = async (req, res) => {
  try {
    const { user_name, email, password } = req.body;

    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email=?",
      [email],
    );

    if (existingUser.length > 0) {
      return res.status(400).send("User already exists");
    }

    const hashedPass = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (user_name, email, password) VALUES (?, ?, ?)",
      [user_name, email, hashedPass],
    );

    return res.status(201).send("User created successfully");
  } catch (error) {
    console.error(error);

    return res.status(500).send("Something went wrong");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(400).send("Register first");
    }

    const currentUser = users[0];

    const passwordMatch = await bcrypt.compare(password, currentUser.password);

    if (!passwordMatch) {
      return res.status(401).send("Invalid credentials");
    }

    const token = generatetoken({
        id:currentUser.id,
        email:currentUser.email
    },
    "1h"
    );

    return res.status(200).json({
        msg:"login success",
        token:token
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send("Something went wrong");
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const [users] = await pool.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(404).send("User not found");
    }

    const user = users[0];

    const token = generatetoken({
        email:user.email
    },"15m")
    

    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      "UPDATE users SET reset_token=?, reset_token_expiry=? WHERE id=?",
      [token, expiry, user.id],
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

        const hashedPass = await bcrypt.hash(
            password,
            10
        );

    await pool.query(
      `UPDATE users
             SET password=?,
                 reset_token=NULL,
                 reset_token_expiry=NULL
             WHERE id=?`,
            [hashedPass, req.user.id]
        );

        return res
            .status(200)
            .send("Password reset successful");
    } catch (error) {
        console.error(error);

        return res
            .status(500)
            .send("Something went wrong");
    }
};