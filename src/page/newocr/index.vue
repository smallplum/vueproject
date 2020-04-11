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
          <a-breadcrumb>
           
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
      <div class="detail-container">
        <Upload></Upload>
      </div>
      <div class="detail-container">
        <result></result>
      </div>
    </div>
    <div class="clearfloat"></div>
  </div>
</template>
<script>
import http from "utils/http";
import API from "service/apis";
import Upload from "./upload/upload";
import Result from "./result/result";
import { ocrIdentify } from "mock/mockData";
import { showLoading, hideLoading } from "utils/loading";

export default {
  components: {
    Upload: Upload,
    result: Result
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
        path == "/newocr" ||
        path == "/ocr"
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
      }else if (
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
        path == "/newocr" ||
        path == "/ocr"
      ) {
        return ["3"];
      } else if (path == "/dmpktpredict") {
        return ["4"];
      }
    }
  },
  mounted() {
    let path = this.$route.path;
    if (path == "/search/molecularOptimize") {
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
    } else if (path == "/search/skeletonDerivation") {
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
    } else if (path == "/search/noAuth") {
       this.routes = [
        {
          path: "search",
          breadcrumbName: "药物设计"
        },
        {
          path: "",
          breadcrumbName: "无权限"
        }
      ];
    }else if (path == "/ocr/ocrRead") {
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
  },
  data() {
    const { lang } = this.$route.params;
    let Base64 = require('js-base64').Base64;
    return {
      basePath: ``,
      metaData: null,
      ismoleculeDetail: false,
      routes: [
        {
          path: "ocr",
          breadcrumbName: "知识图谱"
        },
        {
          path: "newocr",
          breadcrumbName: "结构式提取"
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
    backToHome() {
      this.$router.push("/home");
    },

    menuClick(e) {
      switch (e.key) {
        case "1":
          //需要执行切换menu的操作，手动切换key
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
  height: 100%;
  background-color: rgb(240, 242, 245);
  text-align: left;
  overflow: scroll;
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
    padding: 24px 12px;
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
  width: 5%;
  transition: all 1s;
}
.close + .special-right-content {
  width: 95%;
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
  top: 113px;
  bottom: 40px!important;
  overflow: scroll;
  background: rgb(240, 242, 245);
  .detail-container {
    display: flex;
    justify-content: space-between;
    margin: 24px;
    background-color: #fff;
  }
}
</style>
<style>
.clearfloat {
  clear: both;
}
</style>
