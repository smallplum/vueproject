<template>
  <div>
    <div class="scaffold-input">
      <div class="title">
        <span class="tip">输入信息</span>
      </div>

      <div class="smile">
        <span>
          分子名称:
          <a-tooltip placement="right">
            <template slot="title">系统支持绘制结构式、上传文件和输入分子名称三种方式进行录入分子，</template>
            <a-icon type="info-circle" style="color:rgba(0,0,0,0.4)" />
          </a-tooltip>
        </span>
        <a-input placeholder="请输入分子名称或从下方选择其他输入方式" v-model="input" />
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
              @getSmile="getSmile(arguments)"
              :cleanfill="cleanfill"
              :showImg="true"
              :jsmeWidth="560"
              :jsmeHeight="300"
            ></jsme-input>
            <upload-input v-if="uploadShow" @getSmiles="getSmiles" :cleanfill="cleanfill"></upload-input>
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
import axios from "axios";
import http from "utils/http";
import util from "utils/util";
import API from "service/apis";
import targetSelect from "components/targetSelect.vue";
import jsmeInput from "components/jsmeInput.vue";
import uploadInput from "components/uploadInput.vue";

export default {
  inject: ["reload"],
  data() {
    return {
      target_select: "请选择靶标",
      smile_input: "",
      target_type: "",
      input: "",
      origin_smile: "",
      cleanfill: true,
      cleanselect: true,
      value: 1,
      fillShow: true,
      uploadShow: false,
      file_show: "",
      type: "",
      smileId: "",
      behind_name: "",
      task_id: "",
      jobname: "",
      headers: {
        authorization: "authorization-text",
        sessionid: JSON.parse(localStorage.getItem("user") || "[]").sessionid
      }
    };
  },
  components: {
    "jsme-input": jsmeInput,
    "target-select": targetSelect,
    "upload-input": uploadInput
  },
  created() {},
  mounted() {},
  watch: {
    input: function(val) {
      if (val != this.smile_input) {
        this.cleanfill = !this.cleanfill;
      }
    }
  },
  methods: {
    clean() {
      this.target_select = "请选择靶标";
      this.cleanselect = !this.cleanselect;
      this.smile_input = "";
      this.input = "";
      this.cleanfill = !this.cleanfill;
      this.jobname = "";
      this.file_show = "";
      this.smileId = "";
    },
    onChange(e) {
      // console.log("radio checked", e.target.value);
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

    getSmiles(smile) {
      // console.log(smile);
      this.smile_input = smile;
      this.input = this.smile_input;
    },
    getSmile(smile, file, new_smile) {
      if (arguments[0][2] === "") {
        this.origin_smile = "";
      } else {
        this.origin_smile = arguments[0][2];
        // console.log(this.origin_smile);
      }
      this.smile_input = arguments[0][0];
      this.input = this.smile_input;

      // console.log(this.input,this.origin_smile);
    },
    submit() {
      this.$router.push({
        path: "/search/skeletonDerivation",
       
      });
    }
  }
};
</script>
<style lang="scss" scoped>
// .conformation /deep/ .ant-tooltip-placement-right{
//   max-width: 250px;
//   padding-left: 8px;
// }
.home-page {
  width: 100%;
  background-color: rgb(240, 242, 245);
  text-align: left;
}
.fixed-point {
  color: rgba(0, 0, 0, 0.3);
  font-size: 14px;
  margin-top: 4px;
  margin-bottom: 10px;
  span {
    margin-left: 10px;
    img {
      width: 20px;
      height: 20px;
    }
  }
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
  margin-right: 5px;
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
    display: block;
    margin-bottom: 24px; //全部改成24px
  }
  .title {
    display: flex;
    align-items: center;
  }
  .tip {
    font-weight: bold;
    margin-right: 20px;
    color: rgba(0, 0, 0, 0.85);
  }
  .title:before {
    content: " ";
    display: inline-block;
    height: 20px;
    width: 14px;
    background: #1890ff; /**控制图标颜色**/
    margin-right: 6px; /**图标与文字距离**/
  }
  //没有div的margin-bottom
  .target {
    padding-left: 16px;
    margin-bottom: 0px;
  }
  .scaffold {
    padding-left: 40px;
  }
  .input {
    display: flex;
    margin-bottom: 0px;
  }
  .target-select {
    margin-left: 19px;
  }
  .target-select /deep/ .ant-select-selection {
    width: 400px;
  }
  .target-select /deep/ .ant-select-selection-selected-value {
    opacity: 0.7 !important;
  }
  .conformation {
    margin-left: 29px;
    height: 32px;
    margin-bottom: 38px;
  }
  .infor-col {
    margin-left: -5px;
    color: rgba(0, 0, 0, 0.3);
  }
  .file_show {
    color: rgba(0, 0, 0, 0.3);
  }
  .smile {
    margin-left: 19px;
  }
  .smile :before {
    content: " *";
    color: red;
    font-size: 100%;
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
  margin-left: -5px;
}
.job {
  margin-left: 29px;
}
.job .ant-input {
  width: 400px;
  margin-left: -6px;
}
</style>

