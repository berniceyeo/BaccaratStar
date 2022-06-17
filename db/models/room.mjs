export default function initRoomModel(sequelize, DataTypes) {
  return sequelize.define(
    "room",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.INTEGER,
        validate: { unique: true },
      },
      password: {
        type: DataTypes.STRING,
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
    },
    {
      underscored: true,
    }
  );
}
