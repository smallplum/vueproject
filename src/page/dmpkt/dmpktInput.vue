<template>
  <div>
    <div class="scaffold-input">
      <div class="title">
        <span class="tip">输入分子</span>
      </div>

      <div class="smile">
        <span>SMILES:</span>
        <a-input placeholder="请输入SMILES或从下方选择其他输入方式" v-model="inputsmile" />
      </div>

      <div class="scaffold">
        <div class="input">
          <span>其他输入方式:</span>
          <a-radio-group @change="onChange" v-model="value" style="margin-bottom:8px;">
            <a-radio :value="1">绘制结构式</a-radio>
            <a-radio :value="2">上传文件</a-radio>
            <!-- <a-radio :value="3">输入SMILES</a-radio> -->
          </a-radio-group>
        </div>
        <div class="input-conponent">
          <div class="conponent">
            <jsme-input
              v-if="fillShow"
              @getSmile="getSmile"
              :cleanfill="cleanfill"
              :showImg="true"
              :jsmeWidth="560"
              :jsmeHeight="300"
            ></jsme-input>
            <upload-input v-if="uploadShow" @getSmile="getSmile" :cleanfill="cleanfill"></upload-input>
          </div>
        </div>
      </div>
      <hr />
      <div class="enter">
        <a-button @click="clean" style="margin-right:8px;">清空</a-button>
        <a-button type="primary" class="enter-sub" @click="submit">
          <span style="color:#FFF">提交</span>
        </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import http from "utils/http";
import API from "service/apis";
import { showLoading, hideLoading } from "utils/loading";

import targetSelect from "components/targetSelect.vue";
import jsmeInput from "components/jsmeInput.vue";
import uploadInput from "components/uploadInput.vue";

import { detailData } from "mock/mockData";

export default {
  name: "skeletonDerivation",
  data() {
    return {
      target_select: "",
      smile_input: "",
      inputsmile: "",
      cleanfill: true,
      cleanselect: true,
      //input
      value: 1,
      fillShow: true,
      uploadShow: false
    };
  },
  mounted() {
    document.title = "DMPK_T预测-望石智慧";
  },
  components: {
    "jsme-input": jsmeInput,
    "target-select": targetSelect,
    "upload-input": uploadInput
  },
  created() {},
  watch: {
    inputsmile: function(val) {
      if (val != this.smile_input) {
        this.cleanfill = !this.cleanfill;
      }
    }
  },
  methods: {
    clean() {
      this.target_select = "";
      this.cleanselect = !this.cleanselect;
      this.smile_input = "";
      this.inputsmile = "";
      this.cleanfill = !this.cleanfill;
    },
    onChange(e) {
      if (e.target.value == 1) {
        this.uploadShow = false;
        this.fillShow = true;
      } else if (e.target.value == 2) {
        this.uploadShow = true;
        this.fillShow = false;
      } else if (e.target.value == 3) {
        this.uploadShow = false;
        this.fillShow = false;
      }
    },
    getSmile(smile) {
      this.smile_input = smile;
      this.inputsmile = this.smile_input;
    },

    submit() {
      showLoading();
      window.sessionStorage.setItem("current-molecule-smiles", this.inputsmile);
      let param = { smiles: this.inputsmile };
      http
        .axiospost(API.apis.moleculepredictdetail, param)
        .then(res => {
          if (+res.code === 200 || +res.code === 201) {
            this.$emit("getpredictdetail", res.data);
          } else {
            this.$message.error("系统错误，请稍后重试");
          }
          hideLoading();
        })
        .catch(err => {
          this.$message.error("系统错误，请稍后重试");
          hideLoading();
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.home-page {
  width: 100%;
  background-color: rgb(240, 242, 245);
  text-align: left;
}

.clearfloat {
  clear: both;
}
.menu {
  width: 17%;
  height: 100%;
  float: left;
  font-size: 15px;
  .back-home {
    padding: 10px 12px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    margin-bottom: 2px;
  }
}
span {
  margin-right: 8px;
}

hr {
  width: 99%;
  margin: 25px 7px;
  border: 0;
  height: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}
.right-content {
  float: right;
  width: 83%;
  .breadcrumb {
    padding: 10px 12px;
    background: #fff;
    margin-left: 2px;
  }
}
.scaffold-input {
  margin: 24px 24px;
  background: #fff;
  padding: 16px 16px;
  div {
    margin-bottom: 24px; //全部改成24px
  }
  .tip {
    font-weight: bold;
    margin-right: 20px;
    color: rgba(0, 0, 0, 0.85);
  }
  //没有div的margin-bottom
  .target {
    padding-left: 16px;
    margin-bottom: 0px;
  }
  .scaffold {
    padding-left: 48px;
  }
  .input {
    margin-bottom: 0px;
  }
  .smile {
    margin-left: 16px;
  }
  .input-conponent {
    // background: rgb(249,249,249);
    padding: 0px 0px;
    div {
      margin-bottom: 0px;
    }
    .conponent {
      width: 700px;
    }
  }
}
.enter {
  text-align: right;
}
</style>

<style>
.a-input {
  width: 400px;
}
.smile .ant-input {
  width: 400px;
}
</style>

