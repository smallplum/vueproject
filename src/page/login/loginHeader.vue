<template>
 <!-- 头部导航栏 -->
      <div class = 'header-container'>
        <div class = 'header'>
          <div class ='nav'>
            <div class="logo"  @click="gwHandler">
                <img src="../../assets/img/home-logo.png"/>
            </div>
            <div class="link" >
              <!-- <span> 首页</span>
              <span> 技术优势</span>
              <span>产品服务</span> -->
            </div>
          </div>
        </div>
      </div>
</template>
<script >

export default {
  name: 'pageHeader',
  data() {
    return {
       account: JSON.parse(localStorage.getItem("user") ||'[]').username
    };
  },
  methods: {
    gwHandler(){
        window.location.href = 'http://www.stonewise.cn/'
    },
    // loginHandler(){
    //   this.$router.push('/login')
    // },
    // registerHandler(){
    //   this.$router.push('/register')
    // },
    // engHandler(){
    //   return false;
    // },
  
  }
};

</script>
<style lang="scss" scoped>
  .header-container{
    width: 100%;
    line-height: 1.5;
    background: url("/static/img/header-back.png") repeat-x 0 0;
    background-size: 100% auto;
    //需要对高度进行自适应调整
    // 图片不仅应平铺，更应该伸缩
  }
  //    header 部分
  .header{
    padding-bottom: 18px;
    padding-top: 18px;
    width: 70%;
    margin:0 auto
  }
  .nav{
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .logo{
      width: 250px;
      height: 40px;
      cursor: pointer;
      padding-right:100px;
      img{
        width: 100%;
      }
    }
    .link{
      color: #fff;
      cursor: pointer;
      letter-spacing:2px;
      font-size: 14px;
      span{
        display: inline-block;
        margin-left: 14px;
      }
    }
  }
  
</style>
  