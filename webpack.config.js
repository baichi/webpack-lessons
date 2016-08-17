var path = require('path');
var HtmlWebpackPlugin =  require('html-webpack-plugin');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
//设置全局变量，这个变量__DEV__会作为window的属性
var definePlugin = new webpack.DefinePlugin({
    __DEV__:(process.env.NODE_ENV||'dev').trim() == 'dev'
});
console.log('process.env.NODE_ENV',process.env.NODE_ENV);
var OpenBrowserWebpackPlugin =  require('open-browser-webpack-plugin');
//得到jquery的绝对路径
//var jqueryPath = path.resolve('node_modules/jquery/dist/jquery.js');
var jqueryPath = path.resolve('lib/jquery.js');
//进行路径的转换 传入要替换成什么样的路径
function rewriteUrl(replacePath){
    // /api/books
    return function(req,options){
        // /\/api\/(.+)/ => '\/$1\.json'
        req.url = req.path.replace(options.path,replacePath);
    }
}
//导出一个对象
module.exports = {
    //设置入口文件的绝对路径
    entry:{
        a:path.resolve('src/a.js'),
        b:path.resolve('src/a.js')
    },
    //设置输出
    output:{
        path:'./build',//设置输出目录
        filename:'[name].[hash].js'//设置输出保存的文件名
    },
    //如何解析文件
    resolve:{
        //指定文件扩展名
        extensions:['','.js','.css','.json','.less'],
        //指定模块别名 指定后不需要再走原有的node模块流程，直接定位到文件
        alias:jqueryPath
    },
    //指定webpack-dev-server的配置项
    devServer:{
        inline:true,//在源代码修改之后重新打包并刷新浏览器
       port:8080,//配置端口号
       contentBase:'./build',//配置文件的根目录
       proxy:[
           {
               //指定用来匹配请求URL的正则
               path:/\/api\/(.+)/,
               //将此请求转发给哪个服务器
               target:'http://localhost:8080',
               //转换路径，把原路径转成目标路径
               rewrite:rewriteUrl('\/$1\.json'),
               //修改来源的路径
               changeOrigin:true
           }
       ]
    },
    //配置模块
    module:{
        loaders:[ //提定不同文件的加载器
            {
                test:/\.js$/,//指定要加载的文件
                loader:'babel'//指定加载器
            },
            {
                test:/\.less$/,//如果是less文件，如何加载
                loader:ExtractTextPlugin.extract("style-loader"
                    , "css-loader!less-loader")
            },
            {
                test:/\.css$/,//如果是css文件，如何加载
                loader:ExtractTextPlugin.extract("style-loader"
                    , "css-loader")
            },
            {
                test:/\.(eot|svg|ttf|woff|woff2)$/,
                loader:'url?limit=8192'
            },
            {
                test:/\.(png|jpg|gif)$/,
                loader:'url?limit=8192'
            },
            {
                test:/jquery\.js$/,
                loader:'expose?jQuery'
            }
        ]
    },
    plugins:[
        //把template里的文件拷贝到目标目录并且自动插入产出的或者说打包后的文件
        definePlugin,
        new ExtractTextPlugin("bundle.[hash].css"),
        new webpack.optimize.CommonsChunkPlugin('common.[hash].js'),
        new HtmlWebpackPlugin({
            title:'珠峰webpack',
            template:'./src/index.html',
            filename:'a.html',
            chunks:['a','common.js']
        }),
        new HtmlWebpackPlugin({
            title:'珠峰webpack',
            template:'./src/index.html',
            filename:'b.html',
            chunks:['b','common.js']
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.MinChunkSizePlugin({
            compress: {
                warnings: false
            }
        }),
        // 查找相等或近似的模块，避免在最终生成的文件中出现重复的模块
        new webpack.optimize.DedupePlugin(),
        // 按引用频度来排序 ID，以便达到减少文件大小的效果
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin({
            minSizeReduce: 1.5,
            moveToParents: true
        }),
        new OpenBrowserWebpackPlugin({
            url:'http://localhost:8080'
        })
    ]
}