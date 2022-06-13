import sequelizePackage from "sequelize";
import allConfig from "../../sequelize.config.cjs";

// importing models
import initUserModel from "./user.mjs";
import initRoomModel from "./room.mjs";
import initUserRoomModel from "./user_room.mjs";

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
db.Room = initRoomModel(sequelize, Sequelize.DataTypes);
db.UserRoom = initUserRoomModel(sequelize, Sequelize.DataTypes);

//---------------------------------
//             Relationships
//--------------------------------

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
