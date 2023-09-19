const express = require('express'),
	route = express.Router(),
	fs = require('fs').promises,
	path = require('path'),
	pathdb = path.resolve(__dirname, '../database');
const { Token, handleMD5, filter, responsePublic, getUserInfo } = require('../utils');

//=>用户登录
route.post('/login', (req, res) => {
	let { account = '', password = '' } = req.body || {};
	password = handleMD5(password);
	const item = req.$userDATA.find(item => {
		return (item.name === account || item.email === account || item.phone === account) && item.password === password;
	});
	if (item) {
		let info = getUserInfo(item.id, req);
		let token = Token.sign({
			id: info.id,
			name: info.name,
			power: info.power
		});
		responsePublic(res, true, {
			token,
			info
		});
		return;
	}
	responsePublic(res, false, {
		codeText: 'user name password mismatch!'
	});
});

//=>检测是否登录
route.get('/login', (req, res) => {
	let userId = req.$TOKEN.id;
	responsePublic(res, true, {
		info: getUserInfo(userId, req)
	});
});

//=>获取用户通讯录
route.get('/list', (req, res) => {
	let data = req.$userDATA;
	let { departmentId = 0, search = '' } = req.query;
	if (+departmentId !== 0) data = data.filter(item => +item.departmentId === +departmentId);
	if (search !== '') data = data.filter(item => (item.name.includes(search) || item.phone.includes(search) || item.email.includes(search)));
	data = data.map(item => getUserInfo(item.id, req));
	responsePublic(res, true, {
		data
	});
});

//=>获取用户详细信息
route.get('/info', (req, res) => {
	let { userId = req.$TOKEN.id } = req.query;
	let info = getUserInfo(userId, req);
	if ('name' in info) {
		responsePublic(res, true, {
			info
		});
		return;
	}
	responsePublic(res, false, {
		codeText: 'no matching data was found!'
	});
});

//=>增加用户信息
route.post('/add', async (req, res) => {
	let $userDATA = req.$userDATA,
		passDATA = null;
	passDATA = Object.assign({
		id: $userDATA.length === 0 ? 1 : (parseFloat($userDATA[$userDATA.length - 1]['id']) + 1),
		name: '',
		password: handleMD5('e807f1fcf82d132f9bb018ca6738a19f'),
		sex: 0,
		email: '',
		phone: '',
		departmentId: 1,
		jobId: 1,
		desc: '',
		time: new Date().getTime(),
		state: 0
	}, (req.body || {}));
	$userDATA.push(passDATA);
	try {
		await fs.writeFile(`${pathdb}/user.json`, JSON.stringify($userDATA), 'utf-8');
		responsePublic(res, true);
	} catch (_) {
		responsePublic(res, false);
	}
});

//=>修改用户信息
route.post('/update', async (req, res) => {
	req.body = req.body || {};
	let $userDATA = req.$userDATA,
		userId = req.body.userId,
		flag = false;
	delete req.body.userId;
	$userDATA = $userDATA.map(item => {
		if (+item.id === +userId) {
			flag = true;
			return {
				...item,
				...req.body
			};
		}
		return item;
	});
	if (!flag) {
		responsePublic(res, false);
		return;
	}
	try {
		await fs.writeFile(`${pathdb}/user.json`, JSON.stringify($userDATA), 'utf-8');
		responsePublic(res, true);
	} catch (_) {
		responsePublic(res, false);
	}
});

//=>删除用户信息
route.get('/delete', async (req, res) => {
	let $userDATA,
		flag = false;
	let { userId = 0 } = req.query;
	$userDATA = filter(await fs.readFile(`${pathdb}/user.json`, 'utf-8'), true);
	$userDATA = $userDATA.map(item => {
		if (+item.id === +userId) {
			flag = true;
			return {
				...item,
				state: 1
			};
		}
		return item;
	});
	if (!flag) {
		responsePublic(res, false);
		return;
	}
	try {
		await fs.writeFile(`${pathdb}/user.json`, JSON.stringify($userDATA), 'utf-8');
		responsePublic(res, true);
	} catch (_) {
		responsePublic(res, false);
	}
});

//=>修改（重置）用户密码
route.post('/resetpassword', async (req, res) => {
	let $userDATA = req.$userDATA;
	let { userId = 0, password } = req.body;
	if (+userId === 0) {
		userId = req.$TOKEN.id;
		password = handleMD5(password);
	} else {
		password = handleMD5('e807f1fcf82d132f9bb018ca6738a19f');
	}
	$userDATA = $userDATA.map(item => {
		if (+item.id === +userId) {
			return {
				...item,
				password
			};
		}
		return item;
	});
	try {
		await fs.writeFile(`${pathdb}/user.json`, JSON.stringify($userDATA), 'utf-8');
		responsePublic(res, true);
	} catch (_) {
		responsePublic(res, false);
	}
});

module.exports = route;