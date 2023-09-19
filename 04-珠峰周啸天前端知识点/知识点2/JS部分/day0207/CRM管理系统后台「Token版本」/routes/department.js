const express = require('express'),
	route = express.Router(),
	fs = require('fs').promises,
	path = require('path'),
	pathdb = path.resolve(__dirname, '../database');
const { responsePublic, getDepartInfo, filter } = require('../utils');

//=>获取部门列表
route.get('/list', (req, res) => {
	let data = req.$departmentDATA;
	data = data.map(item => getDepartInfo(item.id, req));
	responsePublic(res, true, { data });
});

//=>获取部门信息
route.get('/info', (req, res) => {
	let { departmentId = 0 } = req.query;
	let info = getDepartInfo(departmentId, req);
	if ('name' in info) {
		responsePublic(res, true, { info });
		return;
	}
	responsePublic(res, false, {
		codeText: 'no matching data was found!'
	});
});

//=>增加新部门
route.post('/add', async (req, res) => {
	let $departmentDATA = req.$departmentDATA,
		passDATA = null;
	passDATA = Object.assign({
		id: $departmentDATA.length === 0 ? 1 : (parseFloat($departmentDATA[$departmentDATA.length - 1]['id']) + 1),
		name: '',
		desc: '',
		time: new Date().getTime(),
		state: 0
	}, (req.body || {}));
	$departmentDATA.push(passDATA);
	try {
		await fs.writeFile(`${pathdb}/department.json`, JSON.stringify($departmentDATA), 'utf-8');
		responsePublic(res, true);
	} catch (_) {
		responsePublic(res, false);
	}
});

//=>修改部门信息
route.post('/update', async (req, res) => {
	req.body = req.body || {};
	let $departmentDATA = req.$departmentDATA,
		departmentId = req.body.departmentId,
		flag = false;
	delete req.body.departmentId;
	$departmentDATA = $departmentDATA.map(item => {
		if (+item.id === +departmentId) {
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
		await fs.writeFile(`${pathdb}/department.json`, JSON.stringify($departmentDATA), 'utf-8');
		responsePublic(res, true);
	} catch (_) {
		responsePublic(res, false);
	}
});

//=>删除部门信息
route.get('/delete', async (req, res) => {
	let $departmentDATA,
		flag = false;
	let { departmentId = 0 } = req.query;
	$departmentDATA = filter(await fs.readFile(`${pathdb}/department.json`, 'utf-8'), true);
	$departmentDATA = $departmentDATA.map(item => {
		if (+item.id === +departmentId) {
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
		await fs.writeFile(`${pathdb}/department.json`, JSON.stringify($departmentDATA), 'utf-8');
		responsePublic(res, true);
	} catch (_) {
		responsePublic(res, false);
	}
});

module.exports = route;