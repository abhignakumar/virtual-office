import { Router } from "express";
import authRouter from "./authRouter";
import spaceRouter from "./spaceRouter";
import avatarRouter from "./avatarRouter";
import mapRouter from "./mapRouter";
import userRouter from "./userRouter";

const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/space", spaceRouter);
v1Router.use("/avatar", avatarRouter);
v1Router.use("/map", mapRouter);
v1Router.use("/user", userRouter);

export default v1Router;
