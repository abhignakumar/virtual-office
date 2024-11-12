import prisma from "@repo/db/client";
import { Router } from "express";

const mapRouter = Router();

mapRouter.get("/all", async (req, res) => {
  try {
    const maps = await prisma.map.findMany({});
    res.json({ maps });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Database error.",
      error,
    });
    return;
  }
});

mapRouter.get("/:mapId", async (req, res) => {
  const mapId = req.params.mapId;
  if (!mapId) {
    res.status(400).json({
      message: "Map ID does not exist.",
    });
    return;
  }
  try {
    const map = await prisma.map.findFirst({
      where: {
        id: mapId,
      },
      include: {
        elementPositions: {
          include: {
            element: true,
          },
        },
      },
    });
    if (!map) {
      res.status(400).json({
        message: "Map does not exist.",
      });
      return;
    }
    res.json(map);
    return;
  } catch (error) {
    res.status(400).json({
      message: "Database error.",
      error,
    });
    return;
  }
});

export default mapRouter;
