const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
	const attributes = {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
		login_time: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
		logout_time: { type: DataTypes.DATE, allowNull: true },
		ip: { type: DataTypes.STRING, allowNull: false },
	};

	const options = {
		timestamps: false,
		createdAt: false,
		updatedAt: false,
	};


	return sequelize.define('login_history', attributes, options);
}
