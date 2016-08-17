var str = require('./component');
//把less模块引入到当前项目中
require('./less/index');
require('bootstrap/dist/css/bootstrap.css');
var img = document.createElement('img');
img.className = 'img-circle';
img.src = require('./images/lu.jpg');
document.body.appendChild(img);
var $ = require('jquery');
$('#app').html(str);
if(__DEV__){
    console.log('这是开发环境');
}else{
    console.log('这是生产环境');
}
