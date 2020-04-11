<template>
  <a-modal :visible="isdockshow" @cancel="handleCancel">
    <template slot="footer">
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" @click="submitOpt">确定</a-button>
    </template>
    <p style="color:gray;">请输入要对接蛋白的PDB ID，目前仅支持PDBbind</p>
    <p style="color:red;font-size:12px;margin-top:-5px;">(若不输入，将使用系统提供的该靶点默认蛋白构象进行对接)</p>
    <div class="request">
      <span class="smile">
        <span style="margin-left:0px;color:gray;">PDB ID：</span>
      </span>
      <el-input @input="checkPdb" v-model="pdb_data" style="width: 300px;margin-right:20px"></el-input>
    </div>
    <span
      v-if="nosupport1"
      style="font-weight:550;font-family:Arial;display:block;margin-left:100px;margin-top:4px;"
    >
      <i style="color:red;font-size:16px;font-weight:600;" class="el-icon-circle-close"></i>该PDB ID不在支持的PDBbind中
    </span>
    <span
      v-if="nosupport"
      style="font-weight:550;font-family:Arial;display:block;margin-left:50px;margin-top:4px;"
    >
      <i style="color:red;font-size:16px;font-weight:600;" class="el-icon-circle-close"></i>不支持的PDB ID格式，请输入4位的PDB ID，如10gs
    </span>
  </a-modal>
</template>

<script>
import axios from "axios";
import http from "utils/http";
import util from "utils/util";
import API from "service/apis";
import { showLoading, hideLoading } from "utils/loading";

export default {
  name: "dockModal",
  props: ["metaData"],
  data() {
    return {
      isdockshow: true,
      nosupport: false,
      nosupport1: false,
      pdb_data: "",
      ligand: "",
      receptor: "",
      target: "",
      type: ""
    };
  },
  mounted() {
   
  },
  methods: {
    checkPdb() {
      if (this.pdb_data.length == 4) {
        const param = { pdbid: this.pdb_data };
        http
          .axiosget(API.apis.checkpdb, param)
          .then(res => {
            if (res.code == 416) {
              this.nosupport1 = true;
              this.nosupport = false;
            } else {
              this.nosupport1 = false;
              this.nosupport = false;
            }
          })
          .catch(err => {})
          .finally(() => {});
      } else if (
        (this.pdb_data.length > 0 && this.pdb_data.length < 4) ||
        this.pdb_data.length > 4
      ) {
        this.nosupport = true;
        this.nosupport1 = false;
      } else if ((this.pdb_data = "")) {
        this.nosupport = false;
        this.nosupport1 = false;
      }
    },
    handleCancel() {
      this.isdockshow = false;
      this.$emit("showdockModal", false);
    },
    submitOpt() {
      //分子概述组件里的分子对接
      this.isdockshow = false;
      this.nosupport = false;
      if(this.$route.query.targetType == 2 && this.pdb_data === ""){
         this.target = 'FAKE';
         this.type = 1;
      }else if (this.$route.query.targetType !== 2 && this.pdb_data === "") {
        this.type = 1;
        this.target = this.$route.query.target;
      } else if(this.pdb_data !== ""){
        this.type = 2;
        this.target = this.pdb_data;
      }
      let smile = this.metaData.smiles;
      let params = {
        target: this.target,
        smiles: smile,
        type: this.type
      };
      showLoading("分子对接过程预计1-6分钟，请您耐心等待......");
      http
        .axiospost(API.apis.docking, params)
        .then(res => {
          if (res.code == 200) {
            let a = 4;
            this.$emit("showdockModal", false);
            this.$emit("resultdata", res.data);
            this.$emit("showdocktab", true, a);
            this.$emit("target", this.target, this.type, smile);
            hideLoading();
          } else {
            this.$emit("showdockModal", false);
            this.$emit("resultdata", res.data);
            // this.$emit("showdocktab",true);
            this.$message({
              showClose: false,
              message: res.info,
              type: "error"
            });
          }
          hideLoading();
        })
        .catch(err => {
          console.warn("接口报错：", err);
          hideLoading();
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
</style>


      