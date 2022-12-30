const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
	// create db if it doesn't already exist
	const { host, port, user, password, database } = config.database;
	const connection = await mysql.createConnection({ host, port, user, password });
	await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

	// connect to db
	const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });
	// init models and add them to the exported db object
	db.Users = require('../models/user.model')(sequelize);
	db.LoginHistory = require('../models/login-history.model')(sequelize);

	db.Users.hasMany(db.LoginHistory, { foreignKey: 'user_id' });

	// sync all models with database
	await sequelize.sync({ alter: true });
}

