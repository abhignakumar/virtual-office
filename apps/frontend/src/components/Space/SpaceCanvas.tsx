import { getSpaceData } from "@/lib/requests";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { OutGoingMessage } from "@repo/lib/types";
import { CELL_SIZE } from "@repo/lib/config";

const CANVAS_WIDTH = 1100;
const CANVAS_HEIGHT = 600;
const GRID_ROWS = CANVAS_HEIGHT / CELL_SIZE;
const GRID_COLS = CANVAS_WIDTH / CELL_SIZE;

interface UserPosition {
  x: number;
  y: number;
}

interface OtherUser {
  userId: string;
  locationX: number;
  locationY: number;
}

interface ElementPositionData {
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
}

export const SpaceCanvas = () => {
  const params = useParams();
  const WS_URL = "ws://localhost:8080";
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    }
  );

  const [userId, setUserId] = useState<String>();
  const [isJoined, setIsJoined] = useState<Boolean>(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["space-data"],
    queryFn: () => getSpaceData(params.spaceId || ""),
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [userPosition, setUserPosition] = useState<UserPosition>();
  const [otherUsers, setOtherUsers] = useState<OtherUser[]>([]);
  const [elementPositions, setElementPositions] = useState<
    ElementPositionData[]
  >([]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    context.strokeStyle = "#ddd";
    for (let i = 0; i < GRID_COLS; i++) {
      for (let j = 0; j < GRID_ROWS; j++) {
        context.strokeRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    // Draw objects (tables and chairs)
    elementPositions.forEach((e) => {
      context.fillStyle = e.element.hexColor;
      context.fillRect(
        e.locationX * CELL_SIZE,
        e.locationY * CELL_SIZE,
        e.element.width * CELL_SIZE,
        e.element.height * CELL_SIZE
      );
    });

    // Draw user as a circle with a name tag
    context.fillStyle = "blue";
    context.beginPath();
    context.arc(
      userPosition?.x! * CELL_SIZE + CELL_SIZE / 2,
      userPosition?.y! * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 3,
      0,
      2 * Math.PI
    );
    context.fill();
    context.font = "12px Arial";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.fillText(
      "You",
      userPosition?.x! * CELL_SIZE + CELL_SIZE / 2,
      userPosition?.y! * CELL_SIZE - 5
    );

    // Draw other users as a circle with a name tag
    otherUsers?.forEach((otherUser) => {
      context.fillStyle = "red";
      context.beginPath();
      context.arc(
        otherUser.locationX * CELL_SIZE + CELL_SIZE / 2,
        otherUser.locationY * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 3,
        0,
        2 * Math.PI
      );
      context.fill();
      context.font = "12px Arial";
      context.fillStyle = "black";
      context.textAlign = "center";
      context.fillText(
        "Other",
        otherUser.locationX * CELL_SIZE + CELL_SIZE / 2,
        otherUser.locationY * CELL_SIZE - 5
      );
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    setUserPosition((pos) => {
      let { x, y } = pos!;
      if (e.key === "ArrowUp") y = Math.max(0, y - 1);
      if (e.key === "ArrowDown") y = Math.min(GRID_ROWS - 1, y + 1);
      if (e.key === "ArrowLeft") x = Math.max(0, x - 1);
      if (e.key === "ArrowRight") x = Math.min(GRID_COLS - 1, x + 1);
      sendJsonMessage({
        type: "move",
        payload: {
          locationX: x,
          locationY: y,
        },
      });
      return { x, y };
    });
  };

  useEffect(() => {
    if (data) setElementPositions(data.map.elementPositions);
  }, [data]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN && data && !isJoined) {
      setIsJoined(true);
      sendJsonMessage({
        type: "join",
        payload: {
          token: localStorage.getItem("token"),
          spaceId: params.spaceId,
          mapId: data?.map.id as string,
        },
      });
    }
  }, [readyState, data]);

  useEffect(() => {
    if (lastJsonMessage) {
      const jsonMsg = lastJsonMessage as OutGoingMessage;
      switch (jsonMsg.type) {
        case "join_accepted":
          setUserId(jsonMsg.payload.userId);
          setUserPosition({
            x: jsonMsg.payload.locationX,
            y: jsonMsg.payload.locationY,
          });
          setOtherUsers(jsonMsg.payload.otherUsers);
          break;
        case "joined":
          if (userId && jsonMsg.payload.userId != userId)
            setOtherUsers((prev) => [...prev, jsonMsg.payload]);
          break;
        case "move_accepted":
          setUserPosition({
            x: jsonMsg.payload.locationX,
            y: jsonMsg.payload.locationY,
          });
          break;
        case "move_rejected":
          setUserPosition({
            x: jsonMsg.payload.locationX,
            y: jsonMsg.payload.locationY,
          });
          break;
        case "moved":
          setOtherUsers((prev) => {
            let prevOtherUsers = [...prev];
            prevOtherUsers.forEach((ou) => {
              if (ou.userId === jsonMsg.payload.userId) {
                ou.locationX = jsonMsg.payload.locationX;
                ou.locationY = jsonMsg.payload.locationY;
              }
            });
            return prevOtherUsers;
          });
          break;
        case "user_left":
          setOtherUsers((prev) => {
            let prevOtherUsers = prev.filter(
              (ou) => ou.userId != jsonMsg.payload.userId
            );
            return prevOtherUsers;
          });
          break;
      }
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    draw();
  }, [otherUsers, userPosition, elementPositions]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isLoading)
    return (
      <div className="p-5 flex justify-center">
        <Loader className="animate-spin" />
      </div>
    );

  if (error) {
    console.log(error);
    return <div>Error</div>;
  }

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="rounded-md border border-neutral-400 bg-white"
    ></canvas>
  );
};
