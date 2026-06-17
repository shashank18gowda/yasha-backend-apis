import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { DataTypes } from "sequelize";
import connectDB from "../src/helper/dbConnection.js";

dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, "../migrations");
const metaTable = "SequelizeMeta";

const ensureMetaTable = async (queryInterface) => {
  const tables = await queryInterface.showAllTables();
  const tableNames = tables.map((table) =>
    typeof table === "string" ? table : table.tableName,
  );

  if (tableNames.includes(metaTable)) return;

  await queryInterface.createTable(metaTable, {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  });
};

const getMigrationFiles = async () => {
  const files = await fs.readdir(migrationsDir);

  return files.filter((file) => file.endsWith(".js")).sort();
};

const getAppliedMigrations = async (sequelize) => {
  const [rows] = await sequelize.query(`SELECT name FROM "${metaTable}"`);

  return rows.map((row) => row.name);
};

const markMigrationApplied = async (sequelize, name, transaction) => {
  await sequelize.query(`INSERT INTO "${metaTable}" (name) VALUES (:name)`, {
    replacements: { name },
    transaction,
  });
};

const removeMigrationRecord = async (sequelize, name, transaction) => {
  await sequelize.query(`DELETE FROM "${metaTable}" WHERE name = :name`, {
    replacements: { name },
    transaction,
  });
};

const runUp = async (sequelize, queryInterface) => {
  const files = await getMigrationFiles();
  const applied = await getAppliedMigrations(sequelize);
  const pending = files.filter((file) => !applied.includes(file));

  if (pending.length === 0) {
    console.log("No pending migrations.");
    return;
  }

  for (const file of pending) {
    const migration = await import(pathToFileURL(path.join(migrationsDir, file)));

    await sequelize.transaction(async (transaction) => {
      await migration.up(queryInterface, DataTypes, transaction);
      await markMigrationApplied(sequelize, file, transaction);
    });

    console.log(`Applied migration: ${file}`);
  }
};

const runDown = async (sequelize, queryInterface) => {
  const applied = await getAppliedMigrations(sequelize);
  const lastMigration = applied.sort().at(-1);

  if (!lastMigration) {
    console.log("No migrations to undo.");
    return;
  }

  const migration = await import(
    pathToFileURL(path.join(migrationsDir, lastMigration))
  );

  await sequelize.transaction(async (transaction) => {
    await migration.down(queryInterface, DataTypes, transaction);
    await removeMigrationRecord(sequelize, lastMigration, transaction);
  });

  console.log(`Undid migration: ${lastMigration}`);
};

const run = async () => {
  const direction = process.argv[2] || "up";
  const sequelize = await connectDB();
  const queryInterface = sequelize.getQueryInterface();

  await ensureMetaTable(queryInterface);

  if (direction === "up") {
    await runUp(sequelize, queryInterface);
  } else if (direction === "down") {
    await runDown(sequelize, queryInterface);
  } else {
    throw new Error("Use 'up' or 'down'. Example: npm run migrate");
  }

  await sequelize.close();
};

run().catch(async (err) => {
  console.log("Migration failed:", err.message);
  process.exit(1);
});
