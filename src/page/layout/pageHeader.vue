<template>
  <!-- 头部导航栏 -->
  <div class="header-container">
    <div class="header">
      <div class="nav">
        <div class="left">
          <div class="logo">
            <span>分子设计平台</span>
            <!-- <img src="../../assets/img/home-logo.png" /> -->
          </div>
          <div class="item">
            <el-menu
              :default-active="activeIndex"
              class="el-menu-demo"
              mode="horizontal"
              background-color="#010305"
              text-color="#fff"
              active-text-color="#6DB2F9"
              @select="handleSelect"
            >
              <!-- <el-menu-item index="1">首页</el-menu-item> -->
 
            </el-menu>
          </div>
        </div>

        <div class="link" v-if="isLogin">
          <el-dropdown>
            <span class="el-dropdown-link">
              <img src="/static/img/user.png" />
              {{account}}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="logoutHandle">注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="link" v-if="!isLogin">
          <span @click="loginHandler">登录</span>
          <span @click="registerHandler">注册</span>
          <span @click="engHandler">En</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script >
export default {
  name: "pageHeader",
  inject: ["reload"],
  data() {
    return {
      account: JSON.parse(localStorage.getItem("user") || "[]").userAccount,
      activeIndex: "3"
    };
  },
  computed: {
    isLogin() {
      if (typeof this.account != undefined) {
        return true;
      } else {
        return false;
      }
    }
  },
  created() {

  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key, keyPath,this.$route);
      if (key === "1") {
        this.$router.push("/search/homepage");
      } else if (key === "2") {
        if (
          this.$route.path == "/search/taskmoleculedetail"||this.$route.path == '/search/taskdetail'
        ) {
          let routeData = this.$router.resolve({
            path: "/search/historypage"
          });
          window.open(routeData.href, "_blank");
        }else{
          this.$router.push("/search/historypage");
        }
        
      } else if (key === "3") {
        this.$router.push("/search/projectmanage");
      } else if (key === "4") {
        this.$router.push("/search/molecularmanagement");
      }
    },
    homeHandler() {
      this.$router.push("/functionChoose");
    },
    contactusHandler() {
      return false;
    },
    loginHandler() {
      this.$router.push("/login");
    },
    registerHandler() {
      this.$router.push("/register");
    },
    engHandler() {
      return false;
    },
    logoutHandle() {
      let _this = this;
      this.$confirm({
        title: "您确定要退出吗?",
        content: "退出管理平台",
        onOk() {
          _this.$store.commit("removeUser");
          _this.$router.push("/login");
        },
        onCancel() {}
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.item /deep/ .el-menu {
  background-image: url("/static/img/header-back.png");
  background-position: -2px 66px;
  margin-top: -10px;
  border-bottom: none;
  font-size: 16px;
}
.item /deep/ .el-menu-item {
  font-size: 16px;
}
.item /deep/ .el-submenu__title {
  color: white;
  font-size: 16px;
}
.header-container {
  width: 100%;
  line-height: 1.5;
  background: url("/static/img/header-back.png") repeat-x 0 0;
  background-size: 100% auto;
}
//    header 部分
.header {
  padding-bottom: 15px;
  padding-top: 15px;
  width: 90%;
  margin: 0 auto;
}
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    width: 66%;
    height: 40px;
    min-width: 600px;
    margin-left: -10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .logo {
      width: 150px;
      height: 40px;
      cursor: pointer;
      flex-shrink: 0;
      color:white;
      font-size:22px;
      font-family: 'Courier New', Courier, monospace;
      margin-top: 10px;
    }
    .item {
      width: 700px;
      height: 40px;
      min-width: 700px;
      margin-left: 80px;
      // background-color:#51B774 ;
      flex-shrink: 0;
    }
  }

  .link {
    color: #fff;
    cursor: pointer;
    flex-shrink: 0;
    letter-spacing: 2px;
    font-size: 14px;
    img {
      height: 35px;
      width: 35px;
    }
  }
}
</style>
  
<style>
.link .el-dropdown-link {
  cursor: pointer;
  color: rgb(255, 255, 255);
}
.link .el-icon-arrow-down {
  font-size: 12px;
}
</style>