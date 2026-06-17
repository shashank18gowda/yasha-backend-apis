import { initUserModel } from "./users.js";
import { initstudentModel } from "./students.js";
import { initsubjectModel } from "./subjects.js";
import { initgradeModel } from "./grades.js";

export const initModels = (sequelize) => {
  console.log("Initializing models...");
  const user = initUserModel(sequelize);
  const student = initstudentModel(sequelize);
  const subject = initsubjectModel(sequelize);
  const grade = initgradeModel(sequelize);

  // <--------STUDENT-USER-RELATION--------->
  student.belongsTo(user, {
    as: "userInfo",
    foreignKey: {
      allowNull: true,
      name: "user_id",
    },
    targetKey: "user_id",
  });

  user.hasOne(student, {
    as: "userInfo",
    foreignKey: {
      allowNull: true,
      name: "user_id",
    },
    targetKey: "user_id",
  });



  console.log("Models initialized successfully.");
};
