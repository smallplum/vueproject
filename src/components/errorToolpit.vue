<template>
  <div class="abnormal-toolpit">
    <div v-if="contentType==='error'">
      <a-icon class="toolpit-icon error-toolpit-icon" theme="filled" type="close-circle" />
      <span class="toolpit-text">系统错误，请稍后重试</span>
    </div>
    <div v-if="contentType==='empty'">
      <a-icon type="meh" class="toolpit-icon" />
      <!-- <a-icon class="error-toolpit-icon" theme="filled" type="close-circle" /> -->
      <span class="toolpit-text">暂无数据</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "errorToolpit",
  props: ["type"],
  data() {
    return {
      contentType: this.type
    };
  }
};
</script>


<style lang="scss" scoped>
.abnormal-toolpit {
  width: 100%;
  display: inline-block;
  text-align: center;
  margin: 60px auto;
  .toolpit-icon {
    margin-right: 4px;
    border: none;
  }
  .toolpit-text {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    letter-spacing: 0;
    text-align: left;
    line-height: 22px;
  }
  .error-toolpit-icon {
    color: #f5222d;
  }
}
</style>

