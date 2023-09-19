const ENV = process.env.NODE_ENV;
module.exports = {
    lintOnSave: ENV !== 'production',
    publicPath: './',
    productionSourceMap: false,
    devServer: {//webpack
        proxy: {
            '/api': {
                target: 'https://www.jianshu.com',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
};