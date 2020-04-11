<template>
  <div>
    <!-- <div>
      <span>上传文件：</span>
      <span style="font-size:13px;">系统暂仅支持不含侧链的骨架的衍生，含侧链骨架的生成功能正在开发中。</span>
    </div>-->
    <div class="input">
      <a-upload-dragger
        name="file"
        :multiple="false"
        action="/molecule/innovation/file/smiles"
        :beforeUpload="beforeUpload"
        :customRequest="customRequest"
        :headers="{'Content-Type': 'application/x-www-form-urlencoded'}"
        :showUploadList="showUploadList"
        :fileList="fileList"
        :remove="removeFile"
        @change="uploadChange"
        class="fileupload"
      >
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
        <p class="ant-upload-hint">支持扩展名：.sdf .mol .smi.</p>
      </a-upload-dragger>
       <div class="fixed-point">
          <a-icon type="info-circle" />
          <span>
           当上传的文件包含多个分子时，将默认使用第一个分子
          </span>
        </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import http from "utils/http";
import util from "utils/util";
import API from "service/apis";
export default {
  data() {
    return {
      fileList: [],
      showUploadList: true
    };
  },
  props: {
    cleanfill: {}
  },
  watch: {
    cleanfill: function(val) {
      this.fileList = [];
    }
  },
  methods: {
    beforeUpload(file, fileList) {
      const reg = /\.(sdf|mol|smi)(\?.*)?$/;
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
      let formdata = new FormData();
      formdata.append("file", data.file);
      this.file_show = data.file.name;
       this.behind_name = data.file.name.lastIndexOf('.');
        if(data.file.name.substring(this.behind_name) === '.sdf'){
           this.type = 1;  
        }else if(data.file.name.substring(this.behind_name) === '.mol'){
            this.type = 2;
        }else if(data.file.name.substring(this.behind_name) === '.smi'){
            this.type = 3;
        }
      http
          .axiospost(API.apis.innovationfile+"?type="+this.type, formdata)
          .then(res => {
            if (+res.code === 200 || +res.code === 201) {
              // console.log(111,res.data.smiles);
              // this.smileId = res.data.refSmilesId;
              this.fileList[0].status = "done";
            this.$emit("getSmiles", res.data.smiles);
            } else {
             this.$message({
                showClose: true,
                message: '分子格式不正确',
                type: "error"
              });
            }
          })
          .catch(err => {
           this.$message({
                showClose: true,
                message: '系统错误，请稍后重试',
                type: "error"
              });
          });
    },
    uploadChange(info) {
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
      this.$emit("getSmile", "");
      //是否需要添加，remove下方的smile
      return true;
    }
  }
};
</script>
<style lang="scss" scoped>
.fileupload /deep/ .ant-upload-drag-container{
  // background-color: red;
  width:29%;
}
.fixed-point {
  color: rgba(0, 0, 0, 0.3);
  font-size: 14px;
  margin-top: 18px;
  margin-bottom: 10px;
  span {
    margin-left: 5px;
  }
}
.input {
  margin-top: 10px;
  // margin-left:70px;
}
</style>
