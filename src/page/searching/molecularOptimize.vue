<template>
  <div>
    <div class="scaffold-input">
      <div class="title">
        <span class="tip">修改分子</span>
        
      </div>


      <div class="smile">
        <span>
          分子名称:
         
        </span>
        <a-input placeholder="请输入SMILES或从下方选择其他输入方式" v-model="input" />
      </div>

      <div class="scaffold">
        <div class="input">
          <span>其他输入方式:</span>
          <a-radio-group @change="onChange" v-model="value" style="margin-bottom:8px;">
            <a-radio :value="1">绘制结构式</a-radio>
            <a-radio :value="2">上传文件</a-radio>
          </a-radio-group>
        </div>
        <div class="input-conponent">
          <div class="conponent">
            <jsme-input
              v-if="fillShow"
              :cleanfill="cleanfill"
              @getSmile="getSmile"
              :showImg="true"
              :jsmeWidth="560"
              :jsmeHeight="300"
            ></jsme-input>
            <upload-input v-if="uploadShow" :cleanfill="cleanfill" @getSmiles="getSmiles"></upload-input>
            <!-- <smileInput></smileInput> -->
          </div>
        </div>
      </div>


      <hr />
      <div class="enter">
        <a-button @click="clean" style="margin-right:8px;">清空</a-button>
        <a-button type="primary" style="color:white" @click="submit">
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
import jsmeInput from "components/jsmeInput.vue";
import targetSelect from "components/targetSelect.vue";
import uploadInput from "components/uploadInput.vue";

export default {
  data() {
    return {
      target_select: "请选择靶标",
      input: "",
      value: 1,
      fillShow: true,
      uploadShow: false,
      cleanfill: true,
      cleanselect: true,
      target_type: "",
      smile_input: "",
      property: [],
      selpro: [],
      jobname: "",
      sel: "请选择优化目标"
    };
  },
  components: {
    jsmeInput: jsmeInput,
    "target-select": targetSelect,
    "upload-input": uploadInput
  },
  mounted() {},
  created() {
   
  },
  watch: {
    input: function(val) {
      if (val != this.smile_input) {
        this.cleanfill = !this.cleanfill;
      }
    }
  },
  methods: {
    onChange(e) {
      // console.log('radio checked', e.target.value)
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
    selectTarget(tar) {
      this.target_select = tar;
      // console.log('选中后',this.target_select);
    },
    clean() {
      this.target_select = "请选择靶标";
      this.cleanselect = !this.cleanselect;
      this.smile_input = "";
      this.input = "";
      this.cleanfill = !this.cleanfill;
      // this.selpro = [];
      this.sel = "请选择优化目标";
      this.jobname = "";
      
    },
    getSmiles(smile) {
      this.smile_input = smile;
      this.input = this.smile_input;
    },
    getSmile(smile) {
      this.smile_input = smile;
      this.input = this.smile_input;
    },
    selectProperty(value) {
      this.property = value;
    },
    submit() {
      alert('修改成功')
    }
  }
};
</script>
<style lang="scss" scoped>
.optmize /deep/ .ant-select-selection-selected-value {
  opacity: 0.7 !important;
}
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
.right-content {
  float: right;
  width: 83%;
  .breadcrumb {
    padding: 10px 12px;
    background: #fff;
    margin-left: 2px;
  }
}

hr {
  width: 99%;
  margin: 25px 7px;
  border: 0;
  height: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.scaffold-input {
  margin: 24px 24px;
  background: #fff;
  padding: 16px 16px;
  div {
    display: block;
    margin-bottom: 24px;
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
    padding-left: 48px;
  }
  .request {
    display: flex;
    margin-bottom: 0px;
  }
  .smile {
    margin-left: 16px;
  }
  .smile :before {
    content: "*";
    color: red;
    font-size: 100%;
  }

  .input-conponent {
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
  margin-left: -7px;
}
.job {
  margin-left: 29px;
}
.job .ant-input {
  width: 400px;
  margin-left: -9px;
}
</style>




