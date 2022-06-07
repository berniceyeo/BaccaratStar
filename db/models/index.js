import sequelizePackage from "sequelize";
import allConfig from "../../sequelize.config.cjs";

// importing models
import initUserModel from "./user.mjs";

const { Sequelize } = sequelizePackage;
const env = process.env.NODE_ENV || "development";
const config = allConfig[env];
const db = {};

//initialise a new instance of sequelize
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.User = initUserModel(sequelize, Sequelize.DataTypes);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
