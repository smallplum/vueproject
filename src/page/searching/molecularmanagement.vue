<template>
  <div class="box">
    <div class="welcome">
      <div class="logo">
        <img src="/static/img/await.png" />
      </div>
      <div class="text">
        <p class="wel">敬请期待......</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "molecularmanagement",
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
    bottom: 0px;
    padding: 16px 10px;
    .logo {
      width: 100%;
      height: 220px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 220px;
        height: 220px;
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
}
</style>