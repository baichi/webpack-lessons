//这是跟后台约定好的接口
var originUrl = '/api/books/add';
//目录服务器只能接收  /books.json

function replace(src){
    return src.replace(/\/api\/(.+)\/(.+)/,'\/$1\.$2\.json')
}
console.log(replace(originUrl));