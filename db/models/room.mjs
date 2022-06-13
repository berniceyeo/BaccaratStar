export default function initRoomModel(sequelize, DataTypes) {
  return sequelize.define("room", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    banker_id: {
      type: DataTypes.INTEGER,
    },
    game_state: {
      type: DataTypes.JSON,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });
}
