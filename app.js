import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import "dotenv/config.js";
import { ideasRoutes } from "./routes/ideasRoutes.js";
import HttpError from "./models/htpp-error.js";
import { usersRoutes } from "./routes/usersRoutes.js";

const app = express();
const url = process.env.MONGO_URL;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/ideas", ideasRoutes);
app.use("/api/user", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(url)
  .then(() => {
    app.listen(8001);
  })
  .catch((err) => {
    console.log(err);
  });
