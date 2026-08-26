export const generatetoken = (payload, expiry, secret) => {
  return Jwt.sign(payload, secret, {
    expiresIn: expiry,
  });
};