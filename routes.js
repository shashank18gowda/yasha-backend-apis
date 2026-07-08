import authApiHandler from "./src/controller/auth/apiHandler.js";
import subjectApiHandler from "./src/controller/masterdata/subjects/apiHandler.js";
import schoolApiHandler from "./src/controller/masterdata/school/apiHandler.js";
import interestApiHandler from "./src/controller/masterdata/interest/apiHandler.js";
import gradeApiHandler from "./src/controller/masterdata/grade/apiHandler.js";


export const router = (app) => {
  app.use("/api/auth", authApiHandler);
  app.use("/api/masterdata/subject", subjectApiHandler);
  app.use("/api/masterdata/school", schoolApiHandler);
  app.use("/api/masterdata/interest", interestApiHandler);
  app.use("/api/masterdata/interest", interestApiHandler);
  app.use("/api/masterdata/grade", gradeApiHandler);
}