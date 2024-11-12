import prisma from "@repo/db/client";
import { Router } from "express";

const avatarRouter = Router();

avatarRouter.get("/all", async (req, res) => {
  try {
    const avatars = await prisma.avatar.findMany({});
    if (avatars.length === 0) {
      res.status(500).json({
        message: "Avatars not found.",
      });
      return;
    }
    res.json({
      avatars,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Database Error.",
      error,
    });
    return;
  }
});

export default avatarRouter;
