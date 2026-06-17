import express from "express";
import dotenv from "dotenv";
import { router } from "./routes.js";
import connectDB from "./src/helper/dbConnection.js";
import { initModels } from "./src/model/core.js";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  try {
    const sequelize = await connectDB();
    initModels(sequelize);

    router(app);

    app.listen(PORT, () => {
      console.log("Server listening on PORT:", PORT);
    });
  } catch (err) {
    console.log("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
