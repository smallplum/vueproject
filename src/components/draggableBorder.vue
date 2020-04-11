<template>
  <div>
    <div class="draggable-container-mask"></div>
    <div class="draggable-container" @mousedown="move">
      <span class="draggable-container-title">分子修正</span>
      <span class="draggable-container-close">
        <a-icon type="close" @click="closeContainer" />
      </span>
      <br />
      <span class="draggable-container-text">目前对缩写化学官能团的SMILES转换功能未完善，请您参照原文件人工加以修正，以确保下载正确SMILES.</span>
      <hr />
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "draggableBorder",
  methods: {
    move(e) {
      //鼠标按下并移动的事件
      let odiv = e.target; //获取目标元素
      if (odiv.id === "jsme-button") {
        return;
      }
      //算出鼠标相对元素的位置
      let disX = e.clientX - odiv.offsetLeft;
      let disY = e.clientY - odiv.offsetTop;
      document.onmousemove = e => {
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        //限定拖拽范围
        let width = Math.max(
          0,
          Math.min(left, document.body.clientWidth - 470)
        );
        let height = Math.max(
          0,
          Math.min(top, document.body.clientHeight - 430)
        );
        //移动当前元素
        odiv.style.left = width + "px";
        odiv.style.top = height + "px";
      };
      document.onmouseup = e => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    closeContainer() {
      this.$emit("closeDraggable");
    }
  }
};
</script>
<style lang="scss" scoped>
.draggable-container-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}
.draggable-container {
  position: fixed;
  top: 30%;
  left: 40%;
  width: 470px;
  min-height: 20px;
  padding: 10px;
  background: #ffffff;
  border: 1px solid #eeeeee;
  z-index: 9999;

  .draggable-container-title {
    font-size: 16px;
    line-height: 2;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    user-select: none;
  }
  .draggable-container-close {
    float: right;
    line-height: 2;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.5);
  }
  .draggable-container-text {
    font-size: 12px;
    color: red;
    user-select: none;
  }
}
</style>