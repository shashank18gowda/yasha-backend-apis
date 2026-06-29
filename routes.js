import authApiHandler from "./src/controller/auth/apiHandler.js";
import subjectApiHandler from "./src/controller/masterdata/subjects/apiHandler.js";


export const router = (app) => {
  app.use("/api/auth", authApiHandler);
  app.use("/api/masterdata/subject", subjectApiHandler);
}