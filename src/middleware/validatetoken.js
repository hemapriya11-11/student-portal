import Jwt from "jsonwebtoken";

export const verifytoken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("Token required");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Invalid token format");
  }

  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).send("Invalid or expired token");
  }
};