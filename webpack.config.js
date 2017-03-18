
// 
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 合并第三方库
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
// 从js文件中分离css文件
const ExtractTextPlugin = require("extract-text-webpack-plugin");
// 分别指定每个样式表的输出文件名
const extractCSS = new ExtractTextPlugin("css/styles.css");
const extractLESS = new ExtractTextPlugin('css/less.css');

module.exports = {
  entry: {
    // 多入口文件
    bundle1: __dirname + '/src/js/main1.jsx',
    bundle2: __dirname + '/src/js/main2.jsx',
    // 需要合并的第三方库在这里指定
    // vendor: ['jquery', 'react', 'react-dom']
  },
  output: {
    path: __dirname + '/build',
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        // 有.babelrc文件则不需要在这里设置
        // query: {
        //   presets: ['es2015', 'react'],
        // }
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.less$/i,
        use: extractLESS.extract([ 'css-loader', 'less-loader' ])
      },
      { 
        test: /\.(png|jpg)$/, 
        loader: "file-loader?name=img/[hash:8].[name].[ext]"
      }
    ]
  },
  plugins: [
    // 将bundle1和bundle2文件的相同代码提取到bundle文件中
    new CommonsChunkPlugin({
      name: 'common',
      chunks: ['bundle1', 'bundle2'],
      filename: 'js/bundle.js',
    }),
    // 将使用到的全部第三方的库提取到同一个文件vendor
    // new CommonsChunkPlugin({
    //   name: 'vendor', 
    //   filename: 'js/vendor.js'
    // }),
    new HtmlWebpackPlugin({
      template: __dirname + "/src/index.html"
    }),
    // 分离css文件
    extractCSS,
    extractLESS,
  ],
  devServer: {
    contentBase: "./build/", // 本地服务器所加载的页面所在的目录
    historyApiFallback: true, // 不跳转
    inline: true // 实时刷新
  }
}