const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const base = require('./webpack.base.js')

module.exports = merge(base, {
  mode: 'production',
  devtool: '#source-map',
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'postcss-loader']
      })
    }, {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'less-loader', 'postcss-loader']
      })
    }]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: { // 抽离第三方插件
          name: 'vendor', // 打包后的文件名，任意命名 
          test: /node_modules/, // 指定是node_modules下的第三方包
          chunks: 'initial',
          filename: 'static/bundle.js',
          priority: 10 // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(['../dist'], {
      allowExternal: true
    }),
    new ExtractTextPlugin('css/[name]_[hash:6].css'),
  ]
})
