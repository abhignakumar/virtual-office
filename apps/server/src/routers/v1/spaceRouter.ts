import { Router } from "express";
import { userMiddleware } from "../../middlewares/userMiddleware";
import { CreateSpaceSchema } from "@repo/lib/zodTypes";
import prisma from "@repo/db/client";

const spaceRouter = Router();
spaceRouter.use(userMiddleware);

spaceRouter.post("/create", async (req, res) => {
  const validationCheck = CreateSpaceSchema.safeParse(req.body);
  if (!validationCheck.success) {
    res.status(400).json({
      message: "Validation failed.",
      error: validationCheck.error,
    });
    return;
  }
  try {
    const space = await prisma.space.create({
      data: {
        name: validationCheck.data.name,
        creatorUserId: req.userId!,
        mapId: validationCheck.data.mapId,
        user: {
          connect: {
            id: req.userId,
          },
        },
      },
    });
    res.json({
      spaceId: space.id,
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

spaceRouter.delete("/:spaceId", async (req, res) => {
  const spaceId = req.params.spaceId;
  if (!spaceId) {
    res.status(400).json({
      message: "Space ID does not exist.",
    });
    return;
  }
  try {
    const space = await prisma.space.findFirst({
      where: {
        id: spaceId,
      },
    });
    if (!space) {
      res.status(400).json({
        message: "Space does not exist",
      });
      return;
    }
    if (space.creatorUserId === req.userId) {
      await prisma.space.delete({
        where: {
          id: spaceId,
          creatorUserId: req.userId,
        },
      });
      res.json({
        message: "Space deleted.",
      });
      return;
    } else {
      const space = await prisma.space.update({
        where: {
          id: spaceId,
        },
        data: {
          user: {
            disconnect: {
              id: req.userId,
            },
          },
        },
      });
      res.json({
        message: "Space exited.",
      });
      return;
    }
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete space (or) Database error.",
      error,
    });
    return;
  }
});

spaceRouter.get("/all", async (req, res) => {
  try {
    const spaces = await prisma.space.findMany({
      where: {
        user: {
          some: {
            id: req.userId,
          },
        },
      },
    });
    const filteredSpaces = spaces.map((s) => {
      return { id: s.id, name: s.name, createdAt: s.createdAt };
    });
    res.json({ spaces: filteredSpaces });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Database error.",
      error,
    });
    return;
  }
});

spaceRouter.get("/:spaceId", async (req, res) => {
  const spaceId = req.params.spaceId;
  if (!spaceId) {
    res.status(400).json({
      message: "Space ID does not exist.",
    });
    return;
  }
  try {
    const space = await prisma.space.findFirst({
      where: {
        id: spaceId,
      },
      include: {
        map: {
          include: {
            elementPositions: {
              include: {
                element: true,
              },
            },
          },
        },
      },
    });
    if (!space) {
      res.status(400).json({
        message: "Space does not exist.",
      });
      return;
    }
    res.json(space);
    return;
  } catch (error) {
    res.status(400).json({
      message: "Database error.",
      error,
    });
    return;
  }
});

spaceRouter.post("/invite/:spaceId", async (req, res) => {
  const spaceId = req.params.spaceId;
  if (!spaceId) {
    res.status(400).json({
      message: "Space ID does not exist.",
    });
    return;
  }
  try {
    const userSpace = await prisma.space.findFirst({
      where: {
        id: spaceId,
        user: {
          some: {
            id: req.userId,
          },
        },
      },
    });
    if (userSpace) {
      res.status(400).json({
        message: "Space already joined.",
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      message: "Database error.",
      error,
    });
    return;
  }
  try {
    const space = await prisma.space.update({
      where: {
        id: spaceId,
      },
      data: {
        user: {
          connect: {
            id: req.userId,
          },
        },
      },
    });
    res.json({ space });
    return;
  } catch (error) {
    res.status(400).json({
      message: "Space does not exist (or) Database error.",
      error,
    });
    return;
  }
});

export default spaceRouter;
