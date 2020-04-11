<template>
  <div class="box">
    <div class="welcome">
      <div class="logo">
        <img src="/static/img/index.png" />
      </div>
      <div class="text">
        <p class="wel">欢迎使用分子设计平台</p>
      </div>
    </div>
  
  </div>
</template>

<script>
export default {
  name: "homepage",
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  .welcome {
    width: 96%;
    margin: 24px 24px;
    background: #fff;
    // height:90%;
    position: absolute;
    top: 0;
    bottom: 20px;
    padding: 16px 10px;
    .logo {
      width: 100%;
      height: 220px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        margin: 0 auto;
      }
    }
    .text {
      width: 100%;
      height: 250px;
      .wel {
        font-size: 48px;
        color: #2a85c5;
        text-align: center;
        margin-bottom: 20px;
      }
      .select {
        font-size: 28px;
        color: #2a85c5;
        text-align: center;
      }
    }
  }
  .flogo {
    position: absolute;
    bottom: 0px;
    left: 50%;
    transform: translate(-50%);
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    line-height: 20px;
  }
}
</style>