const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
	const attributes = {
		first_name: { type: DataTypes.STRING, allowNull: true },
		last_name: { type: DataTypes.STRING, allowNull: true },
		user_name: { type: DataTypes.STRING, allowNull: false },
		password: { type: DataTypes.STRING, allowNull: false },
		email: { type: DataTypes.STRING, allowNull: true },
		phone: { type: DataTypes.STRING, allowNull: true },
		role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'user' },
		deleted_at: { type: DataTypes.DATE, allowNull: true },
		created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
	};

	const options = {
		defaultScope: {
			// exclude hash by default
			attributes: { exclude: ['hash'] }
		},
		scopes: {
			// include hash with this scope
			withHash: { attributes: {}, }
		},
		timestamps: false,
		createdAt: false,
		updatedAt: false,
	};

	return sequelize.define('users', attributes, options);
}