module.exports = {
    devServer: {
        host: 'localhost',
        port: 8079,
        proxy: {
            '/': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                pathRewrite: {
                    '^/': ''
                }
            }
        }
    }
}