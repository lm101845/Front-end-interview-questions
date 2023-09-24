const express = require('express'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    multiparty = require('multiparty'),
    SparkMD5 = require('spark-md5');
    //multiparty插件用于上传文件到服务器
//Spark-md5是一个用JavaScript编写的快速、高效的md5库。
//它根据MD5算法，将输入的任意长度的明文，经过一系列的操作，转换成一个128位（16字节）的密文。

/*-CREATE SERVER-*/
const app = express(),
    PORT = 8888,
    HOST = 'http://127.0.0.1',
    HOSTNAME = `${HOST}:${PORT}`;
app.listen(PORT, () => {
    console.log(`THE WEB SERVICE IS CREATED SUCCESSFULLY AND IS LISTENING TO THE PORT：${PORT}，YOU CAN VISIT：${HOSTNAME}`);
});

/*-中间件-允许任何客户端都可以向我发送请求：允许跨域*/
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    //Access-Control-Allow-Origin是响应头的一部分，而不是请求头的一部分。它用于指示服务器哪些站点可以访问此资源。
    req.method === 'OPTIONS' ? res.send('CURRENT SERVICES SUPPORT CROSS DOMAIN REQUESTS!') : next();
});

app.use(bodyParser.urlencoded({
    extended: false,
    limit: '1024mb'
}));
/**
 * 这段代码是在使用Node.js的Express框架。app.use(bodyParser.urlencoded({ extended: false, limit: '1024mb' }));
 * 是设置Express的中间件，用于解析从客户端发送到服务器的URL编码的请求体。
 *
 * 在这个配置中，extended: false表示使用严格的URL编码解析，这不会解析请求体中的嵌套对象。如果设置为true，则允许解析嵌套对象。

 * limit: '1024mb'设置了解析请求体的最大大小，超过这个限制的请求将被拒绝。这个值是1024兆字节（MB）。
 *
 * 请注意，从Express 4.16.0开始，bodyParser.urlencoded已被弃用，
 * 建议使用express.urlencoded({ extended: false, limit: '1024mb' }));替代。
 */

/*-API-*/
// 延迟函数
const delay = function delay(interval) {
    typeof interval !== "number" ? interval = 1000 : null;
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, interval);
    });
};

// 检测文件是否存在
const exists = function exists(path) {
    return new Promise(resolve => {
        fs.access(path, fs.constants.F_OK, err => {
            if (err) {
                resolve(false);
                return;
            }
            resolve(true);
        });
    });
};

// 创建文件并写入到指定的目录 & 返回客户端结果
const writeFile = function writeFile(res, path, file, filename, stream) {
    return new Promise((resolve, reject) => {
        if (stream) {
            try {
                let readStream = fs.createReadStream(file.path),
                    writeStream = fs.createWriteStream(path);
                readStream.pipe(writeStream);
                readStream.on('end', () => {
                    resolve();
                    fs.unlinkSync(file.path);
                    res.send({
                        code: 0,
                        codeText: 'upload success',
                        originalFilename: filename,
                        servicePath: path.replace(__dirname, HOSTNAME)
                    });
                });
            } catch (err) {
                reject(err);
                res.send({
                    code: 1,
                    codeText: err
                });
            }
            return;
        }
        fs.writeFile(path, file, err => {
            if (err) {
                reject(err);
                res.send({
                    code: 1,
                    codeText: err
                });
                return;
            }
            resolve();
            res.send({
                code: 0,
                codeText: 'upload success',
                originalFilename: filename,
                servicePath: path.replace(__dirname, HOSTNAME)
            });
        });
    });
};

// 基于multiparty插件实现文件上传处理 & form-data解析
const uploadDir = `${__dirname}/upload`;
//__dirname:返回正在执行脚本所在目录(即xx/xx/xx/server)
const multiparty_upload = function multiparty_upload(req, auto) {
    typeof auto !== "boolean" ? auto = false : null;
    let config = {
        maxFieldsSize: 200 * 1024 * 1024,
    };
    if (auto) config.uploadDir = uploadDir;
    //uploadDir: 只有当autoFiles为true时才有效，用于设置放置上传文件的目录。
    //如果是自动上传的话，会帮我们把上传的文件自动存放在这个目录下
    return new Promise(async (resolve, reject) => {
        await delay();
        new multiparty.Form(config)
            //multiparty.Form方法用来把客户端传过来的formData格式数据进行解析parse
            .parse(req, (err, fields, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({
                    fields,
                    files
                });
                //fields包含了filename值
                //files就是客户端传过来的文件对象
            });
    });
};

// 单文件上传处理「FORM-DATA」
app.post('/upload_single', async (req, res) => {
    try {
        let {
            files
        } = await multiparty_upload(req, true);
        let file = (files.file && files.file[0]) || {};
        res.send({
            code: 0,
            codeText: 'upload success',
            originalFilename: file.originalFilename,
            servicePath: file.path.replace(__dirname, HOSTNAME)
        });
    } catch (err) {
        res.send({
            code: 1,
            codeText: err
        });
    }
});

app.post('/upload_single_name', async (req, res) => {
    try {
        let {
            fields,
            files
        } = await multiparty_upload(req);
        let file = (files.file && files.file[0]) || {},
            filename = (fields.filename && fields.filename[0]) || "",
            path = `${uploadDir}/${filename}`,
            isExists = false;
        // 检测是否存在
        isExists = await exists(path);
        if (isExists) {
            res.send({
                code: 0,
                codeText: 'file is exists',
                originalFilename: filename,
                servicePath: path.replace(__dirname, HOSTNAME)
            });
            return;
        }
        writeFile(res, path, file, filename, true);
    } catch (err) {
        res.send({
            code: 1,
            codeText: err
        });
    }
});

// 单文件上传处理「BASE64」
app.post('/upload_single_base64', async (req, res) => {
    let file = req.body.file,
        filename = req.body.filename,
        spark = new SparkMD5.ArrayBuffer(),
        suffix = /\.([0-9a-zA-Z]+)$/.exec(filename)[1],
        isExists = false,
        path;
    //spark用来根据文件的【内容】生成一个hash名字
    file = decodeURIComponent(file);
    file = file.replace(/^data:image\/\w+;base64,/, "");
    file = Buffer.from(file, 'base64');
    spark.append(file);
    path = `${uploadDir}/${spark.end()}.${suffix}`;
    await delay();
    // 检测是否存在
    isExists = await exists(path);
    if (isExists) {
        res.send({
            code: 0,
            codeText: 'file is exists',
            originalFilename: filename,
            servicePath: path.replace(__dirname, HOSTNAME)
        });
        return;
    }
    writeFile(res, path, file, filename, false);
});

// 大文件切片上传 & 合并切片
const merge = function merge(HASH, count) {
    return new Promise(async (resolve, reject) => {
        let path = `${uploadDir}/${HASH}`,
            fileList = [],
            suffix,
            isExists;
        isExists = await exists(path);
        if (!isExists) {
            reject('HASH path is not found!');
            return;
        }
        fileList = fs.readdirSync(path);
        if (fileList.length < count) {
            reject('the slice has not been uploaded!');
            return;
        }
        fileList.sort((a, b) => {
            let reg = /_(\d+)/;
            return reg.exec(a)[1] - reg.exec(b)[1];
        }).forEach(item => {
            !suffix ? suffix = /\.([0-9a-zA-Z]+)$/.exec(item)[1] : null;
            fs.appendFileSync(`${uploadDir}/${HASH}.${suffix}`, fs.readFileSync(`${path}/${item}`));
            fs.unlinkSync(`${path}/${item}`);
        });
        fs.rmdirSync(path);
        resolve({
            path: `${uploadDir}/${HASH}.${suffix}`,
            filename: `${HASH}.${suffix}`
        });
    });
};

app.post('/upload_chunk', async (req, res) => {
    try {
        let {
            fields,
            files
        } = await multiparty_upload(req);
        let file = (files.file && files.file[0]) || {},
            filename = (fields.filename && fields.filename[0]) || "",
            path = '',
            isExists = false;
        // 创建存放切片的临时目录
        let [, HASH] = /^([^_]+)_(\d+)/.exec(filename);
        path = `${uploadDir}/${HASH}`;
        !fs.existsSync(path) ? fs.mkdirSync(path) : null;
        // 把切片存储到临时目录中
        path = `${uploadDir}/${HASH}/${filename}`;
        isExists = await exists(path);
        if (isExists) {
            res.send({
                code: 0,
                codeText: 'file is exists',
                originalFilename: filename,
                servicePath: path.replace(__dirname, HOSTNAME)
            });
            return;
        }
        writeFile(res, path, file, filename, true);
    } catch (err) {
        res.send({
            code: 1,
            codeText: err
        });
    }
});

app.post('/upload_merge', async (req, res) => {
    let {
        HASH,
        count
    } = req.body;
    try {
        let {
            filename,
            path
        } = await merge(HASH, count);
        res.send({
            code: 0,
            codeText: 'merge success',
            originalFilename: filename,
            servicePath: path.replace(__dirname, HOSTNAME)
        });
    } catch (err) {
        res.send({
            code: 1,
            codeText: err
        });
    }
});

app.get('/upload_already', async (req, res) => {
    let {
        HASH
    } = req.query;
    let path = `${uploadDir}/${HASH}`,
        fileList = [];
    try {
        fileList = fs.readdirSync(path);
        fileList = fileList.sort((a, b) => {
            let reg = /_(\d+)/;
            return reg.exec(a)[1] - reg.exec(b)[1];
        });
        res.send({
            code: 0,
            codeText: '',
            fileList: fileList
        });
    } catch (err) {
        res.send({
            code: 0,
            codeText: '',
            fileList: fileList
        });
    }
});

app.use(express.static('./'));

app.use((req, res) => {
    res.status(404);
    res.send('NOT FOUND!');
});
