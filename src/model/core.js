import { initUserModel } from "./users.js";
import { initstudentModel } from "./students.js";
import { initsubjectModel } from "./subjects.js";
import { initgradeModel } from "./grades.js";
import { initschoolModel } from "./schools.js";
import { initinterestModel } from "./interests.js";

export const initModels = (sequelize) => {
  console.log("Initializing models...");
  const user = initUserModel(sequelize);

  //  user.sync({ alter: true });
  // console.log("Database synced in development mode.");

  const student = initstudentModel(sequelize);
  const subject = initsubjectModel(sequelize);
  const grade = initgradeModel(sequelize);
  const school = initschoolModel(sequelize);
  const interest = initinterestModel(sequelize);

  // <--------STUDENT-USER-RELATION--------->
  student.belongsTo(user, {
    as: "userInfo",
    foreignKey: {
      allowNull: false,
      name: "user_id",
    },
    targetKey: "user_id",
  });

  user.hasOne(student, {
    as: "userInfo",
    foreignKey: {
      allowNull: false,
      name: "user_id",
    },
    targetKey: "user_id",
  });

  // <--------SCHOOL-USER-RELATION--------->
  school.belongsTo(user, {
    as: "createdBy",
    foreignKey: {
      allowNull: false,
      name: "created_by",
    },
    targetKey: "user_id",
  });

  console.log("Models initialized successfully.");
};
