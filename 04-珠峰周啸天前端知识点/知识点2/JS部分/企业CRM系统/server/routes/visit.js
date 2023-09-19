const express = require('express'),
	route = express.Router(),
	fs = require('fs').promises,
	path = require('path'),
	pathdb = path.resolve(__dirname, '../database');
const { responsePublic, getVisitInfo, filter } = require('../utils');

//=>获取回访列表
route.get('/list', (req, res) => {
	let data = req.$visitDATA,
		{ customerId = 0 } = req.query;
	data = data.filter(item => +item.customerId === +customerId);
	data = data.map(item => getVisitInfo(item.id, req));
	responsePublic(res, true, { data });
});

//=>获取回访信息
route.get('/info', (req, res) => {
	let { visitId = 0 } = req.query;
	let info = getVisitInfo(visitId, req);
	if ('id' in info) {
		responsePublic(res, true, { info });
		return;
	}
	responsePublic(res, false, {
		codeText: 'no matching data was found!'
	});
});

//=>增加新回访
route.post('/add', async (req, res) => {
	let $visitDATA = req.$visitDATA,
		passDATA = null;
	passDATA = Object.assign({
		id: $visitDATA.length === 0 ? 1 : (parseFloat($visitDATA[$visitDATA.length - 1]['id']) + 1),
		customerId: '',
		visitText: '',
		visitTime: '',
		time: new Date().getTime(),
		state: 0
	}, (req.body || {}));
	$visitDATA.push(passDATA);
	try {
		await fs.writeFile(`${pathdb}/visit.json`, JSON.stringify($visitDATA), 'utf-8');
		responsePublic(res, true);
	} catch (_) {
		responsePublic(res, false);
	}
});

//=>修改回访信息
route.post('/update', async (req, res) => {
	req.body = req.body || {};
	let $visitDATA = req.$visitDATA,
		visitId = req.body.visitId,
		flag = false;
	delete req.body.visitId;
	$visitDATA = $visitDATA.map(item => {
		if (+item.id === +visitId) {
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
		await fs.writeFile(`${pathdb}/visit.json`, JSON.stringify($visitDATA), 'utf-8');
		responsePublic(res, true);
	} catch (_) {
		responsePublic(res, false);
	}
});

//=>删除回访信息
route.get('/delete', async (req, res) => {
	let $visitDATA,
		flag = false;
	let { visitId = 0 } = req.query;
	$visitDATA = filter(await fs.readFile(`${pathdb}/visit.json`, 'utf-8'), true);
	$visitDATA = $visitDATA.map(item => {
		if (+item.id === +visitId) {
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
		await fs.writeFile(`${pathdb}/visit.json`, JSON.stringify($visitDATA), 'utf-8');
		responsePublic(res, true);
	} catch (_) {
		responsePublic(res, false);
	}
});

module.exports = route;