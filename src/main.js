/*
 * The Vue build version to load with the `import` command
 * (runtime-only or standalone) has been set in webpack.base.conf with an alias.
 */

/* eslint-disable */

import Vue from 'vue'
import App from './App'
import router from './router'
// 状态管理工具

import store from "store";
import './mock/mock'

// JS 工具库

//在防抖的组件里，引入lodash
import lodash from 'lodash'
Vue.prototype._ = lodash

//时间组件
// 路由拦截器
import "@/router-permission";

// UI组件
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import '../src/page/searching/css/arrow.css'

import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

import VueCropper from 'vue-cropper'
Vue.use(VueCropper)

// 主样式文件
import "common/font/iconfont.css";
import { Message, Card, Dropdown } from 'element-ui'
// import { showLoading, hideLoading } from './mock/loading';

import VueWechatTitle from 'vue-wechat-title'
Vue.use(VueWechatTitle);

Vue.use(ElementUI);
Vue.use(Card);
Vue.use(Dropdown);
Vue.use(Antd)

const newVue = new Vue(); // newVue代指实例this
import { showLoading, hideLoading } from "utils/loading";
Vue.config.productionTip = false;
Vue.prototype.$message = Message;

import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

import axios from 'axios'
axios.defaults.withCredentials=true;//让ajax携带cookie
// 拦截request,设置全局请求为ajax请求
axios.interceptors.request.use((config) => {
  // console.log(this.$cookies.get("sessionid"), this.$cookies.keys(), "=====vue-cookie")

  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  let regex = /.*csrftoken=([^;.]*).*$/; // 用于从cookie中匹配 csrftoken值
  config.headers['X-CSRFToken'] = document.cookie.match(regex) === null ? null : document.cookie.match(regex)[1];
  // showLoading();
  return config;
},err=>{
  return Promise.reject(err)
});

/* 请求之后的操作 */
// http request 拦截器
// axios.interceptors.request.use(
//   config => {
//     if ($store.state.login.username) {
//       config.headers.Authorization = `token ${store.state.login.username}`
//     }
//     return config
//   },
//   err => {
//     return Promise.reject(err)
//   },
// );

// http response 拦截器
axios.interceptors.response.use(
  response => { 
    if(response.data.code == 402){
      store.commit('removeUser');
      router.currentRoute.path !== 'login' &&
      router.replace({
        path: '/login',
        query: { redirect: router.currentRoute.path },
      })
      // hideLoading();
      newVue.$message({
        showClose: true,
        message: '用户登录超时，请重新登录',
        type: "error"
      });
      return;
    }
    if(response.data.code == 401){
      store.commit('removeUser');
      console.log(router.currentRoute.path);
      
      if(router.currentRoute.path !== '/login'){
        router.replace({
          path: '/login',
          query: { redirect: router.currentRoute.path },
        })
        // hideLoading();
        newVue.$message({
          showClose: true,
          message: '请先登录',
          type: "error"
        });
        return;
      } else{
       
      }
    
    }
    return response
  },
  error => {   
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401未经授权的访问
          // 401 清除token信息并跳转到登录页面
          store.commit('removeUser');//在main.js不能使用this.$store
          // 只有在当前路由不是登录页面才跳转
          router.currentRoute.path !== 'login' &&
            router.replace({
              path: '/login',
              query: { redirect: router.currentRoute.path },
            })
           
            newVue.$message({
              showClose: true,
              message: '请先登录',
              type: "error"
            });
    }
    //  hideLoading();
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response.data)
  }
}
);

router.beforeEach((to, from, next) => {
  let Base64 = require('js-base64').Base64;
  // sessionStorage.removeItem("path");
  if(from.path == '/search/moleculeDetail'&& to.path =='/search/scaffoldhoppingResult'){
    showLoading("加载中......");
  }
  if(from.path == '/search/moleculeDetail'&& to.path =='/search/derivationResult'){
    showLoading("加载中......");
  }
  if(from.path == '/search/moleculeDetail'&& to.path =='/search/optimizeResult'){
    showLoading("加载中......");
  }
  // if(from.path == '/search/taskmoleculedetail'&& to.path =='/search/historypage'){
  //   let routeData = router.resolve({
  //     path: "/search/historypage"
  //   }); 
  //     window.open(routeData.href,"_blank"); 
  // }
  // if(from.path == '/search/taskdetail'&& to.path =='/search/historypage'){
  //   console.log(999);
    
  //   let routeData = router.resolve({
  //     path: "/search/historypage"
  //   }); 
  //     window.open(routeData.href,"_blank"); 
  // }
  if(to.path == '/search/scaffoldHopping'){
    sessionStorage.removeItem("path"); 
  }
  if(to.path == '/search/skeletonDerivation'){
    sessionStorage.removeItem("path"); 
  }
  if(to.path == '/search/molecularOptimize'){
    sessionStorage.removeItem("path"); 
  }
  if (to.path == "/search/optimizeResult") {
    sessionStorage.removeItem("3dscore");
    sessionStorage.removeItem("dockscore");
  }
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (localStorage.getItem('user')) {  // 通过localstorage获取当前的token是否存在     
      next();
    }
    else {
      next({
        path: '/login',
        query: {}  // 将跳转的路由path作为参数，登录成功后跳转到该路由，注销后的登录应该跳转到/home
      })//  需要在login跳转的路径中再加一段跳转到redirect
    }
  }
  // else {
  //   next();
  // }
  if (to.meta.vipAuth) {  // 判断该路由是否需要登录权限
    if (Base64.decode(localStorage.getItem('user').volunt) === 2) {      
      next();
    }
    else {
      next({
        path: '/search/noAuth',
        query: {}  // 将跳转的路由path作为参数，登录成功后跳转到该路由，注销后的登录应该跳转到/home
      })//  需要在login跳转的路径中再加一段跳转到redirect
    }
  }
  else {
    next();
  }
});

// 跳转后返回顶部
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store,

})
