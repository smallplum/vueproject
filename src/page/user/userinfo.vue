<template class="home-page">
  <div>
    <!-- 主体框架 -->
    <div class="content-container">
      <div class="content-show">
        <!-- 个人信息 -->
        <div class="user-show">
          <div class="title">{{account}}</div>
          <div class="user-cont">
            <div class="left">
              <el-menu default-active="3" class="el-menu-vertical-demo">
                <el-menu-item index="1" @click="searchHis">
                  <span slot="title">查询历史</span>
                </el-menu-item>
                <el-menu-item index="2" @click="showCollect">
                  <span slot="title">我的收藏</span>
                </el-menu-item>
                <el-menu-item index="3" @click="userinfo">
                  <span slot="title">个人资料</span>
                </el-menu-item>
                <el-menu-item index="4" @click="security">
                  <span slot="title">安全设置</span>
                </el-menu-item>
              </el-menu>
            </div>

            <div class="right">
              <div class="userinfo-show">
                <div class="title">个人资料</div>
                <hr />
                <!-- 21.34编辑
                显示用户信息-->
                <div class="show">
                  <div class="showtable" v-if="showTable">
                    <div class="info-ui">
                      <div class="title">用户名</div>
                      <input style="margin-left:25px;" class="info-show" v-model="username" />
                    </div>
                    <div class="info-ui">
                      <div class="title">邮箱</div>
                      <input class="info-show" v-model="email" />
                    </div>
                    <div class="info-ui">
                      <div class="title">公司</div>
                      <input class="info-show" v-model="company" />
                    </div>
                    <div class="info-ui">
                      <div class="title">手机</div>
                      <input class="info-show" v-model="phone" />
                    </div>
                    <div class="info-ui">
                      <button class="info-button" @click="toEdit">编 辑</button>
                    </div>
                  </div>

                  <div class="showedit" v-if="showEdit">
                    <div class="info-ui">
                      <div class="title">用户名</div>
                      <input class="info-show" v-model="username" />
                    </div>
                    <div class="info-ui">
                      <div class="title">邮箱</div>
                      <input class="info-show" v-model="email" />
                    </div>
                    <div class="info-ui">
                      <div class="title">公司</div>
                      <input class="info-input" v-model="ncompany" />
                    </div>
                    <div class="info-ui">
                      <div class="title">手机</div>
                      <input class="info-input" v-model="nphone" />
                    </div>
                    <div class="info-ui">
                      <button class="info-button" @click="toShow">取消</button>
                      <button class="info-button" @click="checkEdit">保存</button>
                    </div>
                  </div>
                </div>
                <!-- show end -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "userinfo",
  data() {
    return {
      showTable: true,
      showEdit: false,
      username: "",
      email: "",
      company: "",
      phone: "",

      nphone: "",
      ncompany: "",
      account: JSON.parse(localStorage.getItem("user") || "[]").username
    };
  },
  mounted() {
    this.init(); //页面初始化加载
  },
  methods: {
    init() {
      var username = JSON.parse(localStorage.getItem("user") || "[]").username;
      console.log(username);
      axios
        .get(
          "/api/v1/user_infos/",
          {
            params: {
              username: username
            }
          },
          { maxRedirects: 0 }
        )
        .then(res => {
          let data = res.data;
          console.log(res);
          if (res.status == 200) {
            this.username = data.user.username;
            this.email = data.user.email;
            this.company = data.company;
            this.phone = data.phone_num;
            this.ncompany = data.company;
            this.nphone = data.phone_num;
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: "用户不存在 ",
            type: "error"
          });
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
    },

    toEdit() {
      this.showTable = false;
      this.showEdit = true;
    },
    toShow() {
      this.showTable = true;
      this.showEdit = false;
    },
    checkEdit() {
      let phone = this.nphone;
      //phone可以为空
      if (!/^1[34578]\d{9}$/.test(phone)) {
        alert("手机号码有误，请重填");
        return false;
      } else {
        this.saveUserInfo();
      }
    },
    saveUserInfo() {
      //ajax请求
      let id = JSON.parse(localStorage.getItem("user") || "[]").id;
      axios({
        url: "/api/v1/user_infos/" + id + "/",
        method: "patch",
        data: {
          company: this.ncompany,
          phone_num: this.nphone
        },
        headers: {
          "content-type": "application/json" // 默认值
        }
      })
        .then(res => {
          if (res.status == 201) {
            let data = res.data;
            this.company = data.company;
            this.phone = data.phone_num;
            this.ncompany = data.company;
            this.nphone = data.phone_num;
            this.showTable = true;
            this.showEdit = false;
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: "保存失败 ",
            type: "error"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.home-page {
  width: 100%;
}

.content-container {
  width: 100%;
  height: 600px;
  background-color: rgb(238, 247, 255);
}
.footer-container {
  width: 100%;
  background-color: rgb(0, 0, 0);
}

//主体信息显示部分
.content-show {
  width: 900px;
  margin: 0px auto;
  padding-top: 50px;
  padding-left: 80px;
}
.user-show {
  .title {
    color: rgb(103, 184, 254);
    float: left;
    font-size: 20px;
  }
}
.user-cont {
  clear: both;
  padding-top: 30px;
  width: 100%;
  .left {
    float: left;
    width: 20%;
    margin-top: 0px;
    border-radius: 8px;
    box-shadow: rgb(211, 209, 209) 2px 2px 6px 1px;
  }
  .right {
    float: right;
    width: 77%;
    border-radius: 8px;
    margin: 0px auto;
    box-shadow: rgb(211, 209, 209) 2px 2px 6px 1px;
  }
  .userinfo-show {
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    .title {
      font-size: 15px;
      padding-bottom: 10px;
    }
  }
}
.showtable {
  margin-top: 10px;
  margin-bottom: 30px;
  padding-left: 20px;
}
.showedit {
  margin-top: 10px;
  margin-bottom: 30px;
  padding-left: 20px;
}
.info-ui {
  margin-top: 20px;
  clear: both;
}
.info-show {
  float: left;
  margin-left: 40px;
  margin-bottom: 20px;
  width: 300px;
  box-sizing: border-box;
  //  border:1px solid #ccc;
  padding: 5px;
  border-radius: 8px;
  font-size: 14;
}
.info-input {
  float: left;
  margin-left: 40px;
  margin-bottom: 20px;
  width: 300px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 8px;
  font-size: 14;
}
.info-button {
  float: left;
  margin-left: 70px;
  width: 80px;
  border-radius: 8px;
  font-size: 14;
  color: white;
  background-color: rgb(103, 184, 254);
}
</style>

<style scoped>
/* 此处需要限定使用范围 */
.el-menu-vertical-demo {
  border-radius: 8px;
}
hr {
  clear: both;
  margin-top: 40px;
  margin-bottom: 20px;

  border: 0;
  height: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: solid rgba(255, 255, 255, 0.3);
}

.link .el-dropdown-link {
  cursor: pointer;
  color: rgb(255, 255, 255);
}
.link .el-icon-arrow-down {
  font-size: 12px;
}
</style>

