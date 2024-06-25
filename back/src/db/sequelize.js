const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.json')[env];
console.log(config.database, config.username, config.password, config)
const sequelize = new Sequelize(config.database, config.username, config.password, config)

sequelize.authenticate()
    .then(() => console.log("Connected to database"))
    .catch((err) => console.log(err));


module.exports = sequelize;