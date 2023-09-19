const express = require('express'),
    route = express.Router();
function urlParams(str) {
    // 如果str中没有问号，索引1拿不到值，用或者''容错
    let params = str.split('?')[1] || '',
        obj = {};
    params.split('&').forEach(item => {
        let ary = item.split('=');
        obj[ary[0]] = ary[1];
    });
    return obj;
}
route.get('/swiper', (req, res) => {
    res.send([
        {
            img: 'http://zhihudaily.me/static/img/pic/20210503/9735624.jpg',
            title: '中国有哪些非常唯美漂亮的桥梁？',
            author: '星球研究所',
            id: 9735624,
        },
        {
            img: 'http://zhihudaily.me/static/img/pic/20210504/9735691.jpg',
            title: '什么是当代艺术，如何欣赏当代艺术？',
            author: '了不起的苏小姐',
            id: 9735691,
        },
        {
            img: 'http://zhihudaily.me/static/img/pic/20210506/9735653.jpg',
            title: '肥肠那么脏，为什么却那么好吃',
            author: '魏水华',
            id: 9735653,
        },
        {
            img: 'http://zhihudaily.me/static/img/pic/20210510/9735837.jpg',
            title: '为什么尸体的牙齿那么坚固，活人却会蛀牙？',
            author: '灰吱吱',
            id: 9735837,
        },
        {
            img: 'http://zhihudaily.me/static/img/pic/20210510/9735864.jpg',
            title: '演员到底有多吃天赋',
            author: 'Zpuzzle',
            id: 9735864,
        },
    ]);
});
route.get('/articleList', (req, res) => {
    let articleList = {
        '2021-05-20': [
            {
                img: 'http://zhihudaily.me/static/img/pic/20210519/9736141.jpg',
                title: '公司严重缺人几乎要乱套了，为什么老板招聘条件还那么苛刻',
                author: '小红拖拉机',
                des: 4,
                id: 9736141,
            },
            {
                img: 'http://zhihudaily.me/static/img/pic/20210519/9736137.jpg',
                title: '未来20年，中国航天事业将会迎来哪些关键的技术节点？',
                author: '知乎用户',
                des: 4,
                id: 9736137,
            },
            {
                img: 'http://zhihudaily.me/static/img/pic/20210519/9736128.jpg',
                title: '哪些科技的发展解决了医疗上的大问题？',
                author: '极萨学院冷哲',
                des: 5,
                id: 9736128,
            },
            {
                img: 'http://zhihudaily.me/static/img/pic/20210519/9736142.jpg',
                title: '如何评论贾樟柯导演及其作品',
                author: '小吕同学',
                des: 6,
                id: 9736142,
            },
            {
                img: 'http://zhihudaily.me/static/img/pic/20210519/9736127.jpg',
                title: '14岁前安防一个定时炸弹，14岁后爆炸，构成犯罪吗？',
                author: '曾杰律师',
                des: 1,
                id: 9736127,
            },
        ],
        '2021-05-19': [
            {
                img: 'http://zhihudaily.me/static/img/pic/20210519/9736141.jpg',
                title: '猫在古代的别称除了狸奴还有哪些？',
                author: '地平线HOA',
                des: 4,
                id: 9736141,
            },
            {
                img: 'http://zhihudaily.me/static/img/pic/20210519/9736137.jpg',
                title: '目前为止，中国科技发展可提速的方向有哪些？',
                author: '温戈',
                des: 4,
                id: 9736137,
            },
            {
                img: 'http://zhihudaily.me/static/img/pic/20210519/9736128.jpg',
                title: '有哪些天文研究成果已经改变了我们的生活？',
                author: 'Pjer',
                des: 4,
                id: 9736137,
            },
            {
                img: 'http://zhihudaily.me/static/img/pic/20210519/9736142.jpg',
                title: '如何评论王家卫',
                author: '唐朝',
                des: 5,
                id: 9736137,
            },
            {
                img: 'http://zhihudaily.me/static/img/pic/20210519/9736127.jpg',
                title: '《我的世界》生存模式怎么玩？',
                author: '程安',
                des: 2,
                id: 9736137,
            },
        ],
        '2021-05-18': [
            {
                img: 'http://www.zhihudaily.me/static/img/pic/20210518/9736106.jpg',
                title: '怎样鉴别野生的蘑菇是否有毒',
                author: '中国科普博览',
                des: 3,
                id: 9736137,
            },
            {
                img: 'http://www.zhihudaily.me/static/img/pic/20210518/9736102.jpg',
                title: '有哪些比较好的收纳方法和工具',
                author: '小丫小叮当',
                des: 3,
                id: 9736137,
            },
            {
                img: 'http://www.zhihudaily.me/static/img/pic/20210518/9736118.jpg',
                title: '有哪些常人不知道的“常识”',
                author: '知乎用户',
                des: 3,
                id: 9736137,
            },
            {
                img: 'http://www.zhihudaily.me/static/img/pic/20210518/9736109.jpg',
                title: '苏伊士运河是怎么挖的',
                author: '伊卡鲁斯二号',
                des: 1,
                id: 9736137,
            },
        ],
        '2021-05-17': [
            {
                img: 'http://www.zhihudaily.me/static/img/pic/20210516/9736057.jpg',
                title: '电影太深刻，观众看不出来，这样创作意义大吗？',
                author: 'segelas',
                des: 9,
                id: 9736137,
            },
            {
                img: 'http://www.zhihudaily.me/static/img/pic/20210516/9736078.jpg',
                title: '粪便可以用来治病吗',
                author: '元宿six',
                des: 2,
                id: 9736137,
            },
            {
                img: 'http://www.zhihudaily.me/static/img/pic/20210518/9736118.jpg',
                title: '为什么后宫中的嫔妃们一定要争宠',
                author: '莱茵行宫伯爵',
                des: 8,
                id: 9736137,
            },
            {
                img: 'http://www.zhihudaily.me/static/img/pic/20210518/9736109.jpg',
                title: '如何形容中东地区的音乐风格？',
                author: '男爵兔',
                des: 5,
                id: 9736137,
            },
        ],
    };
    let query = urlParams(req.url);
    res.send(articleList[query.date] || articleList['2021-05-17']);
});
route.get('/article', (req, res) => {
    let articleContent = {
        9736137: {
            img: 'http://www.zhihudaily.me/static/img/pic/20210518/9736106.jpg',
            title: '怎样鉴别野生的蘑菇是否有毒',
            author: '中国科普博览',
            id: 9736137,
            content: [
                {
                    type: 'text',
                    text: '<strong>不知道能不能吃就别吃！千万别吃！要知道，有些蘑菇，试试就逝世……目前为止，还没有一种判断蘑菇是否可食用的、全能的检测方法。</strong>',
                },
                {
                    type: 'text',
                    text: '由于野生菌极大的辨识难度，即便是世代采菌人，也有“翻车”的可能。采菇不慎，误食毒菌，轻则上吐下泻产生幻觉，重则肝肾损伤横纹肌溶解导致死亡。',
                },
                {
                    type: 'text',
                    text: '但在所有的蘑菇中毒死亡案例中，近百分之九十的罪魁祸首都是它——<strong>剧毒鹅膏菌。</strong>',
                },
                {
                    type: 'img',
                    img: 'https://pic2.zhimg.com/v2-b1b1da675bcc7e22834250d0822b2545_720w.jpg?source=8673f162',
                    des: '毒蝇鹅膏菌（Amanita muscaria）是很多童话故事中蘑菇的原型。（图片来源：作者自制）',
                },
                {
                    type: 'text',
                    text: '<strong>不是所有的鹅膏菌都是好鹅膏菌</strong>',
                },
                {
                    type: 'text',
                    text: '每个人心中应该都有一朵超级马里奥吃完会长大的蘑菇——头顶红色帽子、身披白色斑点。<strong>它叫毒蝇鹅膏菌，是温带最常见的鹅膏菌；其活性成分主要是蝇蕈素和鹅膏蕈氨酸，这两者不仅有毒，而且具有致幻作用（据记载该物种曾作为宗教典礼上的致幻剂使用）</strong>。',
                },
                {
                    type: 'img',
                    img: 'https://pic4.zhimg.com/v2-0dc1d529c7016650391e8fa6bda12f4a_720w.jpg?source=8673f162',
                    des: '超级马里奥中蘑菇的原型为毒蝇鹅膏菌，图片来源：超级马里奥游戏截图',
                },
                {
                    type: 'text',
                    text: '最后，送大家一句食菌者的口头禅：',
                },
                {
                    type: 'text',
                    text: '<strong>所有的蘑菇都是可以吃的，但是有些蘑菇，一辈子只能吃一次！</strong>',
                },
                {
                    type: 'text',
                    text: '<strong>参考文献</strong>',
                },{
                    type:'text',
                    text:'<em>[1] </em><em>云南常见野生食用菌名录</em>'
                },{
                    type:'text',
                    text:"<em>[2] </em><em>Haijiao Li, Hongshun Zhang, Yizhe Zhang, Kaiping Zhang, Jing Zhou, Yu Yin, et al. Mushroom Poisoning Outbreaks — China, 2019[J]. China CDC Weekly, 2020, 2(2): 19-24.Jeffery Brent, Robert B. Palmer, Haddad and Winchester's Clinical Management of Poisoning and Drug Overdose (Fourth Edition), 2007.</em>"
                }
            ],
        },
    };
    let query = urlParams(req.url);
    res.send(articleContent[query.id] || articleContent[9736137]);
});
route.use('/test', (req, res) => {
    console.log(req.body);
    res.send({code:1,tip:'success'})
});

module.exports = route;
