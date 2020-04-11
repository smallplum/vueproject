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
          <!-- <a-breadcrumb :routes="routes">
            <template slot="itemRender" slot-scope="{route, params, routes, paths}">
              <span v-if="routes.indexOf(route) === routes.length - 1">{{route.breadcrumbName}}</span>
              <router-link
                v-else-if="route.path==='historypage'"
                target="_blank"
                :to="`${basePath}/search/${route.path}?page=${$route.query.page}&pageSize=${$route.query.pageSize}`"
              >{{route.breadcrumbName}}</router-link>
               <router-link
                v-else-if="route.path==='taskdetail'"
                target="_blank"
                :to="`${basePath}/search/${route.path}?taskid=${$route.query.taskid}&page=${$route.query.page}&pageSize=${$route.query.pageSize}`"
              >{{route.breadcrumbName}}</router-link>
              <router-link
                v-else-if="route.path==='derivationResult'"
                :to="`${basePath}/search/${route.path}?smiles=${route.params.smiles.replace(/\+/g,'%2B')}&target=${route.params.target}&positive=${route.params.positive}&targetType=${$route.query.targetType}&positionNum=${route.params.selected}&origin_smile=${route.params.origin_smile}`"
              >{{route.breadcrumbName}}</router-link>
              <router-link
                v-else-if="route.path==='scaffoldhoppingResult'"
                :to="`${basePath}/search/${route.path}?smiles=${$route.query.scaffoldSmiles.replace(/\+/g,'%2B')}&target=${$route.query.target}&targetType=${$route.query.targetType}&origin_smile=${route.params.origin_smile}&smileId=${route.params.smileId}&type=${route.params.type}`"
              >{{route.breadcrumbName}}</router-link>
              <router-link
                v-else-if="route.path==='optimizeResult'"
                :to="`${basePath}/search/${route.path}?smiles=${$route.query.scaffoldSmiles.replace(/\+/g,'%2B')}&property=${$route.query.property}&target=${$route.query.target}&isOpen=${$route.query.isOpen}&targetType=${$route.query.targetType}&origin_smile=${route.params.origin_smile}`"
              >{{route.breadcrumbName}}</router-link>
              <router-link v-else :to="`${basePath}/${paths.join('/')}`">{{route.breadcrumbName}}</router-link>
            </template>
          </a-breadcrumb> -->
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

    <div :class="rightcontentClass">
      <div>
        <router-view :key="key"></router-view>
      </div>
    </div>

    <div class="clearfloat"></div>
  </div>
</template>
<script>
import qs from "qs";
export default {
  inject: ['reload'],
  components: {},
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
        // path == "/search/noAuth"
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
        path == "/search/scaffoldHopping" ||
        path == "/search/scaffoldhoppingResult"
      ) {
        return ["scaffold_hooping"];
      } else if (path == "/search/noAuth") {
        return ["6"];
      } else if (
        path == "/search/skeletonDerivation" ||
        path == "/search/derivationResult"
      ) {
        return ["1"];
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
      } else if (path == "/search/moleculeDetail") {
        let pagefrom = this.$route.query.pageFrom;
        if (pagefrom === "1") {
          return ["1"];
        } else if (pagefrom === "2") {
          return ["2"];
        } else if (pagefrom === "3") {
          return ["scaffold_hooping"];
        }
      }
    },
    rightcontentClass() {
      return this.ismoleculeDetail ? "special-right-content" : "right-content";
    }
  },
  created() {

  },
  mounted() {
    
    
  },
  data() {
    const { lang } = this.$route.params;
    let Base64 = require("js-base64").Base64;
    return {
      basePath: ``,
      ismoleculeDetail: false,
      routes: [
        {
          path: "search",
          breadcrumbName: "药物设计"
        },
        {
          path: "scaffoldHopping",
          breadcrumbName: "骨架跃迁"
        },
        {
          path: "",
          breadcrumbName: "输入信息"
        }
      ],
      toggleMenu: true,
      timer: null,
      auth: Base64.decode(
        JSON.parse(localStorage.getItem("user") || "[]").volunt
      )
    };
  },
  methods: {
    closeSidebar() {
      this.toggleMenu = !this.toggleMenu;
    },

    menuClick(e) {
      // //避免多次请求,先清除定时器再开启
      // let mark = false;
      // clearTimeout(this.timer);

      // this.timer = setTimeout(() => {
      //   mark = true;
      // }, 500);
      // if(mark) return false;
      // console.log(mark);
      // console.log(e.key);
      
      switch (e.key) {
        case "1":
          //需要执行切换menu的操作，手动切换key
          //如何只切换单个组件
          this.$router.push("/search/skeletonDerivation");
          this.reload();
          break;
        case "2":
          this.$router.push("/search/molecularOptimize");
          this.reload();
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
          this.reload();
          break;
        default:
      }
    },
    ocrRead() {}
  },
  created() {
    // console.log(this.$route.params)
  },
  mounted() {
    let path = this.$route.path;
    let params = this.$route.query;

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
    } else if (path == "/search/scaffoldHopping") {
      this.routes = [
        {
          path: "search",
          breadcrumbName: "药物设计"
        },
        {
          path: "scaffoldHopping",
          breadcrumbName: "骨架跃迁"
        },
        {
          path: "",
          breadcrumbName: "输入信息"
        }
      ];
    } else if (path == "/search/scaffoldhoppingResult") {
      this.routes = [
        {
          path: "search",
          breadcrumbName: "药物设计"
        },
        {
          path: "scaffoldHopping",
          breadcrumbName: "骨架跃迁"
        },
        {
          path: "",
          breadcrumbName: "跃迁结果"
        }
      ];
    } else if (path == "/search/taskmoleculedetail") {
      let routerparam = {
        taskid: this.$route.query.taskid
      
      };
      // console.log(888,routerparam);
      
       this.routes = [
        {
          path: "historypage",
          breadcrumbName: "任务列表"
        },
        {
          path: "taskdetail",
          breadcrumbName: "任务详情",
          params: routerparam
        },
        {
          path: "",
          breadcrumbName: "分子详情"
        }
      ];
      // this.ismoleculeDetail = true;
      // let pagefrom = this.$route.query.pageFrom;
      // let routerparam = {
      //   ...this.$route.query,
      //   smiles: this.$route.query.scaffoldSmiles
      //     ? this.$route.query.scaffoldSmiles
      //     : "",
      //   origin_smile:this.$route.query.origin_smile,
      //   target: this.$route.query.target ? this.$route.query.target : "",
      //   targetType:this.$route.query.targetType,
      //   selected: this.$route.query.positionNum
      //     ? this.$route.query.positionNum
      //     : "",
      //   positive: this.$route.query.positiveSmiles
      //     ? this.$route.query.positiveSmiles
      //     : ""
      // };
      // delete routerparam.positionNum;
      // delete routerparam.positiveSmiles;
      // delete routerparam.scaffoldSmiles;

      // console.log(routerparam, "==>routerparam");

      // if (pagefrom === "1") {
      //   this.routes = [
      //     {
      //       path: "search",
      //       breadcrumbName: "药物设计"
      //     },
      //     {
      //       path: "skeletonDerivation",
      //       breadcrumbName: "骨架衍生"
      //     },
      //     {
      //       path: "derivationResult",
      //       params: routerparam,
      //       breadcrumbName: "衍生结果"
      //     },
      //     {
      //       path: "",
      //       breadcrumbName: "分子详情页"
      //     }
      //   ];
      // } else if (pagefrom === "2") {
      //   this.routes = [
      //     {
      //       path: "search",
      //       breadcrumbName: "药物设计"
      //     },
      //     {
      //       path: "molecularOptimize",
      //       breadcrumbName: "分子优化"
      //     },
      //     {
      //       path: "optimizeResult",
      //       params: routerparam,
      //       breadcrumbName: "优化结果"
      //     },
      //     {
      //       path: "",
      //       breadcrumbName: "分子详情页"
      //     }
      //   ];
      // } else if (pagefrom === "3") {
      //   this.routes = [
      //     {
      //       path: "search",
      //       breadcrumbName: "药物设计"
      //     },
      //     {
      //       path: "scaffoldHopping",
      //       breadcrumbName: "骨架跃迁"
      //     },
      //     {
      //       path: "scaffoldhoppingResult",
      //       // smiles: params.smiles,
      //       params: routerparam,
      //       breadcrumbName: "跃迁结果"
      //     },
      //     {
      //       path: "",
      //       breadcrumbName: "分子详情页"
      //     }
      //   ];
      // }
    } else if (path == "/search/noAuth") {
      this.routes = [
        {
          path: "noAuth",
          breadcrumbName: "无权限"
        }
      ];
    } else if (path == "/search/homepage") {
      this.routes = [
        {
          path: "homepage",
          breadcrumbName: "新建任务"
        }
      ];
    } else if (path == "/search/historypage") {
      this.routes = [
        {
          path: "historypage",
          breadcrumbName: "任务列表"
        }
      ];
    } 
    else if (path == "/search/taskdetail") {
      let routerparam = {
        taskid: this.$route.query.taskid
      
      };
      // console.log(999,routerparam);
      
      this.routes = [
        {
          path: "historypage",
          breadcrumbName: "任务列表"
          
        },
        {
          path: "taskdetail",
          breadcrumbName: "任务详情",
           params: routerparam
        }
      ];
    } 
    else if (path == "/search/projectmanage") {
      this.routes = [
        {
          path: "projectmanage",
          breadcrumbName: "新建项目"
        }
      ];
    } else if (path == "/search/molecularmanagement") {
      this.routes = [
        {
          path: "molecularmanagement",
          breadcrumbName: "项目管理"
        }
      ];
    } 
    else if (path == "/search/optimizeResult") {
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
    
    padding:25px 12px;
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
.close + .right-content {
  width: 95%;
  transition: all 1s;
}
.open + .right-content {
  width: 83%;
  transition: all 1s;
}
span {
  margin-right: 8px;
}
.right-content {
  background: rgb(240, 242, 245);
  position: fixed;
  top: 113px;
  right: 0;
  bottom: 0;
  overflow: scroll;
  float: right;
  width: 83%;
  height: auto;
}
.special-right-content {
  width: 83%;
  height: auto;
  float: right;
  position: relative;
  margin-top: 113px;
  overflow: scroll;
  background: rgb(240, 242, 245);
}
</style>
<style>
.clearfloat {
  clear: both;
}
</style>


