const sequelize = require("../db/sequelize");
const { DataTypes, ENUM } = require("sequelize");

const UserTranscriptions = sequelize.define(
    "UserTranscriptions",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        text: {
            type: DataTypes.JSON,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
    }
);

UserTranscriptions.sync({ force: false })
    .then(() => {
        console.log("'UserTranscriptions' model has been synchronized with the database.");
    })
    .catch((error) => {
        console.error("Unable to synchronize 'UserTranscriptions' model with the database:", error);
    });

module.exports = UserTranscriptions;
