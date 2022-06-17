import sequelizePackage, { BelongsToMany } from "sequelize";
import allConfig from "../../sequelize.config.cjs";

// importing models
import initUserModel from "./user.mjs";
import initRoomModel from "./room.mjs";

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

//------------------------------------------------------------------
//                            Relationships
//------------------------------------------------------------------

//1-M relationships: User can only exist in one room, but one room can have many users
db.Room.hasMany(db.User);
db.User.belongsTo(db.Room);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
