import http from "http";
import app from "./API/app.js";
import dotenv from "dotenv";

dotenv.config();

const server = http.createServer(app);

server.on("listening", () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});

server.listen(process.env.PORT);
