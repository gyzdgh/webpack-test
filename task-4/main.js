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
var APP_ID = 'NjlgdBY3hHhl5vs5mqXSzeXu-gzGzoHsz';
var APP_KEY = 'jKWke83lEgGz3qEyw9jauWHb';
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
    // //当窗口即将被关闭的时候触发事件
    // window.onbeforeunload = () => {
    //   //指定值对应的JSON字符串
    //   let dataString = JSON.stringify(this.todoList)
    //   //设置当前页面的 localStorage 
    //   window.localStorage.setItem('myTodos', dataString)
    // }
    // //读取上一次的 localStorage
    // let oldDataString = window.localStorage.getItem('myTodos')
    // //用JSON解析
    // let oldData = JSON.parse(oldDataString)
    // //设置待办项的内容
    // this.todoList = oldData || []
    // //检查用户是否登陆
    this.currentUser = this.getCurrentUser();
    this.fetchTodos() // 将原来的一坨代码取一个名字叫做 fetchTodos
  },
  methods: {
    fetchTodos: function () {
      //判断是否为当前用户
      if (this.currentUser) {
        //获取 User 的 AllTodos
        var query = new AV.Query('AllTodos');
        query.find()
          .then((todos) => {
            let avAllTodos = todos[0] // 因为理论上 AllTodos 只有一个，所以我们取结果的第一项
            //保存id
            let id = avAllTodos.id
            this.todoList = JSON.parse(avAllTodos.attributes.content) // 为什么有个 attributes？因为我从控制台看到的
            this.todoList.id = id // 为什么给 todoList 这个数组设置 id？因为数组也是对象啊
          }, function (error) {
            console.error(error)
          })
      }
    },
    updateTodos: function () {
      let dataString = JSON.stringify(this.todoList)
      let avTodos = AV.Object.createWithoutData('AllTodos', this.todoList.id)
      avTodos.set('content', dataString)
      avTodos.save().then(() => {
        console.log('更新成功')
      })
    },
    saveTodos: function () {
      let dataString = JSON.stringify(this.todoList)
      var AVTodos = AV.Object.extend('AllTodos');
      var avTodos = new AVTodos();
      var acl = new AV.ACL()
      acl.setReadAccess(AV.User.current(), true) // 只有这个 user 能读
      acl.setWriteAccess(AV.User.current(), true) // 只有这个 user 能写

      avTodos.set('content', dataString);
      avTodos.setACL(acl) // 设置访问控制
      avTodos.save().then((todo) => {
        this.todoList.id = todo.id  // 一定要记得把 id 挂到 this.todoList 上，否则下次就不会调用 updateTodos 了
        console.log('保存成功');
      }, function (error) {
        alert('保存失败');
      });
    },
    saveOrUpdateTodos: function () {
      if (this.todoList.id) {
        this.updateTodos()
      } else {
        this.saveTodos()
      }
    },
    //添加待办
    addTodo: function () {
      this.todoList.push({
        title: this.newTodo,
        createdAt: new Date(),
        done: false // 添加一个 done(是否完成) 属性
      })
      //变为空
      this.newTodo = ''
      this.saveOrUpdateTodos()
    },
    // 加了👇这个函数，删除待办
    removeTodo: function (todo) {
      let index = this.todoList.indexOf(todo)
      this.todoList.splice(index, 1)
      this.saveOrUpdateTodos()
    },
    //注册功能
    signUp: function () {
      //声明一个新的用户
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      //成功注册之后，执行的逻辑
      user.signUp().then((loginedUser) => {    // 👈，改成箭头函数方便用this
        this.currentUser = this.getCurrentUser()
      }, (error) => {
        //异常处理
        alert('注册失败')
        console.log(error)
      });
    },
    //登入功能
    login: function () {
      AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {// 👈，改成箭头函数方便用this
        this.currentUser = this.getCurrentUser()
        this.fetchTodos() // 登录成功后读取 todos
      }, function (error) {
        alert('登录失败')
        console.log(error)
      });
    },
    //获取当前用户
    getCurrentUser: function () {
      // LeanCloud 文档说 AV.User.current() 可以获取当前登录的用户
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


