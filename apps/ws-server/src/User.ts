import { WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/lib/config";
import { OutGoingMessage } from "@repo/lib/types";
import { SpaceManager } from "./SpaceManager";
import { GameEngine } from "./GameEngine";

export class User {
  private ws;
  private spaceId;
  private mapId;
  public id;
  public locationX;
  public locationY;

  constructor(ws: WebSocket) {
    this.ws = ws;
    this.id = generateRandomId(7);
    this.locationX = 0;
    this.locationY = 0;
    this.spaceId = "";
    this.mapId = "";
    this.initHandlers();
  }

  async initHandlers() {
    this.ws.on("message", async (data) => {
      const jsonData = JSON.parse(data.toString());
      try {
        switch (jsonData.type) {
          case "join":
            try {
              const decoded = jwt.verify(
                jsonData.payload.token,
                JWT_SECRET
              ) as string;
              this.spaceId = jsonData.payload.spaceId;
              this.mapId = jsonData.payload.mapId;
              SpaceManager.getInstance().addSpaceUser(
                jsonData.payload.spaceId,
                jsonData.payload.mapId,
                this
              );
              this.locationX = getRandomNumber(
                0,
                GameEngine.getInstance().getMapDimensions(this.mapId).width ||
                  10
              );
              this.locationY = getRandomNumber(
                0,
                GameEngine.getInstance().getMapDimensions(this.mapId).height ||
                  10
              );
              const otherUsers = SpaceManager.getInstance()
                .getUsers(this.spaceId)
                .map((u) => {
                  return {
                    userId: u.id,
                    locationX: u.locationX,
                    locationY: u.locationY,
                  };
                })
                .filter((u) => u.userId != this.id);
              this.send({
                type: "join_accepted",
                payload: {
                  userId: this.id,
                  locationX: this.locationX,
                  locationY: this.locationY,
                  otherUsers: otherUsers,
                },
              });
              SpaceManager.getInstance().sendMessageToAllInSpace(this.spaceId, {
                type: "joined",
                payload: {
                  userId: this.id,
                  locationX: this.locationX,
                  locationY: this.locationY,
                },
              });
            } catch (error) {
              console.log("[Token Verification failed] : " + error);
              this.send({
                type: "error",
                payload: {
                  message: "Token is invalid",
                },
              });
            }
            break;
          case "move":
            if (this.spaceId.length == 0) {
              this.send({
                type: "move_rejected",
                payload: {
                  message:
                    "Move rejected. User didn't joined space (spaceId does not exist).",
                  locationX: this.locationX,
                  locationY: this.locationY,
                },
              });
              break;
            }
            const isValid = GameEngine.getInstance().isValidMove(
              this.id,
              this.spaceId,
              this.mapId,
              jsonData.payload.locationX,
              jsonData.payload.locationY
            );
            console.log(jsonData);
            console.log("isvalid - " + isValid);
            if (isValid) {
              this.locationX = jsonData.payload.locationX;
              this.locationY = jsonData.payload.locationY;
              this.send({
                type: "move_accepted",
                payload: {
                  userId: this.id,
                  locationX: this.locationX,
                  locationY: this.locationY,
                },
              });
              SpaceManager.getInstance().sendMessageToAllInSpace(this.spaceId, {
                type: "moved",
                payload: {
                  userId: this.id,
                  locationX: jsonData.payload.locationX,
                  locationY: jsonData.payload.locationY,
                },
              });
            } else {
              this.send({
                type: "move_rejected",
                payload: {
                  message: "Move rejected. Collision.",
                  locationX: this.locationX,
                  locationY: this.locationY,
                },
              });
            }
            break;
          case "exit":
            this.ws.close();
            break;
        }
      } catch (error) {
        console.log("[Something went wrong] : " + error);
        this.send({
          type: "error",
          payload: {
            message: "Something went wrong.",
          },
        });
      }
    });

    this.ws.on("close", () => {
      console.log("User disconnected");
      SpaceManager.getInstance().userLeft(this.id, this.spaceId);
      SpaceManager.getInstance().sendMessageToAllInSpace(this.spaceId, {
        type: "user_left",
        payload: {
          userId: this.id,
        },
      });
    });
  }

  send(message: OutGoingMessage) {
    this.ws.send(JSON.stringify(message));
  }
}

function generateRandomId(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
