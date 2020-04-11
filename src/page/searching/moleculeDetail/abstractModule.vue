<template>
  <div class="abstract">
    <div class="abstract-title">分子概述</div>
    <div class="abstract-container">
      <div class="abstract-container-imgholder" ref="imgtwo" v-if="this.tabVal=1">
        <img :src="result.url" />
      </div>
      <div class="smile" id="3dmolviewer_" ref="threemol" v-if="this.tabVal=2">
        <!-- <canvas class="undefined" width="284" height="284"></canvas>  3d-->
      </div>
      <!-- <div class="smile" id="3dmolviewerd_" ref="diehemol" v-if="this.tabVal=3"> -->
        <!-- <canvas class="undefined" width="284" height="284"></canvas> 叠合-->
      <!-- </div> -->

      <div class="abstract-container-textholder">
        <a-row :gutter="16" class="abstract-container-textholder-row">
          <a-col :span="8" class="abstract-container-textholder-row-title">分子式：</a-col>
          <a-col
            :span="8"
            class="abstract-container-textholder-row-text"
          >{{metaData.mol_formula?metaData.mol_formula:"-"}}</a-col>
        </a-row>
        <a-row :gutter="16" class="abstract-container-textholder-row">
          <a-col :span="8" class="abstract-container-textholder-row-title">SMILES：</a-col>
          <a-col
            :span="16"
            class="abstract-container-textholder-row-text"
          >{{metaData.smiles?metaData.smiles:"-"}}</a-col>
        </a-row>
        <a-row :gutter="16" class="abstract-container-textholder-row">
          <a-col :span="8" class="abstract-container-textholder-row-title">
            类药五原则
            <a-tooltip placement="top">
              <template slot="title">
                <span>{{TOOLTIP.search.moleculeDetail.abstract.ro5}}</span>
              </template>
              <a-icon type="info-circle" />
            </a-tooltip>：
          </a-col>
          <a-col
            :span="8"
            class="abstract-container-textholder-row-text"
          >{{Number(metaData.ro5) > 0 ? "不符合" : "符合"}}</a-col>
        </a-row>
        <a-row :gutter="16" class="abstract-container-textholder-row">
          <a-col :span="8" class="abstract-container-textholder-row-title">分子排序：</a-col>
          <a-col :span="8">{{metaData.rank?metaData.rank:"-"}}</a-col>
        </a-row>
        <a-row :gutter="16" class="abstract-container-textholder-row">
          <a-col :span="8" class="abstract-container-textholder-row-title">
            类药性
            <a-tooltip placement="top">
              <template slot="title">
                <span>{{TOOLTIP.search.moleculeDetail.abstract.qed}}</span>
              </template>
              <a-icon type="info-circle" />
            </a-tooltip>：
          </a-col>
          <a-col :span="8" class="abstract-container-textholder-row-text">{{metaData.qed}}</a-col>
        </a-row>
        <a-row :gutter="16" class="abstract-container-textholder-row">
          <a-col :span="8" class="abstract-container-textholder-row-title">
            合成可及性
            <a-tooltip placement="top">
              <template slot="title">
                <span>{{TOOLTIP.search.moleculeDetail.abstract.sa_score}}</span>
              </template>
              <a-icon type="info-circle" />
            </a-tooltip>：
          </a-col>
          <a-col
            :span="8"
            class="abstract-container-textholder-row-text"
          >{{metaData.sa_score?metaData.sa_score:"-"}}</a-col>
        </a-row>
        <a-row :gutter="16" class="abstract-container-textholder-row">
          <a-col :span="8" class="abstract-container-textholder-row-title">类型：</a-col>
          <a-col
            :span="6"
            class="abstract-container-textholder-row-text"
          >{{metaData.type === 1 ? "新分子" : "已有分子"}}</a-col>
          <a-col :span="10">
            <a
              class="abstract-container-textholder-operation-icon"
              v-if="+result.type===0 && result.chembl_url"
              :href="result.chembl_url"
              target="_blank"
            >
              <a-icon type="bars" />
              <span>在ChEMBL中查看</span>
            </a>
          </a-col>
        </a-row>
        <a-row :gutter="16" class="abstract-container-textholder-row">
          <a-col :span="8" class="abstract-container-textholder-row-title">Align score：</a-col>
          <a-col :span="8">{{this.align_score}}</a-col>
        </a-row>
        <a-row v-if="show_data" :gutter="16" class="abstract-container-textholder-row">
          <a-col :span="8" class="abstract-container-textholder-row-title">docking score：</a-col>
          <a-col :span="8">{{this.score_dock?this.score_dock:"无"}}</a-col>
        </a-row>
        <a-row v-if="show_data" :gutter="16" class="abstract-container-textholder-row">
          <a-col :span="8" class="abstract-container-textholder-row-title">3D score：</a-col>
          <a-col :span="8">{{this.score_3d?this.score_3d:"无"}}</a-col>
        </a-row>
        <a-row :gutter="16" class="abstract-container-titleholder-text">
          <div class="abstract-container-textholder-operation">
            <!-- <span v-if="support" class="dockno">
              <a-icon type="info-circle" />不支持分子对接，因蛋白3D构象未获取
            </span>-->
          </div>
        </a-row>
        <br />
        <div class="stick">
          <a-tabs @change="callback" type="card" :activeKey="aaa" class="tabBtn">
            <a-tab-pane tab="2D" key="1" class="btnTwo"></a-tab-pane>
            <a-tab-pane v-if="thrid" tab="3D" key="2" class="btnThree"></a-tab-pane>
          </a-tabs>
        </div>
      </div>
      <full-show v-if="fullvisible" :fulldata="fulldata" @showFull="showFull"></full-show>
    </div>
  </div>
</template>

<script>
import collectStar from "components/collectStar";
import optModal from "components/optModal";
import dockModal from "components/dockModal";
import fullShow from "components/fullShow"; //全屏展示
import axios from "axios";
import http from "utils/http";
import util from "utils/util";
import API from "service/apis";
import { showLoading, hideLoading } from "utils/loading";
import { TOOLTIP } from "service/constant";

export default {
  name: "abstractModule",
  props: ["result", "taskabstract"],
  components: {
    "collect-star": collectStar,
    "opt-modal": optModal,
    "dock-modal": dockModal,
    "full-show": fullShow
  },
  data() {
    return {
      fulldata: "",
      metaData: this.result,
      textList: [],
      fullvisible: false, //全屏显示
      property: "",
      TOOLTIP: TOOLTIP,
      $3Dmolpromise: "",
      sdf: "",
      sdfreference: "",
      ligand: "",
      receptor: "",
      // support: false,
      show_docking: false,
      defaultActiveKey: "",
      isDisabled: false,
      score_3d: "",
      score_dock: "",
      align_score: "",
      show_data: false,
      dockvisible: false,
      joint: false,
      thrid: true,
      target_dock: "",
      smile_dock: "",
      type_dock: "",
      aaa: ""
    };
  },
  mounted() {
    console.log(34473,this.metaData);
    if (this.$route.query.tabVal === "1") {
      this.$refs.imgtwo.style.display = "block";
      this.$refs.threemol.style.display = "none";
      // this.$refs.diehemol.style.display = "none";
      // this.$refs.djmol.style.display = "none";
      this.defaultActiveKey = 1;
    } else if (this.$route.query.tabVal === "2") {
      this.$refs.imgtwo.style.display = "none";
      this.$refs.threemol.style.display = "block";
      // this.$refs.diehemol.style.display = "none";
      // this.$refs.djmol.style.display = "none";
      this.defaultActiveKey = 2;
      this.showSdf();
    } 
    if (this.$route.query.smileId > 0) {
      this.isDisabled = false; //不被禁用，显示相似度
      this.align_score = this.$route.query.align_score;
    } else {
      this.isDisabled = true; //被禁用
      this.align_score = "无";
    }
  },
  created() {
    this.aaa = this.$route.query.tabVal;
    var loadScriptAsync = function(uri) {
      return new Promise((resolve, reject) => {
        var tag = document.createElement("script");
        tag.src = uri;
        tag.async = true;
        tag.onload = () => {
          resolve();
        };
        var firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        // console.log(firstScriptTag);//加载外部文件3dmol.js
      });
    };
    if (typeof $3Dmolpromise === "undefined") {
      let $3Dmolpromise = null;
      this.$3Dmolpromise = loadScriptAsync("./static/3Dmol.js");
    }
  },
  watch: {},
  methods: {
    showFull(data) {
      this.fullvisible = data;
      this.isfullshow = true;
    },
    //分子对接
    //3d展示
    showSdf() {
      var viewer_ = null;
      let sdf = this.metaData.svg;
      var warn = document.getElementById("3dmolwarning_15706156971263752");
      if (warn) {
        warn.parentNode.removeChild(warn);
      }

      this.$3Dmolpromise.then(function() {
        viewer_ = $3Dmol.createViewer($("#3dmolviewer_"), {
          backgroundColor: "white"
        });
        viewer_.addModel(sdf, "sdf");
        viewer_.setStyle({ stick: {} });
        viewer_.zoomTo();
        viewer_.render();
      });
    },
    //分子叠合
    callback(key) {
      if (key == 1) {
        this.aaa = "1";
        this.$refs.imgtwo.style.display = "block";
        this.$refs.threemol.style.display = "none";
        // this.$refs.diehemol.style.display = "none";
        // this.$refs.djmol.style.display = "none";
      } else if (key == 2) {
        this.aaa = "2";
        this.$refs.threemol.style.display = "block";
        this.$refs.imgtwo.style.display = "none";
        // this.$refs.diehemol.style.display = "none";
        // this.$refs.djmol.style.display = "none";
        let sdf = this.metaData.svg;
        var viewer_ = null;
        var warn = document.getElementById("3dmolwarning_15706156971263752");
        if (warn) {
          warn.parentNode.removeChild(warn);
        }

        this.$3Dmolpromise.then(function() {
          viewer_ = $3Dmol.createViewer($("#3dmolviewer_"), {
            backgroundColor: "white"
          });
          viewer_.addModel(sdf, "sdf");
          viewer_.setStyle({ stick: {} });
          viewer_.zoomTo();
          viewer_.render();
        });
      } else if (key == 3) {
        this.aaa = "3";
        this.$refs.threemol.style.display = "none";
        this.$refs.imgtwo.style.display = "none";
        // this.$refs.diehemol.style.display = "block";
        // this.$refs.djmol.style.display = "none";
        this.showdiehe();
      } else if (key == 4) {
        this.aaa = "4";
        this.$refs.imgtwo.style.display = "none";
        this.$refs.threemol.style.display = "none";
        this.$refs.diehemol.style.display = "none";
        this.$refs.djmol.style.display = "block";
        let smile = this.metaData.smiles;
        let params = {
          target: this.target_dock,
          smiles: this.smile_dock,
          type: this.type_dock
        };
        http
          .axiospost(API.apis.docking, params)
          .then(res => {
            if (res.code == 200) {
              this.$refs.imgtwo.style.display = "none";
              this.$refs.threemol.style.display = "none";
              // this.$refs.diehemol.style.display = "none";
              // this.$refs.djmol.style.display = "block";
              var viewer_ = null;
              let ligand = res.data.smilesSdf;
              let receptor = res.data.targetPdb;

              var warn = document.getElementById(
                "3dmolwarning_15706156971263752"
              );
              if (warn) {
                warn.parentNode.removeChild(warn);
              }

              this.$3Dmolpromise.then(function() {
                viewer_ = $3Dmol.createViewer($("#3dmolviewerdj_"), {
                  backgroundColor: "white"
                });
                viewer_.addModel(ligand, "sdf");
                viewer_.addStyle(
                  { model: 0 },
                  { stick: { colorscheme: "greenCarbon" } }
                );
                viewer_.zoomTo();
                viewer_.addModel(receptor, "pdb");
                viewer_.setStyle({ model: 1 }, { cartoon: { color: "white" } });
                viewer_.addStyle({ model: 1 }, { line: {} });
                viewer_.render();
                viewer_.render();
              });
            } else {
              this.$message({
                showClose: false,
                message: res.info,
                type: "error"
              });
            }
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
    },
    
    resultdata(data) {
      if (data === null) {
      } else {
        this.$refs.imgtwo.style.display = "none";
        this.$refs.threemol.style.display = "none";
        this.$refs.diehemol.style.display = "none";
        this.$refs.djmol.style.display = "block";
        this.fulldata = data.complex;
        var stage = new NGL.Stage("viewport", { backgroundColor: "white" });
        stage.loadFile(data.complex).then(function(o) {
          var selection = new NGL.Selection("UNL"); //UNL
          var radius = 5;
          var atomSet = o.structure.getAtomSetWithinSelection(
            selection,
            radius
          );
          var ligSet = o.structure.getAtomSetWithinSelection(selection, 0);
          var atomNeibor = o.structure.getAtomSetWithinSelection(selection, 8);
          atomNeibor = o.structure.getAtomSetWithinGroup(atomNeibor);
          atomSet = o.structure.getAtomSetWithinGroup(atomSet);
          let neighborRepr = o.addRepresentation("line", {
            sele: atomSet.toSeleString(),
            aspectRatio: 1.1,
            colorValue: "grey",
            multipleBond: "symmetric"
          });
          let ligandRepr = o.addRepresentation("ball+stick", {
            multipleBond: "symmetric",
            colorValue: "lime",
            sele: ligSet.toSeleString(),
            aspectRatio: 1.0,
            radiusScale: 1.2
          });
          let contactRepr = o.addRepresentation("contact", {
            sele: atomSet.toSeleString(),
            radiusSize: 0.09,
            weakHydrogenBond: true,
            waterHydrogenBond: true,
            backboneHydrogenBond: false
          });
          let labelRepr = o.addRepresentation("label", {
            sele: atomSet.toSeleString(),
            color: "#333333",
            yOffset: 0.2,
            zOffset: 2.0,
            attachment: "bottom-center",
            showBorder: true,
            borderColor: "lightgrey",
            borderWidth: 0.25,
            disablePicking: true,
            radiusType: "size",
            radiusSize: 1.2,
            labelType: "residue",
            labelGrouping: "residue"
          });
          let cartoonRepr = o.addRepresentation("cartoon", {
            sele: atomNeibor.toSeleString(),
            color: "white",
            visible: false
          });
          let duration = 1000;
          o.autoView(ligSet.toSeleString(), duration);
        });
      }
    },
    showdocktab(tab, a) {
      this.joint = arguments[0][0]; //tab为true，对接按钮显示
      this.thrid = !arguments[0][0]; //!tab为false，3D按钮隐藏
      this.aaa = "" + arguments[0][1]; //让对接按钮被选中，key值=4
    },
    target(tar, type, smile) {
      this.target_dock = arguments[0][0];
      this.smile_dock = arguments[0][2];
      this.type_dock = arguments[0][1];
    },
    gotoChembl(url) {
      window.location.href = url;
    }
  }
};
</script>

<style lang="scss" scoped>
.tabBtn {
  margin-top: -8px;
  margin-right: -18px;
  height: 50px;
  float: left;
  position: relative;
  // border:1px solid red;
}
.stick {
  position: relative;
}
.aaa {
  display: block;
  width: 300px;
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  position: absolute;
  left: 185px;
  top: -9px;
  border-radius: 4px;
  color: white;
  background-color: #404041;
  &::before {
    width: 0;
    height: 0;
    position: absolute;
    content: "";
    left: -7px;
    top: 20px;
    color: #404041;
    border-right: 7px dashed transparent;
    border-bottom: 7px solid currentColor;
    border-left: 7px dashed transparent;
  }
}
.tabBtn /deep/ .ant-tabs-nav .ant-tabs-tab-disabled,
.ant-tabs-nav .ant-tabs-tab-disabled:hover {
  cursor: not-allowed;
  color: rgba(0, 0, 0, 0.25);
}
// .tabBtn /deep/ .ant-tabs-nav .ant-tabs-tab-disabled,
// .ant-tabs-nav .ant-tabs-tab-disabled:after{
//   position: absolute;
//  top: 100px;
//  left: 20px;
// content: 'ggg';
//  dispaly:block;
//  width: 100px;
//  height: 50px;
//  line-height: 50px;
//  font-size: 14px;
// }
.btnTwo {
}
.btnThree {
}
#btndh {
  border: 1px solid red;
}
.smile {
  width: 380px;
  height: 380px;
  margin-left: 40px;
  position: relative;
  text-align: center;
  border: 8px #fafafa solid;
  border-radius: 2px 2px 2px 2px 0px;

  .undefined {
    width: 340px;
    height: 340px;
    padding: 0px;
    // position: absolute;
    display: block;
    // margin-left: 40px;
    z-index: 1;
  }
}
.dock {
  margin-left: 76px;
}
.dockno {
  margin-left: 76px;
  color: rgba(0, 0, 0, 0.3);
}
#3dmolviewer_ {
  // margin-left: -40px;
}
// #viewport{
//   width: 700px;
//   height: 600px;
// }
#undefined {
  width: 340px;
  height: 340px;
  padding: 0px;
  // position: absolute;
  display: block;
  // margin-left: 40px;
  z-index: 1;
  padding: 0 20px 0 20px;
}
.abstract {
  margin: 24px;
  padding: 16px;
  background: #ffffff;
  border-radius: 2px 2px 2px 2px 0px;
  .abstract-title {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 16px;
  }
  .abstract-container {
    display: flex;

    .abstract-container-imgholder {
      display: block;
      height: 380px;
      width: 380px;
      margin-left: 40px;
      border: 8px #fafafa solid;
      border-radius: 2px 2px 2px 2px 0px;
      img {
        width: 360px;
        height: 360px;
      }
    }
    .abstract-container-textholder {
      // display: flex;
      margin-left: 35px;
      width: 480px;
      .abstract-container-textholder-row {
        margin-bottom: 10px;
        word-wrap: break-word;
        word-break: break-all;
        .abstract-container-textholder-row-title {
          min-width: 160px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.85);
          line-height: 22px;
        }
        .abstract-container-textholder-row-text {
          max-width: 250px;
          // font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
          line-height: 22px;
        }
      }
      .abstract-container-titleholder-text {
        min-width: 20%;
        .abstract-container-textholder-operation {
          // position: absolute;
          margin-top: 10px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #1890ff;
          text-align: left;
          line-height: 22px;
          .abstract-container-textholder-operation-icon {
            margin-right: 18px;
            cursor: pointer;
            a {
              text-decoration: none;
              :hover {
                text-decoration: none;
              }
              :visited {
                text-decoration: none;
              }
            }
          }
        }
      }
      .abstract-container-textholder-text {
        margin-left: 10px;
        p {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }
  }
}
</style>
