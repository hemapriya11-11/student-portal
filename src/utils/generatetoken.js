import crypto from "crypto"
import Jwt from "jsonwebtoken";

export const generatetoken = (payload, expiry, secret) => {
  return Jwt.sign({
      ...payload,
      jti: crypto.randomUUID(),
    }, secret, {
    expiresIn: expiry,
  });
};