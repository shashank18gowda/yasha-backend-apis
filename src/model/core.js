import { initUserModel } from "./users.js";
import { initstudentModel } from "./students.js";
import { initsubjectModel } from "./subjects.js";
import { initgradeModel } from "./grades.js";
import { initschoolModel } from "./schools.js";
import { initinterestModel } from "./interests.js";
import { initLmsVideoModel } from "./lmsVideos.js";
import { initLmsVideoCompletionModel } from "./lmsVideoCompletions.js";
import { initLmsLiveClassModel } from "./lmsLiveClasses.js";
import { initCounselingTypeModel } from "./counselingTypes.js";
import { initCounselingSlotModel } from "./counselingSlots.js";
import { initCounselingBookingModel } from "./counselingBookings.js";

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
  const lmsVideo = initLmsVideoModel(sequelize);
  const lmsVideoCompletion = initLmsVideoCompletionModel(sequelize);
  const lmsLiveClass = initLmsLiveClassModel(sequelize);
  const counselingType = initCounselingTypeModel(sequelize);
  const counselingSlot = initCounselingSlotModel(sequelize);
  const counselingBooking = initCounselingBookingModel(sequelize);

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

  // <--------LMS-SUBJECT-RELATION--------->
  lmsVideo.belongsTo(subject, {
    as: "subjectInfo",
    foreignKey: {
      allowNull: false,
      name: "subject_id",
    },
    targetKey: "subject_id",
  });

  subject.hasMany(lmsVideo, {
    as: "videos",
    foreignKey: {
      allowNull: false,
      name: "subject_id",
    },
    sourceKey: "subject_id",
  });

  lmsLiveClass.belongsTo(subject, {
    as: "subjectInfo",
    foreignKey: {
      allowNull: false,
      name: "subject_id",
    },
    targetKey: "subject_id",
  });

  subject.hasMany(lmsLiveClass, {
    as: "liveClasses",
    foreignKey: {
      allowNull: false,
      name: "subject_id",
    },
    sourceKey: "subject_id",
  });

  // <--------LMS-COMPLETION-RELATION--------->
  lmsVideoCompletion.belongsTo(lmsVideo, {
    as: "videoInfo",
    foreignKey: {
      allowNull: false,
      name: "video_id",
    },
    targetKey: "video_id",
  });

  lmsVideo.hasMany(lmsVideoCompletion, {
    as: "completions",
    foreignKey: {
      allowNull: false,
      name: "video_id",
    },
    sourceKey: "video_id",
  });

  lmsVideoCompletion.belongsTo(student, {
    as: "studentInfo",
    foreignKey: {
      allowNull: false,
      name: "student_id",
    },
    targetKey: "student_id",
  });

  student.hasMany(lmsVideoCompletion, {
    as: "videoCompletions",
    foreignKey: {
      allowNull: false,
      name: "student_id",
    },
    sourceKey: "student_id",
  });

  // <--------COUNSELING-RELATION--------->
  counselingSlot.belongsTo(user, {
    as: "trainerInfo",
    foreignKey: {
      allowNull: false,
      name: "trainer_id",
    },
    targetKey: "user_id",
  });

  user.hasMany(counselingSlot, {
    as: "counselingSlots",
    foreignKey: {
      allowNull: false,
      name: "trainer_id",
    },
    sourceKey: "user_id",
  });

  counselingBooking.belongsTo(counselingSlot, {
    as: "slotInfo",
    foreignKey: {
      allowNull: false,
      name: "counseling_slot_id",
    },
    targetKey: "counseling_slot_id",
  });

  counselingSlot.hasOne(counselingBooking, {
    as: "bookingInfo",
    foreignKey: {
      allowNull: false,
      name: "counseling_slot_id",
    },
    sourceKey: "counseling_slot_id",
  });

  counselingBooking.belongsTo(counselingType, {
    as: "counselingTypeInfo",
    foreignKey: {
      allowNull: false,
      name: "counseling_type_id",
    },
    targetKey: "counseling_type_id",
  });

  counselingType.hasMany(counselingBooking, {
    as: "bookings",
    foreignKey: {
      allowNull: false,
      name: "counseling_type_id",
    },
    sourceKey: "counseling_type_id",
  });

  counselingBooking.belongsTo(user, {
    as: "bookedBy",
    foreignKey: {
      allowNull: false,
      name: "booked_by",
    },
    targetKey: "user_id",
  });

  user.hasMany(counselingBooking, {
    as: "counselingBookings",
    foreignKey: {
      allowNull: false,
      name: "booked_by",
    },
    sourceKey: "user_id",
  });

  console.log("Models initialized successfully.");
};
