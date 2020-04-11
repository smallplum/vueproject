<template>
  <div class="container" v-if="ifTableshow">
    <div class="result-container">
      <div class="result-title">检测结果</div>
      <div class="result-body">
        <div class="result-body-title">
          <div class="result-body-title-header">从上传的文件中，系统共识别出{{total}}个分子。</div>
          <div class="right-body">
            <div
              class="result-body-title-download"
              v-if="showListcount"
              @click="sdfdownloadMoculeList"
            >
              <a :href="downloadHref">
                <a-icon type="download" />下载sdf
              </a>
            </div>
            <div
              class="result-body-title-download"
              v-if="showListcount"
              @click="csvdownloadMoculeList"
            >
              <a :href="downloadHref">
                <a-icon type="download" />下载csv
              </a>
            </div>
            <div
              class="result-body-title-download"
              v-if="showListcount"
              @click="downloadMoculeList"
            >
              <a :href="downloadHref">
                <a-icon type="download" />下载excel
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-tabs
      v-show="ifTableshow"
      tabPosition="top"
      :activeKey="activeKey"
      defaultActiveKey="1"
      class="result-body-tab"
      @change="changeTabs"
    >
      <a-tab-pane tab="分子列表" key="1" v-if="showListcount">
        <result-table></result-table>
      </a-tab-pane>
      <a-tab-pane tab="原文件" key="2">
        <result-file v-if="ifFileShow"></result-file>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import eventVue from "../event.js";
import http from "utils/http";
import API from "service/apis";
import resultFile from "./resultFile";
import resultTable from "./resultTable";
import { showLoading, hideLoading } from "utils/loading";

export default {
  name: "result",
  props: ["tableData"],
  components: {
    "result-file": resultFile,
    "result-table": resultTable
  },
  computed: {},
  watch: {},
  data() {
    return {
      metaData: null,
      downloadHref: "",
      activeKey: "1",
      total: 0,
      showListcount: true,
      ifTableshow: false,
      ifFileShow: false
    };
  },
  mounted() {
    this.getInitData();
  },

  methods: {
    getInitData() {
      eventVue.$off("passtabledata");
      this.ifTableshow = false;
      eventVue.$on("passtabledata", page => {
        eventVue.$emit("getparentdata");
        this.ifTableshow = true;
        this.changeTabs(page);
      });
      eventVue.$off("passfiledata");
      eventVue.$on("passfiledata", () => {
        eventVue.$emit("getfileparentdata");
        this.ifFileShow = true;
      });
      eventVue.$off("passresultdata");
      eventVue.$on("passresultdata", data => {
        this.metaData = data;
        if (this.metaData) {
          this.total = this.metaData.allCount;
          if (+this.total === 0) {
            this.changeTabs("2");
          }
          this.showListcount = +this.total === 0 ? false : true;
        }
      });
      eventVue.$off("hideorigintable");
      eventVue.$on("hideorigintable", () => {
        this.ifTableshow = false;
      });
    },
   csvdownloadMoculeList() {
      showLoading();
      const param = { fileId: window.sessionStorage.getItem("uploadFileId") };
      this.downloadHref = `${
        API.apis.ocrfiledownloadcsv
      }?fileId=${window.sessionStorage.getItem("uploadFileId")}&sessionid=${JSON.parse(localStorage.getItem("user") ||'[]').sessionid}`;

      // http
      //   .axiosget(API.apis.ocrfiledownloadcsv, param)
      //   .then(res => {
          
      //     hideLoading();
      //   })
      //   .catch(err => {
      //     this.$message.error("系统错误，请稍后重试");
      //     hideLoading();
      //   });
    },
     sdfdownloadMoculeList() {
      showLoading();
      const param = { fileId: window.sessionStorage.getItem("uploadFileId") };
      this.downloadHref = `${
        API.apis.ocrfiledownloadsdf
      }?fileId=${window.sessionStorage.getItem("uploadFileId")}&sessionid=${JSON.parse(localStorage.getItem("user") ||'[]').sessionid}`;

      // http
      //   .axiosget(API.apis.ocrfiledownloadsdf, param)
      //   .then(res => {
      //     hideLoading();
      //   })
      //   .catch(err => {
      //     this.$message.error("系统错误，请稍后重试");
      //     hideLoading();
      //   });
    },
    downloadMoculeList() {
      showLoading();
      const param = { fileId: window.sessionStorage.getItem("uploadFileId") };
      this.downloadHref = `${
        API.apis.ocrfiledownload
      }?fileId=${window.sessionStorage.getItem("uploadFileId")}&sessionid=${JSON.parse(localStorage.getItem("user") ||'[]').sessionid}`;

      // http
      //   .axiosget(API.apis.ocrfiledownload, param)
      //   .then(res => {
      //     hideLoading();
      //   })
      //   .catch(err => {
      //     this.$message.error("系统错误，请稍后重试");
      //     hideLoading();
      //   });
    },

    changeTabs(e) {
      this.activeKey = e;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  .result-container {
    width: 100%;
    margin: 16px;
    .result-title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
    }
    .result-body {
      .result-body-title {
        display: flex;
        justify-content: space-between;
        margin: 16px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        .result-body-title-header {
          color: rgba(0, 0, 0, 0.65);
          line-height: 24px;
        }
        .right-body {
          width: 400px;
          display: flex;
          justify-content: space-between;
          .result-body-title-download {
            width: 100px;
            color: #1890ff;
            line-height: 22px;
            margin-right: 32px;
            cursor: pointer;
            text-decoration: none;
            a:focus {
              text-decoration: none;
            }
          }
        }
      }
    }
  }
  .result-body-tab {
    margin: 16px 32px;
  }
}
</style>
