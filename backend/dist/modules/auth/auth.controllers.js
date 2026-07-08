import ApiResponse from "../../utils/ApiReponse.js";
import asyncHandler from "../../utils/AsyncHandler.js";
import { loginUserService, registerUserService } from "./auth.service.js";
const registerUser = asyncHandler(async (req, res) => {
    const user = await registerUserService(req.body);
    return res.status(201).json(new ApiResponse(201, user, "User registered successfully"));
});
const loginUser = asyncHandler(async (req, res) => {
    // Implement login logic here
    const result = await loginUserService(req.body);
    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(200).json(new ApiResponse(200, result, "Login successful"));
});
const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("refreshToken");
    return res.status(200).json(new ApiResponse(200, null, "Logout successful"));
});
export { registerUser, loginUser, logoutUser };
//# sourceMappingURL=auth.controllers.js.map