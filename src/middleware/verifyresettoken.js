import jwt from "jsonwebtoken";
import  User  from "../models/user.js";

export const verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;

   
    const user = await User.findOne({
      where: {
        reset_token: token,
      },
    });

    if (!user) {
      return res.status(400).send("Invalid token");
    }

    
    if (new Date(user.reset_token_expiry) < new Date()) {
      return res.status(400).send("Token expired");
    }

  
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(400).send("Invalid token");
    }

   
    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
};