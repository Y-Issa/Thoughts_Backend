import express from "express";
import bodyParser from "body-parser";
import { ideasRoutes } from "./routes/ideasRoutes.js";
import mongoose from "mongoose";
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
  const error = new HttpError("Could not find this route.");
  throw error;
});

mongoose
  .connect(url)
  .then(() => {
    app.listen(8001);
  })
  .catch((err) => {
    console.log(err);
  });
