const path = require('path');
function resolveSrc(_path) {
  return path.join(__dirname, _path)
}
module.exports = {
  productionSourceMap: false,
  publicPath: '/',
  configureWebpack: {
    // Set up all the aliases we use in our app.
    resolve: {
      alias: {
        'src': resolveSrc('src')
      }
    }
  },
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true
      }
    }
  }
};
