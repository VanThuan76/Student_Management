import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import AppRoutes from "./routes/AppRoutes";
import { dbConnection } from "./db";

dotenv.config();

if (!process.env.API_ENDPOINT) {
  process.exit(1);
}

const app = express();

app.use((req, res, next) => {
  req.app.set("dbConnection", dbConnection);
  next();
});

app.use(cors({
  credentials: true,
}));

app.use(express.json());
app.use(AppRoutes);
app.use(express.static('public'));

app.listen(process.env.API_ENDPOINT, () => {
  console.log(`Server port ${process.env.API_ENDPOINT} up and running...`);
});
