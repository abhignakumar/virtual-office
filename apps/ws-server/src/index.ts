import { WebSocketServer } from "ws";
import { User } from "./User";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);
  console.log("User connected");
  new User(ws);
});
