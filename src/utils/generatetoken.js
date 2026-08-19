export const generatetoken = (payload, expiry) => {
  return Jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiry,
  });
};
