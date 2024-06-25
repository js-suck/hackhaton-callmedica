const sequelize = require("../db/sequelize");
const { DataTypes, ENUM } = require("sequelize");

const UserReports = sequelize.define(
    "UserReports",
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
        typeOfReport: {
            type: ENUM("possibleDiseases", "discoveredDisease", "medicalHistory", "currentTreatment", "remark"),
            allowNull: false,
        },
        report: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        isGenerateByAI: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
    }
);

UserReports.sync({ force: false })
    .then(() => {
        console.log("'UserReports' model has been synchronized with the database.");
    })
    .catch((error) => {
        console.error("Unable to synchronize 'UserReports' model with the database:", error);
    });

module.exports = UserReports;
