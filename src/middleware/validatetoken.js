export const verifytoken = (req, res, next) => {
  const authheader = req.header.authorization;
  if (!authheader) {
    return res.status(400).send("token required");
  }
  const token = authheader.split(" ")[1];
  try {
    Jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    res.status(401).send("invalid token");
  }
};
