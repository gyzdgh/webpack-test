// // 通过 CommonJS 规范导入 CSS 模块
// require('./main.css');
// // 通过 CommonJS 规范导入 show 函数
// const show = require('./show.js');
// // 执行 show 函数
// show('Webpack');


import main from './show';
import Vue from 'vue'
import AV from 'leancloud-storage'

//初始化数据库
var APP_ID = '8axnRtGoxCJhEzsvNPEAHnol-gzGzoHsz';
var APP_KEY = '0YH4XkYflb4CUPfA743TGj8G';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

//验证 LeanCloud SDK 安装成功
// var TestObject = AV.Object.extend('TestObject');
// var testObject = new TestObject();
// testObject.save({
//   words: 'Hello World!'
// }).then(function(object) {
//   alert('LeanCloud Rocks!');
// })


var app = new Vue({
  el: '#app',
  data: {
    //初始化新的待办为空
    newTodo: '',
    //按钮切换
    actionType: 'signUp',
    //注册功能
    formData: {
      username: '',
      password: ''
    },
    //待办列表为空
    todoList: [],
    currentUser: null  //初始化当前登陆的用户
  },
  //将待办保存在 localStorage 中
  created: function () {
    window.onbeforeunload = () => {
      let dataString = JSON.stringify(this.todoList)
      window.localStorage.setItem('myTodos', dataString)
    }

    let oldDataString = window.localStorage.getItem('myTodos')
    let oldData = JSON.parse(oldDataString)
    this.todoList = oldData || []
    //检查用户是否登陆
    this.currentUser = this.getCurrentUser();
  },
  methods: {
    //添加待办
    addTodo: function () {
      this.todoList.push({
        title: this.newTodo,
        createdAt: new Date(),
        done: false // 添加一个 done(是否完成) 属性
      })
      //变为空
      this.newTodo = ''
    },
    // 加了👇这个函数，删除待办
    removeTodo: function (todo) {
      let index = this.todoList.indexOf(todo)
      this.todoList.splice(index, 1)
    },
    //注册功能
    signUp: function () {
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then((loginedUser) => {    // 👈，改成箭头函数方便用this
        this.currentUser = this.getCurrentUser()
      }, function (error) {
        alert('注册失败')
      });
    },
    //登入功能
    login: function () {
      AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {// 👈，改成箭头函数方便用this
        this.currentUser = this.getCurrentUser()
      }, function (error) {
        alert('登录失败')
      });
    },
    //获取当前用户
    getCurrentUser: function () {
      let current = AV.User.current()
      if (current) {
        //获取用户的ID，用户名，创建时间
        let { id, createdAt, attributes: { username } } = current
        return { id, username, createdAt }
      } else {
        return null
      }
    },
    //登出功能
    logout: function () {
      AV.User.logOut()
      //当前用户为空
      this.currentUser = null
      window.location.reload()
    }
  }
})


