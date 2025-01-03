/* eslint-disable no-undef */

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

import app from "./src/index.js";
import dotenv from "dotenv";
import connectDB from "./src/db_configs/dbConnect.js";

dotenv.config({ path: "./config.env" });
// console.log(process.env);
connectDB();

const port = process.env.PORT;

// listen for requests

const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
