import { OutGoingMessage } from "@repo/lib/types";
import { GameEngine } from "./GameEngine";
import { User } from "./User";

export class SpaceManager {
  private static instance: SpaceManager | undefined;
  private spaceUsersMap: Map<String, User[]> = new Map();

  private constructor() {}

  public static getInstance(): SpaceManager {
    if (!this.instance) this.instance = new SpaceManager();
    return this.instance;
  }

  public addSpaceUser(spaceId: string, mapId: string, user: User): void {
    if (!this.spaceUsersMap.has(spaceId)) {
      this.spaceUsersMap.set(spaceId, []);
      if (!GameEngine.getInstance().isMapAlreadySaved(mapId))
        GameEngine.getInstance().fetchMapAndSave(mapId);
    }
    this.spaceUsersMap.get(spaceId)?.push(user);
    console.log(this.spaceUsersMap);
  }

  public getUsers(spaceId: string): User[] {
    console.log(this.spaceUsersMap);
    return this.spaceUsersMap.get(spaceId) || [];
  }

  public userLeft(userId: string, spaceId: string) {
    const filteredUsers = this.spaceUsersMap
      .get(spaceId)
      ?.filter((user) => user.id !== userId);
    this.spaceUsersMap.set(spaceId, filteredUsers || []);
    for (let x of this.spaceUsersMap) {
      if (x[1].length == 0) this.spaceUsersMap.delete(x[0]);
    }
    console.log(this.spaceUsersMap);
  }

  public sendMessageToAllInSpace(spaceId: string, message: OutGoingMessage) {
    this.spaceUsersMap.get(spaceId)?.forEach((user) => {
      user.send(message);
    });
  }
}
