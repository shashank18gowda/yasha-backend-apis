import authApiHandler from "./src/controller/auth/apiHandler.js";

export const router = (app) => {
  app.use("/api/auth", authApiHandler);
}