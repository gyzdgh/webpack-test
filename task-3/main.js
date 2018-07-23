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
    newTodo: '',
    todoList: []
  },
  created: function () {
    window.onbeforeunload = () => {
      let dataString = JSON.stringify(this.todoList) 
      window.localStorage.setItem('myTodos', dataString)
    }

    let oldDataString = window.localStorage.getItem('myTodos')
    let oldData = JSON.parse(oldDataString)
    this.todoList = oldData || []

  },
  methods: {
    addTodo: function () {
      this.todoList.push({
        title: this.newTodo,
        createdAt: new Date(),
        done: false // 添加一个 done 属性
      })
      this.newTodo = ''
    },
    // 加了👇这个函数
    removeTodo: function (todo) {
      let index = this.todoList.indexOf(todo)
      this.todoList.splice(index, 1)
    }
  }
})                                                          