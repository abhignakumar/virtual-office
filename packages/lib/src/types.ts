export type OutGoingMessage =
  | {
      type: "error";
      payload: {
        message: string;
      };
    }
  | {
      type: "join_accepted";
      payload: {
        userId: string;
        locationX: number;
        locationY: number;
        otherUsers: {
          userId: string;
          locationX: number;
          locationY: number;
        }[];
      };
    }
  | {
      type: "joined";
      payload: {
        userId: string;
        locationX: number;
        locationY: number;
      };
    }
  | {
      type: "move_accepted";
      payload: {
        userId: string;
        locationX: number;
        locationY: number;
      };
    }
  | {
      type: "moved";
      payload: {
        userId: string;
        locationX: number;
        locationY: number;
      };
    }
  | {
      type: "move_rejected";
      payload: {
        message: string;
        locationX: number;
        locationY: number;
      };
    }
  | {
      type: "user_left";
      payload: {
        userId: string;
      };
    };

export type MapData = {
  id: string;
  name: string;
  width: number;
  height: number;
  elementPositions: {
    id: string;
    mapId: string;
    elementId: string;
    locationX: number;
    locationY: number;
    element: {
      id: string;
      width: number;
      height: number;
      hexColor: string;
      canUserOverlap: boolean;
    };
  }[];
};
