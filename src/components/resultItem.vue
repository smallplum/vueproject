<template>
  <div>
    <div class="card" @click="moreProps">
      <div class="check">
        <a-checkbox v-model="checked"  @change="changeSelect"></a-checkbox>
      </div>
      <div>
        <template slot="content">
          <div v-for="(i,index) in props_show" :key="i[0]" :value="i[0]">{{i[0]}}: {{i[1]}}</div>
        </template>
        <div class="smile" v-if="this.tabVal=1" ref="imgtwo">
          <img :src="result.imgUrl" />
        </div>
        <div
          class="smile"
          :id="'3dmolviewer_'+result.id"
          ref="threemol"
          v-if="this.tabVal=2"
          style="display:none;border: 1px solid rgb(217, 217, 217);position:relative;"
        >
          <canvas class="undefined" width="270" height="240"></canvas>
        </div>
        <div
          class="smile"
          :id="'3dmolviewerd_'+result.id"
          ref="diehemol"
          v-if="this.tabVal=3"
          style="display:none;border: 1px solid rgb(217, 217, 217);position:relative;"
        >
          <canvas class="undefined" width="270" height="240"></canvas>
        </div>
        <div class="info">
          <div>
            分子排序：
            <span>{{result.rank}}</span>
          </div>
          <div>
            Align score：
            <span>{{this.align_score}}</span>
          </div>
          <div>
            QED Weighted：
            <span>{{result.qed}}</span>
          </div>
          <div>
            SA score:
            <span>{{result.saScore}}</span>
          </div>
          <div>
            #Ro5 Violations：
            <span>{{result.ro5Violations}}</span>
          </div>
          <div @click="gotoDetail({id:result.id})">
            <a class="link">更多>>></a>
          </div>
        </div>
      </div>
      <div class="operate">
        <div class="stick" @click="handleOptimize">分子优化</div>
        <div class="stick">
          <a-tabs @change="callback" type="card" class="tabBtn">
            <a-tab-pane tab="2D" key="1" class="btnTwo"></a-tab-pane>
            <a-tab-pane tab="3D" key="2" class="btnThree"></a-tab-pane>
            <a-tab-pane v-if="showdeihe" :disabled="isDisabled" tab="叠合" key="3" class="btndh"></a-tab-pane>
            <!-- <a-tab-pane v-if="this.type=='3'" :disabled="isDisabled" tab="叠合" key="3" class="btndh"></a-tab-pane> -->
          </a-tabs>
        </div>
      </div>

      <a-modal
        v-model="visible"
        @ok="submitOpt"
        @cancel="handleCancel"
        :okButtonProps="{ props: {disabled: btndisabled} }"
      >
        <div style="margin-left:16px">
          <span>(</span>
          <span class="writere">
            <span style="margin-left:0px">为必填项</span>
          </span>
          <span>)</span>
        </div>
        <div class="target-select">
          <target-select
            style="margin-left:0px;width300px;"
            :cleanselect="cleanselect"
            :uptarget="target_select"
            :isNessary="false"
            @selectTarget="selectTarget"
          ></target-select>
        </div>
        <div class="request">
          <span class="smile">
            <span style="margin-left:0px">优化目标：</span>
          </span>
          <a-select
            placeholder="请选择优化目标"
            v-model="sel"
            class="selectOption"
            style="width: 300px;margin-right:50px;opacity:0.7"
            @change="selectProperty"
          >
            <a-select-option value="1">QED(定量类药性评估)</a-select-option>
            <a-select-option value="2">SA_score(合成可及性评估)</a-select-option>
            <a-select-option value="3">hERG(心脏毒性优化)</a-select-option>
          </a-select>
        </div>
        <div class="taskname">
          <span>
            <span style="margin-left:0px">任务名称：</span>
          </span>
          <a-input style="width: 300px;margin-right:20px" placeholder="自动" v-model="jobname" />
        </div>
      </a-modal>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import http from "utils/http";
import util from "utils/util";
import API from "service/apis";
import Storage from "utils/storage";
import targetSelect from "components/targetSelect.vue";
// import { showLoading, hideLoading } from "utils/loading";
// import axios from "axios";
export default {
  components: {
    "target-select": targetSelect
  },
  data() {
    return {
      smilesList: [],
      target_select: "请选择靶标",
      target_type: "",
      cleanselect: true,
      checked: false,
      collected: "收藏",
      paramTarget: "",
      visi: false,
      visible: false,
      property: [],
      isOpen: true,
      sel: "请选择优化目标",
      tabVal: 1,
      $3Dmolpromise: "",
      sdf: "",
      sdfreference: "",
      smileId: "",
      keyV: 1,
      showing: false,
      isDisabled: true,
      btndisabled: true,
      align_score: "",
      jobname: "",
      showdeihe: false
    };
  },
  props: {
    result: {},
    taskstates: "",
    position: "",
    result: {
      type: Object,
      default: function() {
        return {
          imgUrl: "",
          qed: "",
          ro5Violations: "",
          id: "",
          rank: "",
          smiSmilesMaxSimilarity: ""
        };
      }
    },
    condition_data: {},
    cards_show: {},
    tabV: "",
    type: "",
    check: {} //表示选中
    // col: {},
    // change: {}
  },
  created() {
    // console.log(888, this.result);

    // console.log(
    //   555,
    //   // this.result,
    //   this.cards_show,
    //   this.condition_data
    // );
    if (this.condition_data.type === 3) {
      this.showdeihe = true;
      if (this.condition_data.ref3dSmilesId !== 0) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
    } else {
      this.showdeihe = false;
    }
    // this.condition_data.ref3dSmilesId === 0
    //   ? (this.showdeihe = true)
    //   : (this.showdeihe = false);
    // this.condition_data.ref3dSmilesId !== ""
    //   ? (this.isDisabled = false)
    //   : (this.isDisabled = true);
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
        // console.log(firstScriptTag);//异步加载外部文件3dmol.js
      });
    };
    if (typeof $3Dmolpromise === "undefined") {
      let $3Dmolpromise = null;
      this.$3Dmolpromise = loadScriptAsync("./static/3Dmol.js");
    } //加载外部js
    // console.log(this.$route.query.smileId);
    if (this.condition_data.ref3dSmilesId > 0) {
      // console.log(111,true);
      this.align_score = this.result.smiSmilesMaxSimilarity;
      // this.isDisabled = false; //叠合可以用
    } else {
      // this.isDisabled = true; //被禁用
      this.align_score = "无";
      //  console.log(222,false);
    }
  },
  mounted() {
    this.tabVal = 1;
  },

  computed: {
    props_show() {
      let p = this.result.mol_props;
      let temp = [];
      for (var i in p) {
        if (!p[i] && p[i] != 0) {
        } else {
          let a = [];
          a[0] = i;
          a[1] = p[i];
          temp.push(a);
        }
      }
      return temp;
    }
  },
  watch: {
    check: function(val) {
      if (val == 1) {
        this.checked = true;
      } else if (val == 2) {
        this.checked = true;
      } else if (val == 0) {
        this.checked = false;
      }
    },
    result: function(val) {
      if (val.is_favorite == true) {
        this.collected = "已收藏";
      } else if (val.is_favorite == false) {
        this.collected = "收藏";
      }
    }
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
    callback(key) {
      if (key == 1) {
        this.tabVal = 1;
        this.keyV = 1;
        this.$refs.imgtwo.style.display = "block";
        this.$refs.threemol.style.display = "none";
        this.$refs.diehemol.style.display = "none";
      } else if (key == 2) {
        this.keyV = 2;
        this.tabVal = 2;
        this.$refs.threemol.style.display = "block";
        this.$refs.imgtwo.style.display = "none";
        this.$refs.diehemol.style.display = "none";
        this.totalShow();
      } else if (key == 3) {
        this.keyV = 3;
        this.tabVal = 3;

        this.smileId = this.$route.query.smileId;
        this.$refs.diehemol.style.display = "block";
        this.$refs.imgtwo.style.display = "none";
        this.$refs.threemol.style.display = "none";
        // this.totalShow();
        axios({
          url: "/molecule/innovation/smiles/3dsvg",
          method: "post",
          data: {
            smiles: this.result.smiles,
            refSmilesId: this.condition_data.ref3dSmilesId
          },
          headers: {
            "content-type": "application/json" // 默认值
          }
        })
          .then(res => {
            if (res.data.code == 200) {
              let sdf = res.data.data.svg;
              let sdfreference = res.data.data.refSvg;
              this.sdf = sdf;
              this.sdfreference = sdfreference;
              var viewer_ = null; //初始化容器为null

              var warn = document.getElementById(
                "3dmolwarning_15706156971263752"
              );
              if (warn) {
                warn.parentNode.removeChild(warn);
              }

              let containerId = "3dmolviewerd_" + this.result.id;

              this.$3Dmolpromise.then(function() {
                // console.log(999,sdfreference);
                viewer_ = $3Dmol.createViewer($("#" + containerId), {
                  backgroundColor: "white"
                });
                viewer_.addModel(sdf, "sdf");
                viewer_.addModel(sdfreference, "sdf");
                viewer_.setStyle(
                  { model: 0 },
                  { stick: { colorscheme: "greenCarbon" } }
                );
                viewer_.setStyle({ model: 1 }, { stick: {} });
                // viewer_.setStyle({ stick: {} });
                viewer_.zoomTo();
                viewer_.render();
              });
            } else {
              this.$message({
                showClose: true,
                message: res.data.info,
                type: "error"
              });
            }
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: "系统错误，清稍后重试",
              type: "error"
            });
          })
          .finally(() => {});
      }
    },
    totalShow() {
      axios({
        url: "/molecule/innovation/smiles/3dsvg",
        method: "post",
        data: {
          smiles: this.result.smiles
        },
        headers: {
          "content-type": "application/json" // 默认值
        }
      })
        .then(res => {
          if (res.data.code == 200) {
            let sdf = res.data.data.svg;
            this.sdf = sdf;
            var viewer_ = null; //初始化容器为null
            // console.log(999,this.sdf);

            var warn = document.getElementById(
              "3dmolwarning_15706156971263752"
            );
            if (warn) {
              warn.parentNode.removeChild(warn);
            }

            let containerId = "3dmolviewer_" + this.result.id;

            this.$3Dmolpromise.then(function() {
              // console.log(999,sdf);
              viewer_ = $3Dmol.createViewer($("#" + containerId), {
                backgroundColor: "white"
              });
              viewer_.addModel(sdf, "sdf");
              viewer_.setStyle({ stick: {} });
              viewer_.zoomTo();
              viewer_.render();
            });
          } else {
            this.$message({
              showClose: true,
              message: res.data.info,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: "系统错误，清稍后重试",
            type: "error"
          });
        })
        .finally(() => {});
    },
    showModal() {
      this.visible = true;
    },
    showConfirm(path_index) {
      let _self = this;
      this.$confirm({
        title: "",
        content:
          "若进行分子优化，该步骤后的优化结果将不能找回，确认进行分子优化？",
        onOk() {
          _self.showModal();
        },
        onCancel() {
          console.log("Cancel");
        },
        class: "test"
      });
    },
    handleOk(e) {
      // console.log(e);
      this.visible = false;
    },
    // 处理分子优化路径问题
    handleOptimize() {
      this.showModal();
    
      this.visible = true;
    },

    getPopupContainer(trigger) {
      return trigger.parentElement;
    },
    selectProperty(value) {
      this.property = value;
      this.btndisabled = false;
    },
    changeSelect(e) {
      console.log(`${this.checked}    ${this.result.smiles}`);
      this.Checked = e.target.checked;

      if (this.Checked) {
        this.smilesList.push(this.result.smiles);
      } else {
        this.smilesList.remove(this.result.smiles);
      }
      console.log(this.smilesList);
    },
    //分子优化
    handleCancel() {
      // console.log(111);
      this.target_select = "请选择靶标";
      this.sel = "请选择优化目标";
      this.jobname = "";
    },
    submitOpt() {
      if (!this.target_select) {
        this.target_select = "FAKE";
        this.target_type = 3;
      } else if (this.target_select === "请选择靶标") {
        this.target_select = "FAKE";
        this.target_type = 3;
      } else {
        this.target_type = 1;
      }
      let tar = this.target_select;
      let targetType = this.target_type;
      let str = this.result.smiles;
      let pro = this.property;
      let name = this.jobname;
      let taskchain = this.taskstates.taskChain;
      let taskparams = [];

      let taskorigin = {};
      taskorigin["moleculeId"] = this.cards_show.id;
      taskorigin["property"] = this.condition_data.property;

      let optmize = {};
      optmize["moleculeId"] = this.result.id;
      optmize["taskId"] = this.$route.query.taskid;
      optmize["property"] = pro;

      if (this.taskstates.taskChain !== "") {
        //  console.log(111,this.taskstates.taskChain!=='',typeof(JSON.parse(this.taskstates.taskChain)),typeof(optmize), JSON.parse(this.taskstates.taskChain),optmize);
        taskparams = [...JSON.parse(this.taskstates.taskChain), optmize];
      } else {
        if (this.taskstates.type === 3 || this.taskstates.type === 1) {
          taskparams.push(optmize);
        } else if (this.taskstates.type === 2) {
          taskparams[0] = taskorigin;
          taskparams.push(optmize);
        }
      }
      let params = {
        target: tar,
        targetType: targetType,
        smiles: str,
        type: 2,
        name: name,
        property: pro,
        source: 2,
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
   
    },
    moreProps() {},

    gotoDetail(params) {
      // console.log(params);
      const pageQuery = {
        moleculeId: params.id,
        taskid: this.$route.query.taskid,
        tabVal: this.keyV,
        page: this.$route.query.page,
        pageSize: this.$route.query.pageSize,
        smileId: this.condition_data.ref3dSmilesId,
        targetType: this.condition_data.targetType,
        target: this.condition_data.target,
        align_score: this.result.smiSmilesMaxSimilarity
      };
      let routeData = this.$router.resolve({
        path: "/search/taskmoleculedetail",
        query: pageQuery
      });
      window.open(routeData.href, "_blank");
    }
  }
};
</script>
<style lang="scss" scoped>
.selectOption /deep/ .ant-select-selection-selected-value {
  opacity: 0.8;
}
.target .ant-select {
  font-size: 13px;
  width: 300px;
}
.target {
  margin-left: -14px;
}
.tabBtn {
  margin-top: -8px;
  margin-right: -18px;
  height: 50px;
  float: right;
}
.btnTwo {
}
.btnThree {
}

.undefined {
  width: 270px;
  height: 240px;
  padding: 0px;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 0;
}

.card {
  position: relative;
  width: 270px;
  height: 435px;
  border: 0.5px solid rgb(217, 217, 217);
  border-radius: 2px;
  margin: 0px auto;
  box-shadow: 2px 1px 3px 0px rgb(217, 217, 217);
}
.card:hover {
  box-shadow: 4px 2px 18px 0px rgb(217, 217, 217);
}
.smile {
  width: 270px;
  height: 240px;
  border-bottom: 0.5px solid rgb(217, 217, 217);
  position: relative;
  text-align: center;
  img {
    width: 80%;
    padding-top: 10px;
  }
}
.link {
  // text-decoration: underline;
}
.info {
  padding: 19px 15px;
  text-align: left;
  font-size: 13px;
  border-bottom: 0.5px solid rgb(217, 217, 217);
  div {
    margin-bottom: 4px;
  }
  span {
    float: right;
  }
  .link {
    // text-decoration: underline;
    float: right;
    margin-top: -3px;
  }
}
.operate {
  clear: both;
  padding: 8px 15px;
  display: flex;
  justify-content: space-between;
}
.check {
  position: absolute;
  z-index: 10;
  left: 240px;
  top: 10px;
  width: 20px;
  height: 20px;
}
.stick {
  color: rgb(24, 144, 255);
}
.stick:hover {
  text-decoration: underline;
  cursor: pointer;
}
.target-select {
  margin-left: 5px;
  margin-top: 12px;
}
.target-select /deep/ .ant-select-selection {
  width: 300px;
}
.taskname {
  margin-left: 22px;
  margin-top: 12px;
}
.writere :before {
  content: "*";
  color: red;
  font-size: 100%;
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
</style>

<style>
.a-popover {
  position: absolute;
}
.ant-modal-footer {
  border-top: none;
}
.selectOption {
  color: #cccccc;
}
</style>