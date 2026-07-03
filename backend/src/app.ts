import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./modules/auth/auth.routes.js";
import favoritesRouter from "./modules/favorites/favorites.routes.js";

const app = express();


//middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/v1/api/auth", userRouter);
app.use("/v1/api/favorites", favoritesRouter);

export default app;