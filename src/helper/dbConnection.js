import { Sequelize } from "sequelize";

let connection = null;

const connectDB = async () => {
  if (!connection) {
    connection = new Sequelize({
      database: process.env.PGDATABASE,
      host: process.env.PGHOST,
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
      dialect: "postgres",
      pool: {
        max: 5,
        min: 0,
        idle: 20000,
        acquire: 20000,
      },
      logging: false,
    });

    await connection.authenticate();
    console.log("Connected to DB!");
  }

  return connection;
};

export default connectDB;
