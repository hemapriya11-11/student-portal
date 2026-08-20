import Jwt from "jsonwebtoken";

export const verifytoken = (req, res, next) => {
  const authheader = req.headers.authorization;

  if (!authheader) {
    return res.status(400).send("Token required");
  }

  const token = authheader.split(" ")[1];

  try {
    const decoded = Jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch {
    return res.status(401).send("Invalid token");
  }
};