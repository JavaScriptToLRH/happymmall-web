var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); // 分离项目中的css文件
var HtmlWebpackPlugin = require('html-webpack-plugin'); // 自动生成一个 html 文件，并且引用相关的 assets 文件(如 css, js)

// 环境变量配置，dev / online
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';

// 获取 html-webpack-plugin 参数配置的方法
var getHtmlConfig = function (name, title) {
  return {
    // html-webpack-plugin 参数设置（可参考：https://segmentfault.com/a/1190000007294861#articleHeader1）
    template: './src/view/' + name + '.html', // 根据指定的模板文件来生成特定的 html 文件
    filename: '/view/' + name + '.html', // 生成 html 文件的文件名
    favicon: './favicon.ico', // 给生成的 html 文件生成一个 favicon（网页图标）。属性值为 favicon 文件所在的路径名
    title: title, // 设置生成的 html 文件的标题
    inject: true,
    // inject - 注入选项。有四个选项值 true, body, head, false
    // > true：默认值，script标签位于html文件的 body 底部
    // > body：同 true
    // > head：script 标签位于 head 标签内
    // > false：不插入生成的 js 文件，只是单纯的生成一个 html 文件
    hash: true, // 给生成的 js 文件一个独特的 hash 值，该 hash 值是该次 webpack 编译的 hash 值。默认值为 false 。
    chunks: ['common', name] // 表示每个入口文件，都使用 common.js文件 和 入口文件自身的js文件
    // chunks 选项的作用主要是针对多入口(entry)文件
    // 当你有多个入口文件的时候，对应就会生成多个编译后的 js 文件。那么 chunks 选项就可以决定是否都使用这些生成的 js 文件。
    // chunks 默认会在生成的 html 文件中引用所有的 js 文件，也可以指定引入哪些特定的文件。
  };
};
// webpack config
var config = {
  /* 
   * 【新增】：新增mode参数，webpack4中要指定模式，可以放在配置文件这里，也可以放在启动命令里，如--mode production
   */
  // mode: 告知 webpack 使用相应模式的内置优化
  mode: 'dev' === WEBPACK_ENV ? 'development' : 'production',
  /* 
   * 【改动】：删除了入口文件的中括号，可选的改动，没什么影响
   */
  entry: {
    'common'            : './src/page/common/index.js',
    'index'             : './src/page/index/index.js',
    'list'              : './src/page/list/index.js',
    'detail'            : './src/page/detail/index.js',
    'cart'              : './src/page/cart/index.js',
    'order-confirm'     : './src/page/order-confirm/index.js',
    'order-list'        : './src/page/order-list/index.js',
    'order-detail'      : './src/page/order-detail/index.js',
    'payment'           : './src/page/payment/index.js',
    'user-login'        : './src/page/user-login/index.js',
    'user-register'     : './src/page/user-register/index.js',
    'user-pass-reset'   : './src/page/user-pass-reset/index.js',
    'user-center'       : './src/page/user-center/index.js',
    'user-center-update': './src/page/user-center-update/index.js',
    'user-pass-update'  : './src/page/user-pass-update/index.js',
    'result'            : './src/page/result/index.js',
    'about'             : './src/page/about/index.js',
  },
  output: {
    /* 
     * 【改动】：删除path的配置，在webpack4中文件默认生成的位置就是/dist,
     *  而publicPath和filename特性的设置要保留
     */
    // path      : __dirname + '/dist/',
    publicPath: 'dev' === WEBPACK_ENV ? '/dist/' : '//s.happymmall.com/mmall-fe/dist/',
    // publicPath 为项目中的所有资源指定一个基础路径，它被称为公共路径(publicPath)
    // 所有资源的基础路径是指项目中引用css，js，img等资源时候的一个基础路径
    // 这个基础路径要配合具体资源中指定的路径使用，所以其实打包后资源的访问路径可以用如下公式表示：
    // 静态资源最终访问路径 = output.publicPath + 资源loader或插件等配置路径
    // publicPath可参考：https://juejin.im/post/5ae9ae5e518825672f19b094
    filename: 'js/[name].js' // 配置输出文件的名称
  },
  externals: {
    // chunks: chunks 就是代码块的意思，有 nam e的 chunk 是在 entry 里配置了 name 的
    // bundle: 多个chunk合在一起就是bundle，一个bundle可以理解为一个大的js打包之后生成的文件，
    //         而多个bundle里可能有公共的部分，或者一个bundle里的东西并不需要一次性加载，需要按照路由按需加载，
    //         这个时候就需要按需加载，拆分成不同的chunk
    // externals 外部扩展：防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
    'jquery': 'window.jQuery'
  },
  module: {
    /* 
     * 【改动】：loader的使用中，loaders字段变为rules，用来放各种文件的加载器，用rules确实更为贴切
     */
    rules: [
      /* 
       * 【改动】：css样式的加载方式变化
       */
      // css文件的处理
      // ExtractTextPlugin 分离项目中的css文件
      // css-loader 的作用是处理css文件中 @import，url之类的语句
      // style-loader 的作用是将css文件内容放在style标签内并插入head中
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({ // 使用ExtractTextWebpackPlugin的extract方法
          fallback: "style-loader", // 表示不提取CSS的时候，使用指定loader来处理 css
          use: "css-loader" // 指定loader去编译文件（loader 被用于将资源转换成一个 CSS 导出模块 ）
        })
      },
      /* 
       * 【改动】：模板文件的加载方式变化
       */
      // 模板文件的处理
      {
        test: /\.string$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: true, // 最小化
            removeAttributeQuotes: false // 去掉引号，减少文件大小
          }
        }
      },
      /* 
       * 【改动】：图片文件的加载方式变化，并和字体文件分开处理
       */
      // 图片的配置
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            /* 
             * 【改动】：图片小于2kb的按base64打包
             */
            limit: 2048,
            name: 'resource/[name].[ext]'
          }
        }]
      },
      /* 
       * 【改动】：字体文件的加载方式变化
       */
      // 字体图标的配置
      {
        test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'resource/[name].[ext]'
          }
        }]
      }
    ]
  },
  resolve: { // 解析
    alias: { // 创建 import 或 require 的别名，来确保模块引入变得更简单。
      node_modules: __dirname + '/node_modules',
      util        : __dirname + '/src/util',
      page        : __dirname + '/src/page',
      service     : __dirname + '/src/service',
      image       : __dirname + '/src/image'
    }
  },
  /* 
   * 【新增】：webpack4里面移除了commonChunksPulgin插件，放在了config.optimization里面
   */
  // 参考：https://juejin.im/post/5ac76a8f51882555677ecc06
  optimization: {
    runtimeChunk: false, // 将webpack运行时生成代码打包到runtime.js。(将webpack生成的 runtime 作为独立 chunk ，runtime包含在模块交互时，模块所需的加载和解析逻辑（manifest）)
    // splitChunks参考：https://juejin.im/post/5af1677c6fb9a07ab508dabb
    splitChunks: { // 找到 chunk 中共同依赖的模块,取出来生成单独的 chunk（将多个入口重复加载的公共资源提取出来）
      cacheGroups: { // 缓存组会继承splitChunks的配置，但是test、priorty和reuseExistingChunk只能用于配置缓存组。
        common: { // key 为 entry中定义的 入口名称。此处 key 为 common
          name: "common", // 要缓存的 分隔出来的 chunk 名称
          chunks: "all", // 必须三选一： "initial"(初始化) | "all" | "async"(默认就是异步)
          minChunks: 2 // 最小 chunk ，默认1
        }
      }
    }
  },
  plugins: [
    /* 
     * 【移除】：webpack4里面移除了commonChunksPulgin插件
     */
    // // 独立通用模块到js/base.js
    // new webpack.optimize.CommonsChunkPlugin({
    //     name : 'common',
    //     filename : 'js/base.js'
    // }),
    // 把css单独打包到文件里
    new ExtractTextPlugin("css/[name].css"),
    // html模板的处理
    new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),
    new HtmlWebpackPlugin(getHtmlConfig('list', '商品列表')),
    new HtmlWebpackPlugin(getHtmlConfig('detail', '商品详情')),
    new HtmlWebpackPlugin(getHtmlConfig('cart', '购物车')),
    new HtmlWebpackPlugin(getHtmlConfig('order-confirm', '订单确认')),
    new HtmlWebpackPlugin(getHtmlConfig('order-list', '订单列表')),
    new HtmlWebpackPlugin(getHtmlConfig('order-detail', '订单详情')),
    new HtmlWebpackPlugin(getHtmlConfig('payment', '订单支付')),
    new HtmlWebpackPlugin(getHtmlConfig('user-login', '用户登录')),
    new HtmlWebpackPlugin(getHtmlConfig('user-register', '用户注册')),
    new HtmlWebpackPlugin(getHtmlConfig('user-pass-reset', '找回密码')),
    new HtmlWebpackPlugin(getHtmlConfig('user-center', '个人中心')),
    new HtmlWebpackPlugin(getHtmlConfig('user-center-update', '修改个人信息')),
    new HtmlWebpackPlugin(getHtmlConfig('user-pass-update', '修改密码')),
    new HtmlWebpackPlugin(getHtmlConfig('result', '操作结果')),
    new HtmlWebpackPlugin(getHtmlConfig('about', '关于MMall')),
  ],
  /* 
   * 【新增】：在v1.0.1版本中新增了devServer的配置，用自带的代理就可以访问接口
   */
  devServer: {
    // host: '192.168.2.184',
    port: 8088,
    inline: true,
    proxy: {
      '**/*.do': {
        target: 'http://test.happymmall.com/',
        changeOrigin: true,
        secure: false
      }
    }
  }
};

module.exports = config;