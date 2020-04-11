<template>
  <div>
    <div class="scaffold-input">
      <div class="title">
        <span class="tip">上传文件</span>
        <span class>上传文件，系统即可自动识别文件中的分子</span>
      </div>

      <div class="input-conponent">
        <div class="input">
          <a-upload-dragger
            name="file"
            :multiple="false"
            action="/api/v1/get_pictures/"
            :beforeUpload="beforeUpload"
            :customRequest="customRequest"
            :headers="{'Content-Type': 'application/x-www-form-urlencoded'}"
            :showUploadList="showUploadList"
            :fileList="fileList"
            :remove="removeFile"
            @change="uploadChange"
          >
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox"/>
            </p>
            <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
            <p class="ant-upload-hint">支持扩展名：.pdf .jpg .png</p>
          </a-upload-dragger>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { showLoading, hideLoading } from "utils/loading";
export default {
  data() {
    return {
      fileList: [],
      showUploadList: true
    };
  },
  mounted(){
  },
  methods: {
    beforeUpload(file, fileList) {
      const reg = /\.(pdf|jpg|png)(\?.*)?$/;
      return new Promise((resolve, reject) => {
        if (reg.test(file.name)) {
          resolve();
        } else {
          this.$message.error(`请上传正确的文件格式`);
          reject(new Error("请上传正确的文件格式"));
        }
      });
    },
    customRequest(data) {
      //缺点在还没有进度条
      let reader = new FileReader();
      let name = data.file.name;
      reader.readAsDataURL(data.file);
      reader.onloadend = e => {
        let base64 = e.target.result;
        showLoading();
        axios({
          url: "/api/v1/get_pictures/",
          method: "post",
          data: {
            file_name: name,
            data: base64.split(",")[1]
          },
          headers: {
            "content-type": "application/json" // 默认值
          }
        })
          .then(res => {
            console.log(res);
            this.fileList[0].status = "done";
            this.$store.commit("setData", res.data); //此处为空
            this.$router.push("/ocr/readPDF");
            hideLoading();
          })
          .catch(err => {
            hideLoading();
            this.$message({
              showClose: true,
              message: err,
              type: "error"
            });
          });
      };
    },
    uploadChange(info) {
      console.log(info);
      let fileList = info.fileList;
      fileList = fileList.slice(-1);
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
      } else if (info.file.status === "error") {
      }
      this.fileList = fileList;
    },
    removeFile(e) {
      console.log(e);
      //是否需要添加，remove下方的smile
      return true;
    }
  }
};
</script>
<style lang="scss" scoped>
.scaffold-input {
  margin: 24px 24px;
  background: #fff;
  padding: 16px 16px;
}
.tip {
  font-weight: bold;
  margin-right: 20px;
  color: rgba(0, 0, 0, 0.85);
}
.input {
  margin-top: 10px;
}
.input-conponent {
  //   background: rgb(249,249,249);
  padding: 24px 16px;
}
</style>

