import express from "express";
import v1Router from "./routers/v1/v1Router";
import cors from "cors";

const PORT = 3000;
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1", v1Router);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} ...`);
});
