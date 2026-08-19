import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export const verifyResetToken = async (
    req,
    res,
    next
) => {
    const { token } = req.params;

    const [users] = await pool.query(
        "SELECT * FROM users WHERE reset_token=?",
        [token]
    );

    if (users.length === 0) {
        return res.status(400).send(
            "Invalid token"
        );
    }

    const user = users[0];

    if (
        new Date(user.reset_token_expiry) <
        new Date()
    ) {
        return res.status(400).send(
            "Token expired"
        );
    }

    try {
        jwt.verify(
            token,
            process.env.JWT_SECRET
        );
    } catch {
        return res.status(400).send(
            "Invalid token"
        );
    }

    req.user = user;

    next();
};