<template>
  <a-modal
    title="反馈"
    :visible="isModalshow"
    :confirmLoading="confirmloading"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="confirmloading" @click="submitOpt">确定</a-button>
    </template>
    <div class="modal-container">
      <span class="modal-container-title">
        <span>识别结果：</span>
      </span>
      <a-radio-group
        :options="plainOptions"
        @change="collectRadiovalue"
        :defaultValue="defaultRadioValue"
      />
    </div>
    <div class="modal-container">
      <span class="modal-container-title">
        <span>详细描述：</span>
      </span>
      <a-textarea
        :defaultValue="defaultInputValue"
        @change="onDetailchange"
        placeholder="请输入详细描述"
        :rows="4"
      />
    </div>
  </a-modal>
</template>

<script>
import axios from "axios";
import http from "utils/http";
import API from "service/apis";
import { showLoading, hideLoading } from "utils/loading";

const plainOptions = [{ label: "正确", value: 1 }, { label: "错误", value: 0 }];

export default {
  name: "feedbackModal",
  props: ["metaData"],
  data() {
    return {
      radiovalue: null,
      inputvalue: null,
      defaultRadioValue: this.metaData.feedback
        ? this.metaData.feedback.ocsrResult
        : 1,
      defaultInputValue: this.metaData.feedback
        ? this.metaData.feedback.ocsrResultDesc
        : "",
      plainOptions,
      isModalshow: true,
      isInputshow: false,
      confirmloading: false
    };
  },
  mounted() {},
  methods: {
    collectRadiovalue(e) {
      this.radiovalue = e.target.value;
    },
    onDetailchange(e) {
      this.inputvalue = e.target.value;
    },

    handleCancel() {
      this.isModalshow = false;
      this.$emit("showModal", false);
    },
    submitOpt() {
      this.confirmloading = true;
      const fileId = window.sessionStorage.getItem("uploadFileId");
      const params = {
        fileId: fileId,
        smiles: this.metaData.smiles,
        ocsrResult:
          JSON.stringify(this.radiovalue) !== "null"
            ? this.radiovalue
            : this.defaultRadioValue,
        ocsrResultDesc:
          JSON.stringify(this.inputvalue) !== "null"
            ? this.inputvalue
            : this.defaultInputValue
      };
      http
        .axiospost(API.apis.ocrfeeback, params)
        .then(res => {
          if (+res.code === 200 || +res.code === 201) {
            this.$message.success("反馈成功");
            this.$emit("regaindata");
            this.confirmloading = false;
            this.$emit("showModal", false);
          } else {
            this.$message.error(res.info || "系统错误，请稍后重试");
            this.confirmloading = false;
          }
        })
        .catch(err => {
          this.$message.error("系统错误，请稍后重试");
          this.confirmloading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-container {
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  .modal-container-title {
    min-width: 25%;
  }
  .modal-container-content {
    min-width: 75%;
  }
}
</style>
