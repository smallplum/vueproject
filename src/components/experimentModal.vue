<template>
  <a-modal
    title="记录实验结果"
    :visible="isModalshow"
    :confirmLoading="confirmloading"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button
        key="submit"
        type="primary"
        :loading="confirmloading"
        :disabled="disabledButton"
        @click="submitOpt"
      >确定</a-button>
    </template>
    <div class="modal-container">
      <span class="modal-container-title">
        <span>{{metaData.name}}：</span>
      </span>
      <a-input
        class="modal-container-content"
        v-if="isInputshow"
        :defaultValue="this.metaData.experiment
        ? this.metaData.experiment
        :'' "
        v-model="inputvalue"
        placeholder="请输入实验结果"
        @change="inputValue"
      />
      <a-select
        class="modal-container-content"
        v-if="!isInputshow"
        :getPopupContainer="triggerNode => triggerNode.parentNode"
        :defaultValue="this.metaData.experiment
        ? [this.metaData.experiment]
        : []"
        placeholder="请选择实验结果"
        @change="selectValue"
      >
        <a-select-option
          v-for="(experiment,index) in experiments"
          :key="index"
          :value="experiment.value"
        >{{experiment.name}}</a-select-option>
      </a-select>
    </div>
    <div class="modal-container">
      <span class="modal-container-title">
        <span>详细描述：</span>
      </span>
      <a-textarea
        :defaultValue="this.metaData.experimentDetail
        ? this.metaData.experimentDetail
        : ''"
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
import { experimentSelect } from "mock/mockData";

export default {
  name: "experimentModal",
  props: ["metaData"],
  data() {
    return {
      selectvalue: "",
      inputvalue: "",
      experimentvalue: "",
      defaultSelectValue: [],
      defaultInputValue: "",
      defaultTextValue: "",
      isModalshow: true,
      isInputshow: false,
      disabledButton: true,
      confirmloading: false,
      metaOptions: {},
      experiments: []
    };
  },
  mounted() {
    this.init();
    this.getSelectOptions();
  },
  methods: {
    init() {
      if (this.metaData.experiment) {
        this.selectvalue = this.metaData.experiment;
        this.inputvalue = this.metaData.experiment;
      }
      if (this.metaData.experiment) {
        this.experimentvalue = this.metaData.experimentDetail;
      }
      if (this.metaData.experiment) {
        this.disabledButton = false;
      }
    },
    getSelectOptions() {
      showLoading();
      http
        .axiosget(API.apis.experimentpredictselect)
        .then(res => {
          this.metaOptions = res.data;
          const currentKey = this.metaData.key;
          if (this.metaOptions[currentKey]) {
            this.generateOptions(this.metaOptions[currentKey]);
          } else {
            this.isInputshow = true;
          }
          hideLoading();
        })
        .catch(err => {
          this.$message.error("系统错误，请稍后重试");
          hideLoading();
        });
    },
    generateOptions(arr) {
      Object.keys(arr).map(item => {
        this.experiments.push({ name: arr[item], value: item });
      });
    },
    selectValue(value) {
      this.selectvalue = value;
      this.isButtonDisabled();
    },
    inputValue(e) {
      const re = /^[0-9.%]+$/g;
      if (re.test(e.target.value)) {
        this.inputvalue = e.target.value;
      } else {
        this.inputvalue =
          e.target.value.substring(0, this.inputvalue.length - 1) || "";
      }
      this.isButtonDisabled();
    },
    onDetailchange(e) {
      this.experimentvalue = e.target.value;
      this.isButtonDisabled();
    },
    isButtonDisabled() {
      if (this.isInputshow) {
        if (this.inputvalue.length !== 0 || this.inputvalue) {
          this.disabledButton = false;
        } else {
          this.disabledButton = true;
        }
      } else {
        if (this.selectvalue.length !== 0) {
          this.disabledButton = false;
        } else {
          this.disabledButton = true;
        }
      }
    },
    handleCancel() {
      this.isModalshow = false;
      this.$emit("showModal", false);
    },
    submitOpt() {
      this.confirmloading = true;
      const storageSmiles = window.sessionStorage.getItem(
        "current-molecule-smiles"
      );

      // console.log(storageSmiles, "storageSmiles======");
      const params = {
        smiles: storageSmiles,
        key: this.metaData.key,
        value: this.isInputshow ? this.inputvalue : this.selectvalue,
        detail: this.experimentvalue
      };
      const re = /^[0-9.%]+$/g;
      if (this.isInputshow && !re.test(params.value)) {
        this.$message.error(
          "实验结果仅支持输入数字、小数点、百分数格式，请重新输入"
        );
        this.confirmloading = false;
        return;
      } else {
        http
          .axiospost(API.apis.experimentsave, params)
          .then(res => {
            if (+res.code === 200 || +res.code === 201) {
              this.$message.success("保存成功");
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
