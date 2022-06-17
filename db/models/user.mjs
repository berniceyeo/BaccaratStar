export default function initUserModel(sequelize, DataTypes) {
  return sequelize.define(
    "user",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      username: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      room_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "rooms",
          id: "id",
        },
      },
      chips_bought: {
        type: DataTypes.INTEGER,
      },
      chips_: {
        type: DataTypes.INTEGER,
      },
      banker: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      seat_id: {
        type: DataTypes.INTEGER,
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
