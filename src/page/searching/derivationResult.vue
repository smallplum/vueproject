<template>
  <div>
    <div class="scaffold-result">
      <div class="result">
        <div class="tip">衍生结果</div>
        <div>
          系统衍生出{{generateNum}}个分子，推荐出前 {{total_num}} 个分子，其中 {{exit_num}} 个为ChEMBL数据库中记录的分子，其他 {{new_num}} 个新分子无相关记录。进行分子对接或查看更多分子性质，请点击“<span class="moreSorket">更多>>></span>”
          <br>
          <span
            class="stick"
            @click="openScreen"
          >{{ !screen_show ?'展开筛选条件':'收起筛选条件'}}</span>
        </div>

        <screen
          v-show="screen_show"
          :columns="columns"
          :check="check"
          @screenChange="screenChange"
          @screenChange2="screenChange2"
        ></screen>

        <div v-if="screen_res_show">
          <div class="tip">筛选结果</div>
          <div>符合筛选条件的分子共计 {{s_total_num}} 个。其中 {{s_exit_num}} 个为ChEMBL数据库中记录的与该药物靶标相关的分子，其他 {{s_new_num}} 个新分子无相关记录</div>
        </div>

        <div class="result-container">
          <div style="display:flex;justify-content:space-between;margin:0;width:100%;">
            <a-tabs
              defaultActiveKey="1"
              @change="changeSearchData"
              style="margin-bottom:0px;"
              class="tabTwo"
            >
              <a-tab-pane :tab="[`新分子(${s_new_num})`]" key="1"></a-tab-pane>
              <a-tab-pane :tab="[`已有分子(${s_exit_num})`]" key="2"></a-tab-pane>
            </a-tabs>
            <div style="width:100px;" @click="sdvdownload">
              <a class="down" :href="downloadHref">
                <a-icon type="download" />下载sdf
              </a>
            </div>
          </div>
          <div>
            <span class="clearfloat"></span>
          </div>
          <!-- 如果加上div容易造成margin坍塌，创建BFC -->
          <div class="results">
            <div
              class="result-item"
              v-for="(item,index) in show_data"
              :style="{'width':'33%','float':'left'}"
              :key="item.id"
            >
              <result-item
                :position="position_num"
                :change="change"
                :check="check"
                :col="collect"
                :result="item"
                :type="1"
              ></result-item>
            </div>
            <!-- 分页器 -->
            <div class="clearfloat"></div>
            <div class="pagination">
              <a-pagination
                :pageSizeOptions="pageSizeOptions"
                :total="total"
                showSizeChanger
                showQuickJumper
                :pageSize="pageSize"
                v-model="current"
                @showSizeChange="onShowSizeChange"
                @change="pageChange"
              >
                <template slot="buildOptionText" slot-scope="props">
                  <span v-if="props.value!=='50'">{{props.value}}条/页</span>
                </template>
              </a-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import resultItem from "components/resultItem.vue";
import screen from "components/screen.vue";

import { showLoading, hideLoading } from "utils/loading";

import axios from "axios";
import moment from "moment";
import http from "utils/http";
import util from "utils/util";
import API from "service/apis";
import qs from "qs";

export default {
  components: {
    "result-item": resultItem,
    screen: screen
  },
  computed: {
    target() {
      return "药物靶标:" + this.target_show[0] + "   " + this.target_show[1];
    },
    smile() {
      return "输入骨架:" + this.input_smile;
    },
    total_num() {
      return this.ItemData.totalNum;
    }, //筛选前所有分子
    generateNum() {
      return this.ItemData.generateNum;
    },
    exit_num() {
      return this.ItemData.chemblNum;
    }, //筛选前已有分子
    new_num() {
      return this.ItemData.molNum;
    }, //筛选前新分子

    s_total_num() {
      return this.ItemData.filterTotalNum;
    }, //筛选后所有分子
    s_exit_num() {
      if (typeof this.ItemData.chemblNum == "undefined") {
        return "";
      } else {
        return this.ItemData.filterChemblNum;
      }
    }, //筛选后已有分子
    s_new_num() {
      if (typeof this.ItemData.molNum == "undefined") {
        return "";
      } else {
        return this.ItemData.filterMolNum;
      }
    }, //筛选后新分子
    new() {
      let str = "新分子（" + this.search_self.num_new_mols + ")";
      return str;
    },
    chem() {
      let str = "已有分子（" + this.search_self.num_new_mols + ")";
      return str;
    }
  },
  data() {
    return {
      target_show: "",

      //////获取url中的query
      select_target: "",
      positive_mol: "",
      input_smile: "",
      selected_ids: [],
      //////////
      labelSmiles:"",
      screenChoose: [], //
      show_data: [],
      columns: [],
      ItemData: [],
      collect: 0,
      check: 0, //0全部不选择，1，全部选中，2，选中当前页面
      checked: false,
      category: 0,
      search_self: [],
      search_data: [],
      screen_self: [],
      screen_data: [],
      screen_show: false,
      screen_res_show: false,
      change: true,
      //分页
      pageSizeOptions: ["9", "18", "27", "36"],
      current: 1,
      pageSize: 9,
      total: 0,
      page1: 1,
      page2: 1,
      bus: "",
      downloadHref: "",
      sessionid: JSON.parse(localStorage.getItem("user") || "[]").sessionid,
      position_num: "",
    };
  },
  created() {
    this.input_smile = this.$route.query.smiles;
    this.target_type = this.$route.query.targetType;
    this.labelSmiles = this.$route.query.origin_smile;
    this.select_target = this.$route.query.target
      ? this.$route.query.target
      : "";
    this.positive_mol = this.$route.query.positive;
    if (
      this.$route.query.selected &&
      typeof this.$route.query.selected === "object"
    ) {
      this.selected_ids = this.$route.query.selected.sort(function(a, b) {
        return a - b;
      });
      let numLen = this.$route.query.lengt;
      let numPosition = new Array(numLen);
      for (let j = 0; j < numLen; j++) {
        numPosition[j] = 1;
      }
      for (let i = 0; i < this.selected_ids.length; i++) {
        numPosition[this.selected_ids[i] - 1] = 0;
      }
      // console.log(numPosition);
      // console.log(numPosition.join("-"));
      this.position_num = numPosition.join("-");
    } else if (
      this.$route.query.selected &&
      typeof this.$route.query.selected === "string"
    ) {
      this.selected_ids = this.$route.query.selected;
      let numLen = this.$route.query.lengt;
      let numPosition = new Array(numLen);
      for (let j = 0; j < numLen; j++) {
        numPosition[j] = 1;
      }
      numPosition[this.$route.query.selected - 1] = 0;
      this.position_num = numPosition.join("-");
    }else if(this.$route.query.positionNum){
      this.position_num = this.$route.query.positionNum
    }
    let path = [];
    this.$store.commit("commitClearPath", path);
  },
  mounted() {
    this.searchForData();
  },
  methods: {
    sdvdownload() {
      this.downloadHref = this.bus;
    },
    openScreen() {
      this.screen_show = !this.screen_show;
      axios
        .get("/molecule/innovation/props", {
          params: {
            sessionid: this.sessionid
          }
        })
        .then(res => {
          if (res.status == 200) {
            this.columns = res.data.data;
            // console.log(this.columns);
          }
        });
    },
    searchForData(page, cat, fil) {
      let str = this.input_smile || "";
      let tar = this.select_target || "";
      let tarType = this.target_type;
      let positive = this.positive_mol || "";
      let labelSmiles = this.labelSmiles || "";
      // let selected_ids = this.selected_ids
      //   ? this.selected_ids.map(item => Number(item))
      //   : [];

      // console.log( this.positive_mol,2222222, this.selected_ids);

      showLoading("分子生成过程预计5-10分钟，请您耐心等待......");
      let params = {
        target: tar,
        positionNum: this.position_num,
        smiles: str,
        labelSmiles:labelSmiles,
        targetType: tarType,
        type: 1,
        page: page,
        pageSize: this.pageSize,
        filters: fil
      };
      http
        .axiospost(API.apis.scaffoldhopping, params)
        .then(res => {
          if (res.code == 200) {
            this.ItemData = res.data;
            this.bus = this.ItemData.sdf;
            if (this.category == 0) {
              if (this.screen_res_show === true) {
                this.total = this.ItemData.filterMolNum;
              } else {
                this.total = this.ItemData.molNum; //新分子总数
              }
              this.show_data = this.ItemData.moleculeList; //显示的九条新分子数据
              this.page1 = page;
              this.page2 = 1;
            } else if (this.category == 1) {
              if (this.screen_res_show === true) {
                this.total = this.ItemData.filterChemblNum;
              } else {
                this.total = this.ItemData.chemblNum; //已有分子总数
              }
              this.show_data = this.ItemData.chemblList; //显示的九条已有分子数据
              this.page2 = page;
              this.page1 = 1;
            }

            window.sessionStorage.setItem(
              "molecule-scaffold_smiles",
              this.ItemData.originSmiles.smiles
            );
            hideLoading();
          } else {
            if (+res.code === 401) {
              this.$message({
                showClose: false,
                message: "请先登录",
                type: "error"
              });
            } else {
              this.$message({
                showClose: false,
                message: res.info || "系统错误，请稍后重试",
                type: "error"
              });
            }
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
    },
    backToTop() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },
    changeSearchData(e) {
      if (this.checked === true || this.check === 2) {
        this.check = 0;
        this.checked = false;
      }
      showLoading("加载中......");
      //e=1,新分子//e=2，已有分子
      if (e == 1) {
        this.page2 = this.current;
        this.current = this.page1;
        this.show_data = this.ItemData.moleculeList;
        this.category = 0;
        this.total = this.ItemData.molNum;
      } else {
        this.page1 = this.current;
        this.current = this.page2;
        this.show_data = this.ItemData.chemblList;
        this.category = 1;
        this.total = this.ItemData.chemblNum;
      }
      this.searchForData(this.current, this.category, this.screenChoose);
    },
    onShowSizeChange(current, pageSize) {
      //每页显示条数改变的回调
      showLoading("加载中......");
      this.check = 0;
      this.checked = false;
      this.pageSize = pageSize;
      let cat = this.category;
      let fil = this.screenChoose;
      this.searchForData(current, cat, fil);
    },

    pageChange(page, pageSize) {
      showLoading("加载中......");
      this.check = 0;
      this.checked = false;
      let cat = this.category;
      let fil = this.screenChoose;
      this.searchForData(page, cat, fil);
    },
    screenChange2(data) {
      this.screen_res_show = data;
    },
    screenChange(e) {
      showLoading("加载中......");
      if (e.length === 0) {
        this.screen_res_show = false;
      } else {
        this.screen_res_show = true;
      }
      this.screenChoose = e;
      let page = 1;
      this.current = 1;
      let cat = this.category;
      let fil = this.screenChoose;
      this.searchForData(page, cat, fil);
    }
  }
};
</script>
<style lang="scss" scoped>
.tabTwo {
  width: 98%;
}
.moreSorket{
  color: rgb(24, 144, 255);
}
.down {
  height: 46px;
  line-height: 46px;
  margin-top: 8px;
  margin-right: 5px;
  float: right;
}
div {
  margin-bottom: 16px;
}
.tip {
  font-weight: bold;
  margin-right: 20px;
}
.input-info {
  margin: 24px 24px;
  background: #fff;
  padding: 24px 16px;
  .a-input {
    margin-right: 8px;
    font-size: 15px;
  }
}
.condition {
  background-color: rgb(249, 249, 249);
  padding: 24px 24px;
  margin-top: 30px;
}
.scaffold-result {
  margin: 24px 24px;
  background: #fff;
  padding: 16px 16px;
  .input {
    margin-bottom: 0px;
    .show-option {
      color: rgb(24, 144, 255);
      float: right;
    }
  }
}
.stick {
  color: #1890ff;
  margin-top: 20px;
  float: right;
}
.stick:hover {
  text-decoration: underline;
  cursor: pointer;
}
.pagination {
  margin: 0 auto;
}
</style>

<style>
.result-container .ant-tabs .ant-tabs-top-content.ant-tabs-content-animated,
.ant-tabs .ant-tabs-bottom-content.ant-tabs-content-animated {
  display: none;
}
</style>

