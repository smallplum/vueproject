<template>
  <div class="popover">
    <a-popover
      placement="top"
      :getPopupContainer="trigger => trigger.parentElement"
      trigger="click"
      @visibleChange="getPosition"
      v-model="visible"
    >
      <div class="canvasbox" :style="borderStyle"></div>
      <template slot="content">
        <div class="popover-container">
          <img :src="metaData.url" />
          <div class="popover-text">
            <div class="popover-text-item">
              <span>分子式：</span>
              <span>{{metaData.formula}}</span>
            </div>
            <div class="popover-text-item">
              <span>SMILES：</span>
              <span>{{metaData.smiles}}</span>
            </div>
          </div>

          <div class="popover-icon">
            <div class="blue-icon" @click="showFeedbackModal(metaData)">
              <a-icon type="file-sync" />
              <span>分子修正</span>
            </div>
            <div class="blue-icon" @click="showDeleteModal(metaData)">
              <a-icon type="delete" />
              <span>列表删除</span>
            </div>
          </div>
        </div>
      </template>
    </a-popover>
    <draggable-border v-if="showDraggablemodal" @closeDraggable="handleCancel">
      <slot>
        <div class="draggable-jsme">
          <jsme-input
            v-if="showDraggablemodal"
            :meta-data="feedBackData"
            :showImg="false"
            @getSmile="getSmile"
            :cleanfill="cleanfill"
            :jsmeWidth="430"
            :jsmeHeight="300"
          ></jsme-input>
        </div>
      </slot>
    </draggable-border>
  </div>
</template>
<script>
import http from "utils/http";
import util from "utils/util";
import API from "service/apis";
import jsmeInput from "components/jsmeInput.vue";
import draggableBorder from "components/draggableBorder.vue";

import { showLoading, hideLoading } from "utils/loading";

export default {
  name: "ocrtestBorder",
  props: ["moleculeData"],
  components: {
    "jsme-input": jsmeInput,
    "draggable-border": draggableBorder
  },
  created() {},
  mounted() {
    window.addEventListener("scroll", this.initScroll, false);
    this.drawRect(this.metaData);
  },
  watch: {
    moleculeData(val) {
      this.metaData = val;
    }
  },

  data() {
    return {
      metaData: this.moleculeData,
      currentTop: 0,
      visible: false,
      /// Start feedback popup ////
      showFeedbackmodal: false,
      showDraggablemodal: false,
      cleanfill: true,
      feedBackData: {},
      //// End feedback popup ////
      borderStyle: {}
    };
  },
  methods: {
    drawRect(data) {
      let position = data.position;

      let imgWidth = data.originPngWidth || 1699;
      let imgHeight = data.originPngHeight || 2200;
      let currentWidth = Math.round(document.body.scrollWidth * 0.83 * 0.79);

      let maxWidth = 773;
      let maxHeight = 1000;

      let ratio = 1;
      if (imgWidth > 773) {
        ratio = maxWidth / imgWidth;
      }

      let currentimgWidth = `${(position[2] - position[0]) * ratio}px`;
      let currentimgHeight = `${(position[3] - position[1]) * ratio}px`;
      let currentimgLeft = `${Number(position[0] * ratio) + 152}px`;
      let currentimgTop = `${Number(position[1] * ratio) + 20}px`;

      // console.log(
      //   currentWidth,
      //   ratio,
      //   position,
      //   currentimgWidth,
      //   currentimgHeight,
      //   currentimgLeft,
      //   currentimgTop,
      //   "==size"
      // );

      this.borderStyle = {
        width: currentimgWidth,
        height: currentimgHeight,
        position: "absolute",
        left: currentimgLeft,
        top: currentimgTop
      };
    },
    regaindata() {
      this.$emit("regainfiledata");
    },
    initScroll(e) {
      this.currentTop = document.documentElement.scrollTop;
    },
    getPosition(visible) {
      if (visible) {
        window.sessionStorage.setItem("molePosition", this.currentTop);
      }
    },

    //////////<--------Start feedback popup---------------->////////
    showFeedbackModal(data) {
      this.showDraggablemodal = true;
      this.feedBackData = data;
      this.visible = false;
    },
    showDeleteModal(data) {
      const param = {
        fileMoleculeId: data.fileMoleculeId
      };
      this.visible = false;
      http
        .axiospost(API.apis.ocrfileinvalid, param)
        .then(res => {
          if (+res.code === 200) {
            this.regaindata();
            this.$message.success("分子删除成功");
          } else {
            this.$message.error("分子删除失败，请稍后重试");
            hideLoading();
          }
        })
        .catch(() => {
          this.$message.error("系统错误，请稍后重试");
          hideLoading();
        });
    },
    handleCancel() {
      this.feedBackData = {};
      this.cleanfill = !this.cleanfill;
      this.showDraggablemodal = false;
    },
    getSmile(smile, jmefile) {
      this.feedBackData.jme = jmefile;
      this.feedBackData.smiles = smile;
      this.submitOpt();
    },
    submitOpt() {
      const param = {
        jme: this.feedBackData.jme,
        fileMoleculeId: this.feedBackData.fileMoleculeId,
        smiles: this.feedBackData.smiles
      };
      showLoading();
      this.handleCancel();
      http
        .axiospost(API.apis.ocrfeeback, param)
        .then(res => {
          if (+res.code === 200) {
            this.$message.success("分子修正成功");
            this.regaindata();
            hideLoading();
          } else {
            this.$message.error("分子修正失败，请检查分子合理性");
            this.regaindata();
            hideLoading();
          }
        })
        .catch(err => {
          this.$message.error("系统错误，请稍后重试");
          hideLoading();
        });
    }
    //////////<--------End feedback popup---------------->////////
  }
};
</script>

<style lang="scss" scoped>
.canvasbox {
  border: 1px solid #1890ff;
  cursor: pointer;
  animation-name: fadeIn;
  animation-timing-function: ease-in-out;
  animation-duration: 1s;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.popover-container {
  width: 228px;
  img {
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.09);
  }
  .popover-text {
    padding: 15px;
    .popover-text-item {
      display: flex;
      justify-content: space-between;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      text-align: right;
      :nth-child(1) {
        min-width: 65px;
        text-align: left;
      }
      span {
        max-width: 120px;
        margin-bottom: 8px;
        word-break: break-all;
      }
    }
  }
  .popover-icon {
    display: flex;
    justify-content: space-between;
    padding-top: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.09);
    font-family: PingFangSC-Regular;
    font-size: 14px;
    text-align: left;
    line-height: 22px;
    .blue-icon {
      color: #1890ff;
      :hover {
        cursor: pointer;
      }
    }
  }
}
.draggable-jsme {
  padding: 0 0 10px 10px;
}
</style>

