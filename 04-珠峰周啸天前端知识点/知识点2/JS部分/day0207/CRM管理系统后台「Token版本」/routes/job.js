const express = require('express'),
	route = express.Router(),
	fs = require('fs').promises,
	path = require('path'),
	pathdb = path.resolve(__dirname, '../database');
const { responsePublic, getJobInfo, filter } = require('../utils');

//=>获取部门列表
route.get('/list', (req, res) => {
	let data = req.$jobDATA;
	data = data.map(item => getJobInfo(item.id, req));
	responsePublic(res, true, { data });
});

//=>获取部门信息
route.get('/info', (req, res) => {
	let { jobId = 0 } = req.query;
	let info = getJobInfo(jobId, req);
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
	let $jobDATA = req.$jobDATA,
		passDATA = null;
	passDATA = Object.assign({
		id: $jobDATA.length === 0 ? 1 : (parseFloat($jobDATA[$jobDATA.length - 1]['id']) + 1),
		name: '',
		desc: '',
		power: '',
		time: new Date().getTime(),
		state: 0
	}, (req.body || {}));
	$jobDATA.push(passDATA);
	try {
		await fs.writeFile(`${pathdb}/job.json`, JSON.stringify($jobDATA), 'utf-8');
		responsePublic(res, true);
	} catch (_) {
		responsePublic(res, false);
	}
});

//=>修改部门信息
route.post('/update', async (req, res) => {
	req.body = req.body || {};
	let $jobDATA = req.$jobDATA,
		jobId = req.body.jobId,
		flag = false;
	delete req.body.jobId;
	$jobDATA = $jobDATA.map(item => {
		if (+item.id === +jobId) {
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
		await fs.writeFile(`${pathdb}/job.json`, JSON.stringify($jobDATA), 'utf-8');
		responsePublic(res, true);
	} catch (_) {
		responsePublic(res, false);
	}
});

//=>删除部门信息
route.get('/delete', async (req, res) => {
	let $jobDATA,
		flag = false;
	let { jobId = 0 } = req.query;
	$jobDATA = filter(await fs.readFile(`${pathdb}/job.json`, 'utf-8'), true);
	$jobDATA = $jobDATA.map(item => {
		if (+item.id === +jobId) {
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
		await fs.writeFile(`${pathdb}/job.json`, JSON.stringify($jobDATA), 'utf-8');
		responsePublic(res, true);
	} catch (_) {
		responsePublic(res, false);
	}
});

module.exports = route;