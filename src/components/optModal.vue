<template>
  <a-modal :visible="isModalshow" @cancel="handleCancel">
    <template slot="footer">
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button
        key="submit"
        type="primary"
        :disabled="this.property.length === 0"
        @click="submitOpt"
      >确定</a-button>
    </template>
    <div style="margin-left:16px"><span>(</span><span class="writere">
          <span style="margin-left:0px">为必填项</span>
        </span><span>)</span></div>
    <div class="target-select">
      <target-select
        style="margin-left:0px;width300px;"
        :cleanselect="cleanselect"
        :isNessary="false"
        @selectTarget="selectTarget"
      ></target-select>
    </div>
    <div class="request">
      <span class="smile">
        <span style="margin-left:0px">优化目标：</span>
      </span>
      <a-select
        ref="select"
        placeholder="请选择优化目标"
        class="selectOpti"
        style="width: 300px;margin-right:20px;opacity:0.7;"
        @change="selectProperty"
      >
        <a-select-option
          v-for="(target,index) in targets"
          :key="index"
          :value="target.value"
        >{{target.name}}</a-select-option>
      </a-select>
    </div>
    <div class="taskname">
      <span>
        <span style="margin-left:0px">任务名称：</span>
      </span>
      <a-input style="width: 300px;margin-right:20px" placeholder="自动" v-model="jobname" />
    </div>
  </a-modal>
</template>

<script>
import axios from "axios";
import moment from "moment";
import http from "utils/http";
import util from "utils/util";
import API from "service/apis";
import targetSelect from "components/targetSelect.vue";
export default {
  name: "optModal",
  props: ["metaData","taskabstract"],
  components: {
    "target-select": targetSelect
  },
  data() {
    return {
      target_type: "",
      target_select: "",
      jobname: "",
      cleanselect: true,
      property: "",
      isModalshow: true,
      targets: [
        { name: "QED(定量类药性评估)", value: 1 },
        { name: "SA_score(合成可及性评估)", value: 2 },
        { name: "hERG(心脏毒性优化)", value: 3 }
      ]
    };
  },
  mounted() {
    // console.log(999,JSON.parse(this.taskabstract.conditionJson).property);
  },
  methods: {
    clean() {
      this.target_select = "";
      this.cleanselect = !this.cleanselect;
      this.smile_input = "";
      this.input = "";
      this.cleanfill = !this.cleanfill;
    },
    selectTarget(tar) {
      this.target_select = tar; //接受药物靶标的值
    },
    selectProperty(value) {
      this.property = value;
    },
    handleCancel() {
      const storage = JSON.parse(
        window.sessionStorage.getItem("molecule-detail-params")
      );
      const params = {
        smiles: this.metaData.smiles,
        property: this.property,
        target: this.target_select
      };
      //  console.log(111);
      // this.target_select = '请选择靶标';
      // this.sel = '请选择优化目标';
      // this.jobname = '';
      this.isModalshow = false;
      this.$emit("showModal", false);
    },
    submitOpt() {
      //分子概述组件里的分子优化
      // const storage = JSON.parse(
      //   window.sessionStorage.getItem("molecule-detail-params")
      // );
       if (!this.target_select) {
        this.target_select = "FAKE";
        this.target_type = 3;
      } else {
        this.target_type = 1;
      }
      let tar = this.target_select;
      let targetType = this.target_type;
      let name = this.jobname;

       let taskchain = this.taskabstract.taskChain;   //""
      let taskparams = [];

      let taskorigin = {};
      taskorigin["moleculeId"] = this.taskabstract.moleculeId;
      taskorigin["property"] = JSON.parse(this.taskabstract.conditionJson).property;
      // taskparams[0] = taskorigin;

      let optmize = {};
      optmize["moleculeId"] = this.$route.query.moleculeId;
      optmize["taskId"] = this.$route.query.taskid;
      optmize["property"] = this.property;

      if(this.taskabstract.taskChain!==''){
      //  console.log(111,this.taskabstract.taskChain!=='',typeof(JSON.parse(this.taskabstract.taskChain)),typeof(optmize), JSON.parse(this.taskabstract.taskChain),optmize);
          taskparams = [...JSON.parse(this.taskabstract.taskChain),optmize] 
      }else{
        if(this.taskabstract.type === 3||this.taskabstract.type === 1){
          taskparams.push(optmize);
        }else if(this.taskabstract.type === 2){
          taskparams[0] = taskorigin;
          taskparams.push(optmize);
       }       
      }
      const params = {
        smiles: this.metaData.smiles,
        property: this.property,
        target: tar,
        type: 2,
         name: name,
        targetType: targetType,
        source:3,
        taskChain: JSON.stringify(taskparams)
      };

       http
        .axiospost(API.apis.taskdetail, params)
        .then(res => {
          if (res.code == 200) {
            this.task_id = res.data.taskId;
            this.visible = false;
            this.$router.push({
              path: "/search/historypage",
              query: {
                taskid: this.task_id
              }
            });
          } else {
            this.$message({
              showClose: false,
              message: res.info || "系统错误，请稍后重试",
              type: "error"
            });
          }
        })
        .catch(err => {
          console.warn("接口报错：", err);
          this.$message({
            showClose: false,
            message: "系统错误，请稍后重试",
            type: "error"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.selectOpti /deep/ .ant-select-selection-selected-value{
  opacity: 0.8;
}
.writere :before {
  content: "*";
  color: red;
  font-size: 100%;
}
.target-select {
  margin-left: 5px;
  margin-top: 12px;
}
.target-select /deep/ .ant-select-selection{
 width:300px;
}
.taskname {
  margin-left: 22px;
  margin-top: 12px;
}
.request {
  margin-bottom: 0px;
  margin-top: 12px;
  margin-left: -1px;
  .smile {
    margin-left: 16px;
    border-bottom: none;
  }
  .smile :before {
    content: "*";
    color: red;
    font-size: 100%;
  }
}
.selectOpti{
  color: #CCCCCC;
}
</style>


      