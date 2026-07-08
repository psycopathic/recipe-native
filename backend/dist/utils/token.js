import jwt from "jsonwebtoken";
export const createAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "30m",
    });
};
export const createRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};
//# sourceMappingURL=token.js.map