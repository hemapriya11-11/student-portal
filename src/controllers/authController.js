import bcrypt from "bcrypt";
import { pool } from "../config/db.js";
import jwt from "jsonwebtoken"



export const signup = async (req, res) => {
    try {
        const { user_name, email, password } = req.body;

        if (!user_name || !email || !password) {
            return res.status(400).send("Credentials missing");
        }

        const [existingUser] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).send("User already exists");
        }

        const hashedPass = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO users (user_name, email, password) VALUES (?, ?, ?)",
            [user_name, email, hashedPass]
        );

        return res.status(201).send("User created successfully");

    } catch (error) {
        console.error(error);

        return res.status(500).send("Something went wrong");
    }
};


export const login=async (req,res) =>{
    try{
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("Credentials missing");
        }

        const [user] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        const currentuser =user[0]

        if(user.length===0){
            return res.status(400).send("register first")
        }
        const passmatch=await bcrypt.compare(password,currentuser.password)
        if(!passmatch){
            return res.status(401).send("invalid credentials")
        }

        const token=jwt.sign(
            {
                id:currentuser.id,
                email:currentuser.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"1h"
            }
        );
        return res.status(200).send(
    `Login successful. Token: ${token}`)


    }
 catch(error){
    console.error(error)
    return res.status(402).send("something went wrong")
}
};
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).send("email required");
        }

        const [users] = await pool.query(
            "SELECT * FROM users WHERE email=?",
            [email]
        );

        if (users.length === 0) {
            return res.status(404).send("user not found");
        }

        const user = users[0];

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        );

        const expiry = new Date(Date.now() + 15 * 60 * 1000);

        await pool.query(
            "UPDATE users SET reset_token=?, reset_token_expiry=? WHERE id=?",
            [token, expiry, user.id]
        );

        return res.status(200).send(token);

    } catch (error) {
        console.error(error);

        return res.status(500).send("something went wrong");
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).send("password required");
        }

        const [users] = await pool.query(
            "SELECT * FROM users WHERE reset_token=?",
            [token]
        );

        if (users.length === 0) {
            return res.status(400).send("invalid token");
        }

        const user = users[0];

        if (new Date(user.reset_token_expiry) < new Date()) {
            return res.status(400).send("token expired");
        }

       try {
             jwt.verify(token, process.env.JWT_SECRET);
       } catch {
               return res.status(400).send("invalid or expired token");
       }


        const hashedPass = await bcrypt.hash(password, 10);

        await pool.query(
            `UPDATE users
             SET password=?,
                 reset_token=NULL,
                 reset_token_expiry=NULL
             WHERE id=?`,
            [hashedPass, user.id]
        );

        return res.status(200).send("password reset successful");

    } catch (error) {
        console.error(error);

        return res.status(500).send("something went wrong");
    }
}; 