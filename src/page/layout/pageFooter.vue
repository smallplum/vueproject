<template>
  <div class ='footer-container'> 
    
    <!-- <div class ='footer-link'>
      <div class ='link-content'>
          <a > 骨架衍生 <span> | </span> </a>
          <a > 望石智慧<span> | </span></a>
          <a > 联系我们<span> | </span></a>
          <a href="http://www.stonewise.cn/"> 望石智慧官网</a>
      </div>
    </div> -->
    <div class ='footer-logo'>
      <div class ='logo-content'> 
          <div class="flogo"  @click="gwHandler">
            <img src="../../assets/img/home-logo.png"/>
            <span>北京望石智慧科技有限公司 Copyright©2018 Stonewise All Rights Reserved   |    京ICP备18054269号</span>
          </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name:'pageFooter',
  methods:{
     gwHandler(){
        window.location.href = 'http://www.stonewise.cn/'
    },
  }
}
</script>

<style lang="scss" scoped>
 .footer-container{
    clear: both;
    width: 100%;
    background-color: rgb(0, 0, 0);
  }
  .footer-link{
    width: 100%;
    background-color: rgb(13, 31, 55);

    .link-content{
        width:70%;
        margin: 0px auto;
        padding-top: 10px;
        padding-bottom: 10px;
        text-align:left; 
        a{
            color:rgb(238, 247, 255);
            padding-right:8px;
        }
        span{
             padding-right:8px;
        }
    }
  }
  // 需要修改其盖度自适应问题
  .footer-logo{
    clear:both;
    width: 100%;
    background-color: rgb(0, 0, 0);

    .logo-content{
      padding-top: 20px;
      padding-bottom: 30px;
      width:70%;
      margin: 0px auto;
        .flogo{
            img{
                float:left;
                width: 100px;
                height: 30px;
            }
            color:rgb(238, 247, 255);
            span{
                display:inline-block;
                margin-top:5px;
            }
        }
     }
  }
  
</style>


     