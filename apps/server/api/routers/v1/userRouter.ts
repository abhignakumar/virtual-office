import { Router } from "express";
import { userMiddleware } from "../../middlewares/userMiddleware";
import prisma from "@repo/db/client";

const userRouter = Router();
userRouter.use(userMiddleware);

userRouter.get("/", async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.userId,
      },
      select: {
        id: true,
        name: true,
        avatar: true,
      },
    });
    if (!user) {
      res.status(400).json({
        message: "User does not exist.",
      });
      return;
    }
    res.json({ user });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Database error.",
      error,
    });
    return;
  }
});

export default userRouter;
