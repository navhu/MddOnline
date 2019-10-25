const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser'); // 解析body字段模块
const axios = require('axios');
const fs = require('fs');
const md5 = require("blueimp-md5");
//工具
require('./util/util.js');

/**
 * 签名算法
 * @param {Object} body 请求数据
 */
const Sign = function (body) {
  var str = '';
  var arr = [];
  var param = body.data || {};

  var data = {
    'os': 'iOS',
    'version': '3.7.1',
    'action': body.action,
    'time': body.time || new Date().getTime().toString(),
    'appToken': '23cdacdedf0b40299ce4ec02fb8c839932ab09b0915d708a0318e41163303a86',
    'privateKey': 'e1be6b4cf4021b3d181170d1879a530a9e4130b69032144d5568abfd6cd6c1c2',
    'data': ''
  };

  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      arr.push(key + ':' + data[key]);
    }
  }

  str = arr.join('|');

  for (var key in param) {
    if (param.hasOwnProperty(key)) {
      str += (key + '=' + param[key] + '&');
    }
  }

  delete data.privateKey;

  data.channel = 'AppStore';
  data.deviceNum = '15e98be236b24584aa30cbcd4e55cc67';
  data.deviceType = 0;
  data.data = param;
  data.sign = md5(str);

  return data;
}

app.set('views', './views');
app.set('view engine', 'ejs');

let port = process.env.PORT || 8080;

//axios实例
const ajax = axios.create({
  baseURL: 'https://mob.mddcloud.com.cn', //api请求baseUrl 
  headers: {
    'Referer': "mdd",
    'User-Agent': "Mdd/3.3.2 (ios 11.2.2)",
    'Content-Type': 'application/json;charset=utf-8'
  }
});

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json()); // 调用bodyParser模块以便程序正确解析body传入值
app.use('/static', express.static('./public')); //静态文件

//渲染模板文件
router.get('/list', function (req, res) {
  fs.readdir('./public', function (err, files) {
    if (err) {
      throw err;
    }
    // files是一个数组  
    // 每个元素是此目录下的文件或文件夹的名称  
    files.remove('css');
    files.remove('js');
    files.remove('image');
    if (files) {

    }
    res.render('list', {
      list: files
    });
  });
});

app.use(router);

//api代理请求
app.use('/', function (req, res) {
  //允许跨域
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , Referer, User-Agent');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');

  var method = req.method.toUpperCase();

  var options = {
    method: method,
    url: req.originalUrl,
    data: req.body,
  };

  // 进行签名
  if (req.originalUrl.indexOf('/api/') !== -1) {
    options.data = Sign(options.data);
  }

  ajax(options).then(response => {
    res.send(response.data);
  }).catch(err => {});

  if (req.method == 'OPTIONS') {
    res.send(200);
  }
})

app.listen(port, () => {
  console.log('listening on : http://127.0.0.1:' + port + '/list');
})