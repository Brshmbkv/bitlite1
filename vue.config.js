module.exports = {
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');
    const svgoConfig = {
      svgo: {
        plugins: [{
          cleanupIDs: false,
          // convertShapeToPath: false
        }]
      }
    }
    svgRule.uses.clear();

    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .options(svgoConfig);
  },
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    proxy: 'https://app.bitlab.academy/api/v1/'
    // proxy: 'http://192.168.5.128:8080/api/v1/',
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  },
  publicPath: '/'
}
