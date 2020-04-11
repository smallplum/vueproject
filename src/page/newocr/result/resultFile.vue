<template>
  <a-tabs
    tabPosition="left"
    :activeKey="activeKey"
    @change="changeTabs"
    forceRender="true"
    :tabBarStyle="tabBarstyle"
    v-if="showFileimg"
  >
    <a-tab-pane :tab="`Page ${ocrfile.page}`" v-for="(ocrfile,index) in ocrList" :key="index+1">
      <div class="tabpane-background">
        <img :src="ocrfile.filePathName" id="ocrimg" @load="showOcrtest" />
        <ocrtest-rect
          v-show="showocrtest"
          v-for="(singleocr,index) in ocrfile.fileMolecules"
          :key="index"
          :molecule-data="singleocr"
          @regainfiledata="regainfiledata"
        ></ocrtest-rect>
      </div>
    </a-tab-pane>
  </a-tabs>
</template>
<script>
import eventVue from "../event.js";
import http from "utils/http";
import API from "service/apis";
import feedbackModal from "components/feedbackModal";
import ocrtestBorder from "modules/ocrtestBorder";
import { showLoading, hideLoading } from "utils/loading";
import { ocrUpload, ocrIdentify } from "mock/mockData";

export default {
  name: "resultFile",
  components: {
    "feedback-modal": feedbackModal,
    "ocrtest-rect": ocrtestBorder
  },
  data() {
    return {
      fileId: "",
      ocrList: [],
      showFileimg: false,
      showocrtest: false,
      preHeight: 0,
      tabBarstyle: {
        height: "800px"
      },
      activeKey: 1,
      visible: false,
      showFeedbackmodal: false,
      feedBackData: {}
    };
  },
  created() {
    this.initData();
  },
  mounted() {
    this.changeTabs(1);
    this.getMetaData();
  },

  methods: {
    initData() {
      eventVue.$off("getfileparentdata");
      eventVue.$on("getfileparentdata", () => {
        this.getMetaData();
      });
    },

    scroll() {
      let resetTop = window.sessionStorage.getItem("molePosition");
      window.scrollTo({
        top: resetTop,
        left: 0,
        behavior: "smooth"
      });
    },
    regainfiledata() {
      this.getMetaData();
      eventVue.$emit("passtabledata", "2");
    },
    changeTabs(e) {
      this.activeKey = e;
      window.sessionStorage.setItem("currentTab", e);
      this.showocrtest = false;
      setTimeout(() => {
        this.showocrtest = true;
      }, 500);
    },
    showOcrtest() {
      this.showocrtest = false;
      setTimeout(() => {
        this.showocrtest = true;
      }, 300);
    },

    getMetaData() {
      showLoading();
      let currentTab = window.sessionStorage.getItem("currentTab");
      this.showFileimg = false;
      this.fileId = window.sessionStorage.getItem("uploadFileId");
      const param = { fileId: this.fileId };
      http
        .axiosget(API.apis.ocrfileindentify, param)
        .then(res => {
          if (+res.code === 200) {
            this.ocrList = res.data;
            this.changeTabs(Number(currentTab) || 1);
            this.showFileimg = true;
            hideLoading();
          } else {
            this.$message.error(res.info || "系统错误，请稍后重试");
            hideLoading();
          }
          setTimeout(() => {
            eventVue.$emit("receivefromtable");
            this.scroll();
            hideLoading();
          }, 300);
        })
        .catch(err => {
          this.$message.error("系统错误，请稍后重试");
          eventVue.$emit("receivefromtable");
          hideLoading();
        });
    },
    showFeedbackModal(data) {
      this.showFeedbackmodal = true;
      this.feedBackData = data;
      this.visible = false;
    },
    showModal(show) {
      this.showFeedbackmodal = show;
    }
  }
};
</script>

<style lang="scss" scoped>
.tabpane-background {
  background: #fafafa;
  padding: 24px 27px;
  width: 100%;
  height: 100%;
  img {
    max-width: 773px;
  }
}
.canvas-border {
  border: 1px solid #1890ff;
  .canvas {
    cursor: pointer;
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
    padding-top: 24px;
    border-top: 1px solid rgba(0, 0, 0, 0.09);
    font-family: PingFangSC-Regular;
    font-size: 14px;
    text-align: left;
    line-height: 22px;
    .popover-icon-feedback {
      color: #1890ff;
      cursor: pointer;
    }
  }
}
</style>