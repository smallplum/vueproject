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
              <el-menu default-active="4" class="el-menu-vertical-demo">
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
                <div class="title">修改密码</div>
                <hr />
                <el-form class="ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm">
                  <el-form-item label="原密码" prop="pass" label-width="100px" style="width:800px;">
                    <el-col :span="8">
                      <el-input v-model="ruleForm.pass" placeholder="请输入原密码" type="password"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="新密码" prop="newpass" label-width="100px" style="width:800px;">
                    <el-col :span="8">
                      <el-input
                        v-model="ruleForm.newpass"
                        placeholder="请输入新密码"
                        id="newkey"
                        type="password"
                      ></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item
                    label="重复新密码"
                    prop="checknewpass"
                    label-width="100px"
                    style="width:800px;"
                  >
                    <el-col :span="8">
                      <el-input
                        v-model="ruleForm.checknewpass"
                        placeholder="请再次输入新密码"
                        id="newkey1"
                        type="password"
                      ></el-input>
                    </el-col>
                  </el-form-item>
                </el-form>
                <div class="grid-content bg-purple">
                  <el-button
                    type="primary"
                    style="width:230px;"
                    @click="submitChange('ruleForm')"
                  >保存</el-button>
                </div>
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
  name: "security",
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.newpass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      account: JSON.parse(localStorage.getItem("user") || "[]").username,
      ruleForm: {
        pass: "",
        newpass: "",
        checknewpass: ""
      }, //修改密码的表单

      rules: {
        pass: [{ required: true, trigger: "blur", message: "请再次输入密码" }],
        newpass: [
          { required: true, trigger: "blur", message: "请输入新密码" },
          { min: 4, max: 20, message: "长度在 4 到 20 个字符", trigger: "blur" }
        ],
        checknewpass: [
          { required: true, trigger: "blur", message: "请输入新密码" },
          { validator: validatePass2, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
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

    submitChange(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        let opass = this.ruleForm.pass;
        let npass = this.ruleForm.newpass;
        let id = JSON.parse(localStorage.getItem("user") || "[]").id;
        console.log(id);
        if (valid) {
          //存在id不符合要求
          axios({
            url: "/api/v1/users/" + id + "/change_password/",
            method: "patch",
            data: {
              old_password: opass,
              new_password: npass
            },
            headers: {
              "content-type": "application/json" // 默认值
            }
          })
            .then(res => {
              let data = res.data;
              console.log(res);
              if (res.status == 201) {
                this.$router.go(0);
                this.$message({
                  showClose: true,
                  message: "修改密码成功",
                  type: "success"
                });
              }
            })
            .catch(err => {
              if (err.res_contents == "User doesn't exist.")
                this.$message({
                  showClose: true,
                  message: "用户不存在 ",
                  type: "error"
                });
              else {
                this.$message({
                  showClose: true,
                  message: "密码不匹配 ",
                  type: "error"
                });
              }
            });
        }
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
  }
  .right {
    float: right;
    width: 77%;
    border-radius: 8px;
    margin: 0px auto;
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
.ruleForm {
  margin-left: 110px;
}
.showtable {
  margin-top: 10px;
  margin-bottom: 30px;
  padding-left: 20px;
  .info-ui {
    margin-top: 20px;
    clear: both;
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
  color: white;
}
</style>

