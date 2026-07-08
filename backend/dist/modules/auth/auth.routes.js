import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "./auth.controllers.js";
const router = Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
export default router;
//# sourceMappingURL=auth.routes.js.map