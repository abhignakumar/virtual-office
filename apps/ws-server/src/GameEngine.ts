import { SpaceManager } from "./SpaceManager";
import { MapData } from "@repo/lib/types";

export class GameEngine {
  private static instance: GameEngine;
  private maps: MapData[] = [];

  private constructor() {}

  public static getInstance() {
    if (!this.instance) this.instance = new GameEngine();
    return this.instance;
  }

  public isValidMove(
    userId: string,
    spaceId: string,
    mapId: string,
    locationX: number,
    locationY: number
  ) {
    const users = SpaceManager.getInstance().getUsers(spaceId);
    for (let user of users) {
      if (
        user.id != userId &&
        user.locationX == locationX &&
        user.locationY == locationY
      ) {
        console.log("user coll");

        return false;
      }
    }
    const map = this.maps.find((m: MapData) => m.id === mapId);
    if (!map) return false;
    for (let ep of map.elementPositions) {
      if (
        this.pointInRectangle(
          { x: locationX, y: locationY },
          {
            x: ep.locationX,
            y: ep.locationY,
            width: ep.element.width,
            height: ep.element.height,
          }
        )
      ) {
        console.log("pointinrect");

        return false;
      }
    }
    return true;
  }

  private pointInRectangle(
    point: { x: number; y: number },
    rectangle: {
      x: number;
      y: number;
      width: number;
      height: number;
    }
  ) {
    if (
      point.x >= rectangle.x &&
      point.x <= rectangle.x * rectangle.width &&
      point.y >= rectangle.y &&
      point.y <= rectangle.y * rectangle.height
    )
      return true;
    return false;
  }

  public isMapAlreadySaved(mapId: string) {
    for (let m of this.maps) {
      if (m.id == mapId) return true;
    }
    return false;
  }

  public async fetchMapAndSave(mapId: string) {
    const response = await fetch(
      `${process.env.HTTP_SERVER_URL}/api/v1/map/${mapId}`
    );
    if (response.status !== 200) return;
    const map = await response.json();
    this.maps.push(map);
  }

  public getMapDimensions(mapId: string) {
    return {
      width: this.maps.find((m) => m.id === mapId)?.width,
      height: this.maps.find((m) => m.id === mapId)?.height,
    };
  }
}
