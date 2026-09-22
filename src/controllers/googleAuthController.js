import { generateAuthTokens } from "../services/authService.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { MESSAGES } from "../constants/messages.js";


export const googleAuthCallback = (req, res) => {
const { accessToken, refreshToken } = generateAuthTokens(req.user);

res.cookie("refreshToken", refreshToken, {
httpOnly: true,
secure: process.env.NODE_ENV === "production",
sameSite: "lax",
maxAge: 7 * 24 * 60 * 60 * 1000,
});

return res.status(STATUS_CODES.OK).json({
msg: MESSAGES.LOGIN_SUCCESS,
token: accessToken,
});
};
