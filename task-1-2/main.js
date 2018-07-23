// // 通过 CommonJS 规范导入 CSS 模块
// require('./main.css');
// // 通过 CommonJS 规范导入 show 函数
// const show = require('./show.js');
// // 执行 show 函数
// show('Webpack');


import main from './show';
import Vue from 'vue'

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})                                                               