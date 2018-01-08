var webpack = require('webpack');
// extract-text-webpack-plugin该插件的主要是为了抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// html-webpack-plugin可以根据你设置的模板，在每次运行后生成对应的模板文件，同时所依赖的CSS/JS也都会被引入，
// 如果CSS/JS中含有hash值，则html-webpack-plugin生成的模板文件也会引入正确版本的CSS/JS文件。
var HtmlWebpackPlugin = require('html-webpack-plugin');

//环境变量的配置，dev  /  online
// process对象是 Node 的一个全局对象，提供当前 Node 进程的信息。它可以在脚本的任意位置使用，不必通过require命令加载。该对象部署了EventEmitter接口。
// process.env属性返回一个对象，包含了当前Shell的所有环境变量。比如，process.env.HOME返回用户的主目录。
// 通常的做法是，新建一个环境变量NODE_ENV，用它确定当前所处的开发阶段，生产阶段设为production，开发阶段设为develop或staging，然后在脚本中读取process.env.NODE_ENV即可。
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';


//获取html-webpack-plugin参数的方法
var getHtmlConfig = function(name,title) {
    return {
        template : './src/view/' + name + '.html',//html模板路径
        filename : 'view/' + name + '.html',//生成的html存放路径，相对于path
        title    :title,
        inject   : true,//js插入的位置，true/'head'/'body'/false
                        // 注入选项。有四个选项值 true, body, head, false.
                        // true  默认值，script标签位于html文件的 body 底部
                        // body  同 true
                        // head  script 标签位于 head 标签内
                        // false 不插入生成的 js 文件，只是单纯的生成一个 html 文件
        hash     : true,//hash选项的作用是 给生成的 js 文件一个独特的 hash 值，该 hash 值是该次 webpack 编译的 hash 值。默认值为 false 。
        chunks   : ['common', name],
        // chunks 选项的作用主要是针对多入口(entry)文件。当你有多个入口文件的时候，对应就会生成多个编译后的 js 文件。那么 chunks 选项就可以决定是否都使用这些生成的 js 文件。
        // chunks 默认会在生成的 html 文件中引用所有的 js 文件，当然你也可以指定引入哪些特定的文件。
    }
};

//webpack config
var config = {
    entry: {
        //入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。
        //进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。
        //每个依赖项随即被处理，最后输出到称之为 bundles 的文件中
        'common'                : ['./src/page/common/index.js'],
        'index'                 : ['./src/page/index/index.js'],
        'list'                  : ['./src/page/list/index.js'], 
        'detail'                : ['./src/page/detail/index.js'],                       
        'cart'                  : ['./src/page/cart/index.js'],                       
        'user-login'            : ['./src/page/user-login/index.js'],
        'user-register'         : ['./src/page/user-register/index.js'],  
        'user-pass-reset'       : ['./src/page/user-pass-reset/index.js'], 
        'user-center'           : ['./src/page/user-center/index.js'], 
        'user-center-update'    : ['./src/page/user-center-update/index.js'],  
        'user-pass-update'      : ['./src/page/user-pass-update/index.js'],                                                                                                                                                                                                                                
        'result'                : ['./src/page/result/index.js'],
    },
    output: {
        //output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件。
        path: './dist',//输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
        publicPath: '/dist',//模板、样式、脚本、图片等资源对应的server上的路径
        filename: 'js/[name].js'//此选项决定了每个输出 bundle 的名称。这些 bundle 将写入到 output.path 选项指定的目录下。
    },
    externals: {
        //防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
        'jquery': 'window.jQuery'
    },
    module: {
        //决定了如何处理项目中的不同类型的模块
        loaders: [//加载器
            { 
                test: /\.css$/, //条件，会匹配test
                loader: ExtractTextPlugin.extract("style-loader", "css-loader"), 
            },
            { 
                test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/, 
                loader: 'url-loader?limit=100&name=resource/[name].[ext]', //将小于100byte的图片转成base64码
                //图片加载器，适合图片，可以将较小的图片转成base64，减少http请求
            },
            { 
                test: /\.string$/, //条件，会匹配test
                loader: 'html-loader', 
            },
        ]
    },
    resolve:{//设置模块如何被解析
        alias: {
            //创建 import 或 require 的别名，来确保模块引入变得更简单
            // 替换「在导入时使用相对路径」这种方式，就像这样：import Utility from '../../utilities/utility';
            // 可以这样使用别名：import Utility from 'Utilities/utility';
            node_modules : __dirname + '/node_modules',
            util         : __dirname + '/src/util',
            page         : __dirname + '/src/page',
            service      : __dirname + '/src/service',
            image        : __dirname + '/src/image',           
        },
    },
    plugins: [
        //独立通用模板到js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            //是一个可选的用于建立一个独立文件(又称作 chunk)的功能，这个文件包括多个入口 chunk 的公共模块。
            // 通过将公共模块拆出来，最终合成的文件能够在最开始的时候加载一次，便存起来到缓存中供后续使用。
            // 这个带来速度上的提升，因为浏览器会迅速将公共的代码从缓存中取出来，而不是每次访问一个新页面时，再去加载一个更大的文件。
            name: 'common',// 这是 common chunk 的名称。已经存在的 chunk 可以通过传入一个已存在的 chunk 名称而被选择。
            filename: 'js/base.js'// common chunk 的文件名模板
        }),
        //把CSS单独打包到文件里
        new ExtractTextPlugin('css/[name].css'),
        //html模板的处理
        new HtmlWebpackPlugin(getHtmlConfig('index','首页')),
        new HtmlWebpackPlugin(getHtmlConfig('list','商品列表页')),
        new HtmlWebpackPlugin(getHtmlConfig('detail','商品详情页')),                        
        new HtmlWebpackPlugin(getHtmlConfig('cart','购物车')),                        
        new HtmlWebpackPlugin(getHtmlConfig('user-login','用户登录')),
        new HtmlWebpackPlugin(getHtmlConfig('user-register','用户注册')),
        new HtmlWebpackPlugin(getHtmlConfig('user-pass-reset','找回密码')),   
        new HtmlWebpackPlugin(getHtmlConfig('user-center','个人中心')),  
        new HtmlWebpackPlugin(getHtmlConfig('user-center-update','修改个人信息')), 
        new HtmlWebpackPlugin(getHtmlConfig('user-pass-update','修改密码')),                                                                                                                         
        new HtmlWebpackPlugin(getHtmlConfig('result','操作结果')),        
    ]
};

//如果是在生产环境 就在通用组件common里面加入webpack-dev-server/client?http://localhost:80/
if ('dev' === WEBPACK_ENV) {
    config.entry.common.push('webpack-dev-server/client?http://localhost:8089/');
}

module.exports = config;