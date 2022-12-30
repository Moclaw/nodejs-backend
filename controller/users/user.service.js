const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('context/dbcontext');

module.exports = {
	login,
	getAll,
	getById,
	create,
	update,
	delete: _delete
};

async function login({ user_name, password }, req) {
	const user = await db.Users.scope('withHash').findOne({ where: { user_name } });

	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	const login_time = new Date();

	// create login history

	if (!user || !(await bcrypt.compare(password, user.password)))
		throw 'Username or password is incorrect';

	await db.LoginHistory.create({ user_id: user.id, login_time, ip });
	// authentication successful
	const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
	return { ...omitHash(user.get()), token };
}

async function getAll() {
	return await db.Users.findAll();
}

async function getById(id) {
	return await getUser(id);
}

async function create(params) {
	// validate
	if (await db.Users.findOne({ where: { user_name: params.user_name } })) {
		throw 'Username "' + params.user_name + '" is already taken';
	}
	params.password = await bcrypt.hash(params.password, 10);

	console.log(params.password);
	// save user
	await db.Users.create(params);
}

async function update(id, params) {
	const user = await getUser(id);

	// validate
	const usernameChanged = params.username && user.username !== params.username;
	if (usernameChanged && await db.Users.findOne({ where: { username: params.username } })) {
		throw 'Username "' + params.username + '" is already taken';
	}

	// hash password if it was entered
	if (params.password) {
		params.hash = await bcrypt.hash(params.password, 10);
	}

	// copy params to user and save
	Object.assign(user, params);
	await user.save();

	return omitHash(user.get());
}

async function _delete(id) {
	const user = await getUser(id);
	await user.destroy();
}

// helper functions

async function getUser(id) {
	const user = await db.Users.findByPk(id);
	if (!user) throw 'Users not found';
	return user;
}

function omitHash(user) {
	const { hash, ...userWithoutHash } = user;
	return userWithoutHash;
}