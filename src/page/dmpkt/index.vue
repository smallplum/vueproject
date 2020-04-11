<template>
  <div class="home-page">
    <div class="nav">
      <div :class="['back-home',toggleMenu?'open':'close']">
        <a-icon type="menu-fold" @click="closeSidebar" class="closeSidebar" />
        <span v-if="toggleMenu" @click="closeSidebar" class="aside">收起侧栏</span>
        <span v-else @click="closeSidebar" class="aside">展开侧栏</span>
      </div>
      <div class="nav-right">
        <div class="breadcrumb">
          <a-breadcrumb :routes="routes">
            <template slot="itemRender" slot-scope="{route, params, routes, paths}">
              <span v-if="routes.indexOf(route) === routes.length - 1">{{route.breadcrumbName}}</span>
              <router-link v-else :to="`${basePath}/${paths.join('/')}`">
                {{route.breadcrumbName}}
                <!-- a-breadcrumb --- 是一个标签组件,一般情况我们是不在组件标签内部写东西的 ,他这里在组件中
              <a-breadcrumb>  这里面就是 插槽数据  </a-breadcrumb>     插槽数据会在a-breadcrumb组件里面获取到 
                  在 <template> 上使用特殊的 slot-scope 特性，可以接收传递给插槽的 prop (把这里提到过的
                     <slot-example> 组件作为示例)：
                    这里的 slot-scope 参数声明了被接收的 prop 对象会作为 slotProps 变量存在于 <template> 作用域中。
                      你可以像命名 JavaScript 函数参数一样随意命名 slotProps
                      如果是最后一个item就不添加连接
                -->
              </router-link>
            </template>
          </a-breadcrumb>
        </div>
      </div>
      <div class="clearfloat"></div>
    </div>

    <div :class="['menu',toggleMenu?'open':'close']">
      <a-menu
        mode="inline"
        :defaultSelectedKeys="deKey"
        :defaultOpenKeys="openKeys"
        :style="{ height: '100%', borderRight: 0 }"
        @click="menuClick"
      >
        <a-menu-item key="6" v-if="auth==1">
          <a-icon type="dot-chart" />
          <label>分子设计</label>
        </a-menu-item>
        <a-sub-menu key="sub1" v-if="auth==2">
          <span slot="title">
            <a-icon type="experiment" />
            <label>分子设计</label>
          </span>
          <a-menu-item key="scaffold_hooping" v-if="auth==2">
            <label>录入分子</label>
          </a-menu-item>
          <a-menu-item key="1" v-if="auth==2">
            <label>分子列表</label>
          </a-menu-item>
          <a-menu-item key="2" v-if="auth==2">
            <label>分子修改</label>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <span slot="title">
            <a-icon type="file-pdf" />
            <label>ocr识别</label>
          </span>
          <a-menu-item key="3">
            <label>识别分子</label>
          </a-menu-item>
        </a-sub-menu>
   
      </a-menu>
    </div>

    <div class="special-right-content">
      <skeleton-derivation @getpredictdetail="getpredictdetail"></skeleton-derivation>
      <div class="detail-container" v-if="metaData.dmtk || metaData.t">
        <div class="detail-container-modulecontainer">
          <div class="detail-title">预测结果</div>
          <dmpk-module
            id="dmpk-props"
            @regaindata="regaindata"
            v-bind="$attrs"
            v-on="$listeners"
            :result="metaData.dmtk"
          ></dmpk-module>
          <t-module
            id="t-props"
            @regaindata="regaindata"
            v-bind="$attrs"
            v-on="$listeners"
            :result="metaData.t"
          ></t-module>
        </div>
        <a-anchor :offsetTop="140" @click="handleClick" class="detail-container-anchorcontainer">
          <a-anchor-link v-if="metaData.dmtk" href="#dmpk-props" title="DMPK" />
          <a-anchor-link v-if="metaData.t" href="#t-props" title="毒性" />
        </a-anchor>
      </div>
    </div>
    <div class="clearfloat"></div>
  </div>
</template>
<script>
import http from "utils/http";
import API from "service/apis";
import skeletonDerivation from "./dmpktInput.vue";
import dmpkModule from "../searching/moleculeDetail/moleculeDetails/dmpkModule";
import tModule from "../searching/moleculeDetail/moleculeDetails/tModule.vue";
import { detailData } from "mock/mockData"; //引入数据
import { showLoading, hideLoading } from "utils/loading"; //引入下载方法

export default {
  components: {
    "skeleton-derivation": skeletonDerivation,
    "dmpk-module": dmpkModule,
    "t-module": tModule
  },
  computed: {
    key() {
      return this.$route.path + Math.random();
    },
    openKeys() {
      let path = this.$route.path;
      if (
        path == "/search" ||
        path == "/search/molecularOptimize" ||
        path == "/search/skeletonDerivation" ||
        path == "/search/derivationResult" ||
        path == "/search/moleculeDetail" ||
        path == "/search/optimizeResult" ||
        path == "/search/scaffoldHopping" ||
        path == "/search/scaffoldhoppingResult"
      ) {
        return ["sub1"];
      } else if (path == "/search/noAuth") {
        return ["6"];
      } else if (
        path == "/ocr/ocrRead" ||
        path == "/ocr/readPDF" ||
        path == "/ocr" ||
        path == "/newocr"
      ) {
        return ["sub2"];
      } else if (path == "/dmpktpredict") {
        return ["4"];
      }
    },
    deKey() {
      let path = this.$route.path;
      if (
        path == "/search" ||
        path == "/search/skeletonDerivation" ||
        path == "/search/derivationResult" ||
        path == "/search/moleculeDetail"
      ) {
        return ["1"];
      } else if (
        path == "/search/noAuth"
      ) {
        return ["6"];
      } else if (
        path == "/search/scaffoldHopping" ||
        path == "/search/scaffoldhoppingResult"
      ) {
        return ["scaffold_hooping"];
      } else if (
        path == "/search/molecularOptimize" ||
        path == "/search/optimizeResult"
      ) {
        return ["2"];
      } else if (
        path == "/ocr/ocrRead" ||
        path == "/ocr/readPDF" ||
        path == "/ocr" ||
        path == "/newocr"
      ) {
        return ["3"];
      } else if (path == "/dmpktpredict") {
        return ["4"];
      }
    }
  },
  data() {
    const { lang } = this.$route.params;
    let Base64 = require('js-base64').Base64;
    return {
      metaData: {
        dmtk: null,
        t: null
      },
      basePath: ``,
      ismoleculeDetail: false,
      routes: [
        {
          path: "dmpktpredict",
          breadcrumbName: "DMPK-T预测"
        }
      ],
      toggleMenu: true,
      auth: Base64.decode(JSON.parse(localStorage.getItem("user") || "[]").volunt)
    };
  },
  methods: {
    closeSidebar() {
      this.toggleMenu = !this.toggleMenu;
    },
    handleClick(e, link) {
        e.preventDefault();
        // console.log(link);
      },
    menuClick(e) {
      switch (e.key) {
        case "1":
          //需要执行切换menu的的操作，手动切换key
          //如何只切换单个组件
          this.$router.push("/search/skeletonDerivation");
          break;
        case "2":
          this.$router.push("/search/molecularOptimize");
          break;
        case "3":
          this.$router.push("/newocr");
          break;
        case "4":
          this.$router.push("/dmpktpredict");
          break;
        case "6":
          this.$router.push("/search/noAuth");
          break;
        case "scaffold_hooping":
          this.$router.push("/search/scaffoldHopping");
          break;
        default:
      }
    },

    getpredictdetail(data) {
      this.metaData.dmtk = data.dmtk;
      this.metaData.t = data.t;
    },
    regaindata() {
      showLoading();
      let currentSmiles = window.sessionStorage.getItem(
        "current-molecule-smiles"
      ); //从session中拿到一个值
      let param = { smiles: currentSmiles };
      http
        .axiospost(API.apis.moleculepredictdetail, param) //拿到值后，发送请求
        .then(res => {
          if (+res.code === 200 || +res.code === 201) {
            this.getpredictdetail(res.data);
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
  },
  mounted() {
    let path = this.$route.path;
    if (path == "/search/molecularOptimize") {
      //分子优化
      this.routes = [
        {
          path: "search",
          breadcrumbName: "药物设计"
        },
        {
          path: "molecularOptimize",
          breadcrumbName: "分子优化"
        },
        {
          path: "",
          breadcrumbName: "输入信息"
        }
      ];
    }else if (path == "/search/skeletonDerivation") {
      //骨架衍生
      this.routes = [
        {
          path: "search",
          breadcrumbName: "药物设计"
        },
        {
          path: "skeletonDerivation",
          breadcrumbName: "骨架衍生"
        },
        {
          path: "",
          breadcrumbName: "输入信息"
        }
      ];
    } else if (path == "/search/derivationResult") {
      //骨架衍生返回结果页面
      this.routes = [
        {
          path: "search",
          breadcrumbName: "药物设计"
        },
        {
          path: "skeletonDerivation",
          breadcrumbName: "骨架衍生"
        },
        {
          path: "",
          breadcrumbName: "衍生结果"
        }
      ];
    } else if (path == "/search/moleculeDetail") {
      //分子详情页
      this.ismoleculeDetail = true;
      this.routes = [
        {
          path: "search",
          breadcrumbName: "药物设计"
        },
        {
          path: "skeletonDerivation",
          breadcrumbName: "骨架衍生"
        },
        {
          path: "",
          breadcrumbName: "衍生结果"
        },
        {
          path: "",
          breadcrumbName: "分子详情页"
        }
      ];
    } else if (path == "/search/optimizeResult") {
      this.routes = [
        {
          path: "search",
          breadcrumbName: "药物设计"
        },
        {
          path: "molecularOptimize",
          breadcrumbName: "分子优化"
        },
        {
          path: "",
          breadcrumbName: "优化结果"
        }
      ];
    }else if (path == "/search/noAuth") {
       this.routes = [
        {
          path: "search",
          breadcrumbName: "药物设计"
        },
        {
          path: "noAuth",
          breadcrumbName: "无权限"
        }
      ];
    } else if (path == "/ocr/ocrRead") {
      this.routes = [
        {
          path: "ocr",
          breadcrumbName: "知识图谱"
        },
        {
          path: "ocrRead",
          breadcrumbName: "结构式提取"
        },
        {
          path: "",
          breadcrumbName: "文件输入"
        }
      ];
    } else if (path == "/newocr") {
      this.routes = [
        {
          path: "newocr",
          breadcrumbName: "知识图谱"
        },
        {
          path: "",
          breadcrumbName: "结构式提取"
        }
      ];
    } else if (path == "/ocr/readPDF") {
      this.routes = [
        {
          path: "ocr",
          breadcrumbName: "知识图谱"
        },
        {
          path: "ocrRead",
          breadcrumbName: "结构式提取"
        },
        {
          path: "",
          breadcrumbName: "结构式提取结果"
        }
      ];
    } else if (path == "/ocr") {
      this.routes = [
        {
          path: "ocr",
          breadcrumbName: "知识图谱"
        },
        {
          path: "ocrRead",
          breadcrumbName: "结构式提取"
        },
        {
          path: "",
          breadcrumbName: "文件输入"
        }
      ];
    } else if (path == "/dmpktpredict") {
      this.routes = [
        {
          path: "dmpktpredict",
          breadcrumbName: "DMPK-T预测"
        }
      ];
    }
  }
};
</script>
<style lang="scss" scoped>
.aside {
  margin-left: 10px;
}
.menu /deep/ .ant-menu-inline .ant-menu-submenu-title {
  text-overflow: clip !important;
}
.ant-menu-item {
  text-overflow: clip !important;
}
.home-page {
  width: 100%;
  background-color: rgb(240, 242, 245);
  text-align: left;
  overflow: hidden;
}
.nav {
  width: 100%;
  height: 50px;
  background-color: rgb(240, 242, 245);
  position: fixed;
  top: 70px;
  left: 0px;
  right: 0px;
  padding-bottom: 2px;
  z-index: 999;
  display: flex;
  .back-home {
    width: 17%;
    padding: 10px 12px;
    background: #fff;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
    > span {
      width: 200px;
      display: block;
      flex-wrap: nowrap;
    }
    .closeSidebar {
      margin-top: 3px;
      margin-left: 12px;
      cursor: text;
    }
  }
  .nav-right {
    width: 83%;
    float: right;
    padding-left: 2px;
  }
  .breadcrumb {
    padding-top: 1px;
    padding: 13px 12px;
    background: #fff;
  }
}
.menu {
  width: 17%;
  float: left;
  font-size: 15px;
  height: auto;
  background: rgb(240, 242, 245);
  position: fixed;
  top: 115px;
  bottom: 0;
  transition: all 1s;
}
.open {
  width: 17%;
  transition: all 1s;
}
.close {
  width: 4%;
  transition: all 1s;
}
.close + .special-right-content {
  width: 94%;
  transition: all 1s;
}
.open + .special-right-content {
  width: 83%;
  transition: all 1s;
}
span {
  margin-right: 8px;
}
.special-right-content {
  width: 83%;
  height: auto;
  float: right;
  position: relative;
  margin-top: 113px;
  overflow: scroll;
  background: rgb(240, 242, 245);
  .detail-container {
    display: flex;
    justify-content: space-between;
    margin: 24px 24px 40px 24px;
    background-color: #fff;
    .detail-container-modulecontainer {
      //   width: 83%;
      margin: 16px;
      .detail-title {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
      }
    }
    .detail-container-anchorcontainer {
      min-width: 10%;
      margin-top: 60px;
    }
  }
}
</style>
<style>
.clearfloat {
  clear: both;
}
</style>
