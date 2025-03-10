import { Router } from "express";
import { LogInSchema, SignUpSchema } from "@repo/lib/zodTypes";
import prisma from "@repo/db/client";
import jwt from "jsonwebtoken";

const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  const validationCheck = SignUpSchema.safeParse(req.body);
  if (!validationCheck.success) {
    res.status(400).json({
      message: "Validation failed.",
      error: validationCheck.error,
    });
    return;
  }
  try {
    await prisma.user.create({
      data: {
        name: validationCheck.data.name,
        email: validationCheck.data.email,
        password: validationCheck.data.password,
        avatarId: validationCheck.data.avatarId,
      },
    });
    res.json({
      message: "User signed up successfully.",
    });
    return;
  } catch (error) {
    res.status(400).json({
      message: "User already exists (or) Database error.",
      error,
    });
    return;
  }
});

authRouter.post("/login", async (req, res) => {
  const validationCheck = LogInSchema.safeParse(req.body);
  if (!validationCheck.success) {
    res.status(400).json({
      message: "Validation failed.",
      error: validationCheck.error,
    });
    return;
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: validationCheck.data.email,
      },
    });
    if (!user) {
      res.status(400).json({
        message: "User does not exists.",
      });
      return;
    }
    if (user.password !== validationCheck.data.password) {
      res.status(401).json({
        message: "Password is incorrect.",
      });
      return;
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    res.json({
      token,
    });
    return;
  } catch (error) {
    res.status(400).json({
      message: "Database error.",
      error,
    });
    return;
  }
});

export default authRouter;
