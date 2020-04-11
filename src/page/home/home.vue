<template>
  <div>
    <div class="page-container bg-black">
      <div class="page-addtion-of-bg">
        <div class="content header-content">
          <div class="logo" @click="gwHandler">
            <img src="../../assets/img/home-logo.png" />
          </div>

          <div class="link">
            <el-dropdown>
              <span class="el-dropdown-link">
                <img src="/static/img/user.png" />
                {{ account}}
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="searchHis">查询历史</el-dropdown-item>
                <el-dropdown-item @click.native="showCollect">我的收藏</el-dropdown-item>
                <el-dropdown-item @click.native="userinfo">个人资料</el-dropdown-item>
                <el-dropdown-item @click.native="security">安全设置</el-dropdown-item>
                <el-dropdown-item divided @click.native="logoutHandle">注销</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>

        <div class="content serach-content">
          <div class="func-choose">
            <div class="choose-img sca">
              <img src="static/img/scanffold.png" @click="chooseScaffold" />
            </div>
            <div class="choose-img ocr">
              <img src="static/img/OCR-choose.png" @click="chooseOCR" />
            </div>
            <div class="clear"></div>
          </div>
        </div>
      </div>
    </div>

    <page-footer />
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import pageFooter from "page/layout/pageFooter.vue";

export default {
  name: "functionChoose",
  components: {
    "page-footer": pageFooter
  },
  data() {
    return {
      account: JSON.parse(localStorage.getItem("user") || "[]").data.userAccount
    };
  },
  methods: {
    gwHandler() {
      window.location.href = "http://www.stonewise.cn/";
    },
    contactusHandler() {
      return false;
    },
    chooseOCR() {
      this.$router.push("/newocr");
    },
    chooseScaffold() {
      this.$router.push("/search/scaffoldHopping");
    },
    // user
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
    },

    searchHis() {
      this.$router.push("/user/history");
    },
    userinfo() {
      this.$router.push("/user/userinfo");
    },
    security() {
      this.$router.push("/user/security");
    },
    showCollect() {
      this.$router.push("/user/collect");
    }
  },
  mounted() {
    //this.pageInit();
  },
  beforeCreate() {}
};
</script>
<style lang="scss" scoped="true">
.home-page {
  width: 100%;
}
.page-container {
  width: 100%;
  position: relative;
  .content {
    width: 70%;
    margin: auto;
  }
}
.desc-content {
  text-align: left;
  padding-bottom: 130px;
  position: relative;

  .title {
    padding-top: 50px;
    padding-bottom: 30px;
    font-size: 26px;
  }
  .main {
    font-size: 18px;
    line-height: 32px;
  }
}

.page-container-bg {
  background: url("/static/img/func-back.png") no-repeat;
  background-size: auto 100%;
  background-position-x: right;
  background-position-y: bottom;
  width: 100%;
  height: 100%;
}
.bg-black {
  background: #000;
}
.bg-white {
  background: #fff;
}
.page-addtion-of-bg {
  background: url("/static/img/func-back.png") no-repeat;
  background-size: auto 100%;
  background-position-x: right;
  background-position-y: bottom;
  width: 100%;
  height: 100%;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  padding-bottom: 20px;
  .logo {
    width: 160px;
    height: 47px;
    cursor: pointer;
    img {
      width: 100%;
    }
  }
  .link {
    color: #fff;
    cursor: pointer;
    letter-spacing: 2px;
    font-size: 18px;
    img {
      height: 35px;
      width: 35px;
    }
    span {
      margin-top: 5px;
    }
  }

  .user {
    .user-photo {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      border: 1px solid #fff;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
  }
}

.serach-content {
  padding-top: 120px;
  padding-bottom: 300px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .func-choose {
    width: 800px;
    margin: auto;
  }
  .ocr {
    float: right;
  }
  .sca {
    float: left;
  }
  .choose-img {
    width: 250px;
    img {
      width: 100%;
      cursor: pointer; /*鼠标变成手指样式*/
      transition: all 0.4s; /*所有属性变化在0.6秒内执行动画*/
    }
    img:hover {
      transform: scale(1.2); /*鼠标放上之后元素变成1.4倍大小*/
    }
  }
  .clear {
    clear: both;
  }
}
</style>

<style>
.link .el-dropdown-link {
  color: white;
}
.ipt-button .el-button {
  border-radius: 35px;
  border: 2px solid #3d93de;
  height: 45px;
  font-size: 16px;
}
.dialog .el-dialog {
  width: 35%;
  border-radius: 8px;
}
.dialog .el-dialog__body {
  padding: 0;
  padding-bottom: 40px;
}
</style>
