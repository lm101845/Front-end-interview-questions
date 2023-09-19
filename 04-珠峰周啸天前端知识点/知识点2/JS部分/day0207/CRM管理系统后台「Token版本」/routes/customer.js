const express = require('express'),
	route = express.Router(),
	fs = require('fs').promises,
	path = require('path'),
	pathdb = path.resolve(__dirname, '../database');
const { responsePublic, getCustomerInfo, getUserInfo, filter } = require('../utils');

//=>增加客户信息
route.post('/add', async (req, res) => {
	let $customerDATA = req.$customerDATA,
		passDATA = null,
		userId = req.$TOKEN.id;
	passDATA = Object.assign({
		id: $customerDATA.length === 0 ? 1 : (parseFloat($customerDATA[$customerDATA.length - 1]['id']) + 1),
		name: '',
		sex: 0,
		email: '',
		phone: '',
		QQ: '',
		weixin: '',
		type: '重点客户',
		address: "",
		userId,
		departmentId: getUserInfo(userId, req).departmentId,
		time: new Date().getTime(),
		state: 0
	}, (req.body || {}));
	$customerDATA.push(passDATA);
	try {
		await fs.writeFile(`${pathdb}/customer.json`, JSON.stringify($customerDATA), 'utf-8');
		responsePublic(res, true);
	} catch (_) {
		responsePublic(res, false);
	}
});

//=>修改客户信息
route.post('/update', async (req, res) => {
	req.body = req.body || {};
	let $customerDATA = req.$customerDATA,
		customerId = req.body.customerId,
		flag = false;
	delete req.body.customerId;
	$customerDATA = $customerDATA.map(item => {
		if (+item.id === +customerId) {
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
		await fs.writeFile(`${pathdb}/customer.json`, JSON.stringify($customerDATA), 'utf-8');
		responsePublic(res, true);
	} catch (_) {
		responsePublic(res, false);
	}
});

//=>删除客户信息
route.get('/delete', async (req, res) => {
	let $customerDATA,
		flag = false;
	let { customerId = 0 } = req.query;
	$customerDATA = filter(await fs.readFile(`${pathdb}/customer.json`, 'utf-8'), true);
	$customerDATA = $customerDATA.map(item => {
		if (+item.id === +customerId) {
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
		await fs.writeFile(`${pathdb}/customer.json`, JSON.stringify($customerDATA), 'utf-8');
		responsePublic(res, true);
	} catch (_) {
		responsePublic(res, false);
	}
});

//=>获取客户详细信息
route.get('/info', (req, res) => {
	let { customerId = 0 } = req.query;
	let info = getCustomerInfo(customerId, req);
	if ('name' in info) {
		responsePublic(res, true, { info });
		return;
	}
	responsePublic(res, false, {
		codeText: 'no matching data was found!'
	});
});

//=>获取客户列表信息
route.get('/list', (req, res) => {
	let data = req.$customerDATA;
	let { type = '', search = '', lx = 'all' } = req.query;
	//筛选处理
	if (search !== '') data = data.filter(item => (item.name.includes(search) || item.phone.includes(search) || item.email.includes(search) || item.QQ.includes(search) || item.weixin.includes(search)));
	if (type !== '') data = data.filter(item => item.type === type);
	//权限校验
	let power = req.$TOKEN.power,
		userId = req.$TOKEN.id;
	if (lx === 'my' || (lx === 'all' && !power.includes('customerall'))) {
		data = data.filter(item => +item.userId === +userId);
	}
	//分页处理
	let { limit = 10, page = 1 } = req.query;
	let totalPage = Math.ceil(data.length / limit),
		total = data.length,
		result = [];
	if (page <= totalPage) {
		for (let i = (page - 1) * limit; i <= (page * limit - 1); i++) {
			let item = data[i];
			if (!item) break;
			result.push(getCustomerInfo(item.id, req));
		}
	}
	responsePublic(res, true, {
		page: page,
		limit: limit,
		total: total,
		totalPage: totalPage,
		data: result
	});
});

module.exports = route;