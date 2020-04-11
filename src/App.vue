<template>
  <a-locale-provider :locale="zh_CN">
  <div id="app">
    <RouterView v-if="isRouterAlive" v-wechat-title="$route.meta.title"/>
  </div>
  </a-locale-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import axios from 'axios';

moment.locale('zh-cn');
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      zh_CN,
      isRouterAlive: true
    }
  },
  created() {
  },
  mounted: function () {
         // App.vue文件中统一设置关闭浏览器清空localStorage
        window.onload = function(){
          if(!window.sessionStorage["tempFlag"]){
          //  this.$cookies.remove('sessionid');
        //  this.$cookies.set('csrftoken',29)
        //  this.$cookies.set('sessionid',111,1);
           // location.reload();   //不能省，强制跳到登陆页
          }else{
            window.sessionStorage.removeItem("tempFlag");
          }
        }
        window.onunload = function (){
          window.sessionStorage["tempFlag"] = true;
        }
        window.onbeforeunload = function (){
          window.sessionStorage["tempFlag"] = true;
        }
    },
  methods:{
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
};


</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

  html,body{
    background: #fff;
  }
  div{
    color:rgba(0,0,0,0.65)
  }

</style>
