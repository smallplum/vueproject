<template>
  <div class="upload-container">
    <div class="upload-title">上传文件</div>
    <div class="upload-body">
      <a-upload-dragger
        name="file"
        :supportServerRender="true"
        action="/molecule/ocsr/file"
        :customRequest="customRequest"
        :showUploadList="{showRemoveIcon:showRemoveIcon}"
        @change="handleUploadChange"
        :beforeUpload="beforeUpload"
        :fileList="fileList"
        :remove="removeFile"
        class="fileupload"
      >
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
        <p class="ant-upload-hint">支持扩展名：.pdf .jpg .png</p>
      </a-upload-dragger>
    </div>
    <div class="upload-button" v-show="showOcrbutton">
      <a-button
        type="primary"
        :loading="showButtontestLoading"
        :disabled="distestOcrbutton"
        @click="testOcrfile"
      >{{ocrText}}</a-button>
    </div>
  </div>
</template>
<script>
import eventVue from "../event.js";
import http from "utils/http";
import API from "service/apis";
import { showLoading, hideLoading } from "utils/loading";
import { ocrUpload } from "mock/mockData";

export default {
  name: "upload",
  data() {
    return {
      fileList: [],
      uploadInfo: {},
      showOcrbutton: false,
      disUpload: true,
      distestOcrbutton: false, //是否禁用检测按钮
      showRemoveIcon: false, //是否展示取消按钮
      showButtontestLoading: false,
      fileId: "",
      ocrText: "开始检测"
    };
  },
  methods: {
    beforeUpload(file, fileList) {
      const reg = /\.(pdf|jpg|jpeg|png)(\?.*)?$/;
      return new Promise((resolve, reject) => {
        if (reg.test(file.name)) {
          resolve();
        } else {
          // this.$message.error(`请上传正确的文件格式`);
        }
        if (fileList.length <= 1) {
          this.disUpload = false;
          resolve();
        } else {
          this.disUpload = true;
        }
      });
    },
    handleUploadChange(info) {
      this.uploadInfo = info;
      const status = info.file.status;
      if (this.disUpload) {
        this.fileList = [];
        return;
      } else {
        this.fileList = [...info.fileList];
        this.fileList = this.fileList.slice(-1);
        if (status === "uploading" || status === "error") {
          this.showRemoveIcon = true;
          this.distestOcrbutton = true;
        } else if (status === "done") {
          this.showRemoveIcon = false;
          this.distestOcrbutton = false;
          this.showOcrbutton = true;
        } else if (status === "removed") {
          this.showRemoveIcon = false;
          this.distestOcrbutton = true;
          this.ocrText = "开始检测";
          this.showOcrbutton = false;
        }
      }
    },
    removeFile() {
      this.$message.warning("上传取消");
    },

    customRequest(data) {
      this.fileList = [];
      this.showOcrbutton = true;
      let formdata = new FormData();
      formdata.append("file", data.file);
      if (!this.disUpload) {
        http
          .axiospost(API.apis.ocrfileupload, formdata)
          .then(res => {
            if (+res.code === 200 || +res.code === 201) {
              // res.data.fileId = 58;
              window.sessionStorage.setItem("uploadFileId", res.data.fileId);
              this.fileId = res.data.fileId;
              this.uploadInfo.fileList[0].status = "done";
              this.uploadInfo.file.status = "done";
              this.handleUploadChange(this.uploadInfo);
              eventVue.$emit("hideorigintable");
              this.ocrText = "开始检测";
              this.showButtontestLoading = false;
            } else {
              this.$message.error(res.info || "系统错误，请稍后重试");
              this.uploadInfo.fileList[0].status = "error";
              this.uploadInfo.file.status = "error";
              this.handleUploadChange(this.uploadInfo);
              this.showOcrbutton = false;
              this.fileList = [];
            }
          })
          .catch(err => {
            this.$message.error("系统错误，请稍后重试");
            this.showOcrbutton = false;
            this.fileList = [];
          });
      } else {
        this.showOcrbutton = false;
        setTimeout(() => {
          this.$message.error("只支持上传单张文件");
        }, 300);
      }
    },

    testOcrfile() {
      window.sessionStorage.removeItem("molePosition");
      this.showButtontestLoading = true;
      this.ocrText = "检测中";

      eventVue.$emit("passtabledata", "1");
      eventVue.$emit("passfiledata");

      eventVue.$on("receivefromtable", () => {
        this.ocrText = "重新检测";
        this.showButtontestLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.fileupload /deep/ .ant-upload-drag-container{
  // background-color: red;
  width:29%; 
  height: 192px;
}
.upload-container {
  margin: 16px;
  .upload-title {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }
  .upload-body {
    width: 560px;
    height: 195px;
    margin: 16px 32px;
  }
  .upload-button {
    margin: 50px 30px 10px;
  }
}
</style>

