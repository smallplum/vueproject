<template>
  <div>
    <abstract-module :result="abs"></abstract-module>
    <!-- <detail-module
      :result="detail"
      :isNewMolecule="abs.type"
      v-on:regaindata="getTableData"
    ></detail-module> -->
  </div>
</template>
<script>
import Vue from "vue";
import abstractModule from "./abstractModule.vue";
import detailModule from "./moleculeDetails/detailModule";

import { showLoading, hideLoading } from "utils/loading";

import http from "utils/http";
import API from "service/apis";
import { detailData } from "mock/mockData";

export default {
  components: {
    "abstract-module": abstractModule,
    "detail-module": detailModule
  },
  computed: {
    target() {
      return "药物靶标:" + this.select_target;
    }
  },
  data() {
    return {
      select_target: "",
      abs: {},
      absFlag: false,
      detail: {},
      taskabstract:{},
      detailFlag: false
    };
  },
  mounted() {
    document.title = "分子详情页-望石智慧";
    let params = this.$route.query;
    this.getTableData();
  },
  created() {},
  methods: {
    getTableData() {
      // showLoading();
      // const positionNum = this.$route.query.positionNum;
      // const positiveSmiles = this.$route.query.positiveSmiles;
      // let params = {
      //   moleculeId: this.$route.query.moleculeId,
      //   taskId: this.$route.query.taskid
      // };
      // http
      //   .axiospost(API.apis.moleculedetail, params)
      //   .then(res => {
          
      //      hideLoading();
      //     if (+res.code === 200 || +res.code === 201) {
            // console.log(res, "====detail接口调用成功");
            // window.sessionStorage.setItem(
            //   "current-molecule-smiles",
            //   res.data.abs.smiles
            // );
            this.abs = detailData.data.abs;
            this.detail = detailData.data.detail;
            this.taskabstract = detailData.data.task;
            this.absFlag = true;
            this.detailFlag = true;
        //     setTimeout(() => hideLoading(), 300);
        //   } else if(+res.code === 460){
        //      this.$message({
        //         showClose: false,
        //         message: "该任务已被删除",
        //         type: "error"
        //       });
        //   }else {
        //     this.$message.error(res.info||"系统错误，请稍后重试");
        //     hideLoading();
        //   }
        // })
        // .catch(err => {
        //   this.$message.error("系统错误，请稍后重试");
        //    hideLoading();
        // });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>