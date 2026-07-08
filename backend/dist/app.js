import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./modules/auth/auth.routes.js";
import favoritesRouter from "./modules/favorites/favorites.routes.js";
import { apiLimiter } from "./middleware/rate-limiter.js";
const app = express();
//middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Apply rate limiting to all /v1/api/* routes
app.use("/v1/api", apiLimiter);
//routes
app.use("/v1/api/auth", userRouter);
app.use("/v1/api/favorites", favoritesRouter);
export default app;
//# sourceMappingURL=app.js.map