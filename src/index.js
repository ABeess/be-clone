import express from "express";
import bodyParse from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from "./routes/index.js";

dotenv.config();
//Connect Mongoose
const mongooseOptions = {
  readPreference: "primaryPreferred",
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //   useFindAndModify: false,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  promiseLibrary: global.Promise,
};

try {
  mongoose.connect(process.env.DATABASE_HOST, mongooseOptions);

  // eslint-disable-next-line no-console
  console.info(`Connected to mongo`);
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(`Could not start the app: `, error);
}

const app = express();

app.use(bodyParse.json());
app.use(cors());

app.use("/", routes);

export default app;
