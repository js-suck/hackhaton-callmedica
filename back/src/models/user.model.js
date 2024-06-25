const sequelize = require("../db/sequelize");
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true,
            },
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        birthDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        currentAddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        freezeTableName: true,
    }
);

User.prototype.validPassword = async function (password) {
    return await bcrypt.compareSync(password, this.password);
};

User.sync({ force: false })
    .then(() => {
        console.log("'User' model has been synchronized with the database.");
    })
    .catch((error) => {
        console.error("Unable to synchronize 'User' model with the database:", error);
    });

module.exports = User;
