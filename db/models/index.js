import { Sequelize } from "sequelize";
import allConfig from "../../sequelize.config.cjs";
import url from "url";

// importing models
import initUserModel from "./user.mjs";
import initRoomModel from "./room.mjs";

const env = process.env.NODE_ENV || "development";
const config = allConfig[env];
const db = {};
let sequelize;

if (env === "production") {
  // Break apart the Heroku database url and rebuild the configs we need
  const { DATABASE_URL } = process.env;
  const dbUrl = url.parse(DATABASE_URL);
  const username = dbUrl.auth.substr(0, dbUrl.auth.indexOf(":"));
  const password = dbUrl.auth.substr(
    dbUrl.auth.indexOf(":") + 1,
    dbUrl.auth.length
  );
  const dbName = dbUrl.path.slice(1);
  const host = dbUrl.hostname;
  const { port } = dbUrl;
  config.host = host;
  config.port = port;
  sequelize = new Sequelize(dbName, username, password, config);
} else {
  //initialise a new instance of sequelize
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

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
