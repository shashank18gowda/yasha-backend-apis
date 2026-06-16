import express from "express";
const app = express();
import dotenv from "dotenv";
import { router } from "./routes.js";
import connectDB from "./src/helper/dbConnection.js";
dotenv.config({ quiet: true });
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
router(app);

app.listen(PORT, () => {
  console.log("Server listening on PORT:", PORT);
});
