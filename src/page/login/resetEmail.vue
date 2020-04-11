<template class="home-page">
  <div>
    <login-header />
    <!-- 主体框架 -->
    <div class="content-container">
      <!-- <span class="regSpan">欢迎注册Stonewise AI药物研发平台</span> -->
      <!-- 注册 -->
      <div class="register">
        <div class="register-form">
          <div class="form-content">
            <el-form
              ref="RegisterForm"
              class="form-control container"
              label-width="120px"
              :model="RegisterForm"
              :rules="rules2"
            >
              <el-form-item label="用 户 名" prop="user" class="labelSize">
                <el-input
                  type="text"
                  v-model="RegisterForm.user"
                  auto-complete="off"
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="企业/机构名称" prop="organ">
                <el-input
                  type="text"
                  v-model="RegisterForm.organ"
                  auto-complete="off"
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="tel">
                <el-input v-model="RegisterForm.tel" class="input-with-select" :disabled="true"></el-input>
              </el-form-item>

              <el-form-item label="职位/职称" prop="professional">
                <el-input
                  type="text"
                  v-model.trim="RegisterForm.professional"
                  auto-complete="off"
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="name">
                <el-input
                  type="text"
                  v-model.trim="RegisterForm.name"
                  auto-complete="off"
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="企业邮箱" prop="email">
                <el-input
                  type="text"
                  v-model.trim="RegisterForm.email"
                  auto-complete="off"
                  placeholder="输入邮箱"
                ></el-input>
              </el-form-item>
              <div class="formButton">
                <el-form-item>
                  <el-button type="primary" @click="getActive('RegisterForm')" class="reg">再次激活</el-button>
                </el-form-item>
              </div>
            </el-form>
            <div class="clearfloat"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 主体框架end -->
    <page-footer />
  </div>
</template>

<script>
import axios from "axios";
import loginHeader from "page/login/loginHeader.vue";
import pageFooter from "page/layout/pageFooter.vue";

export default {
  components: {
    "login-header": loginHeader,
    "page-footer": pageFooter
  },
  name: "resetEmail",
  data() {
    //邮箱验证
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      const filter = /@163|@126|@yahoo|@139|@hotmail|@188|@tom|@aliyun|@sohu|@gmail|@189|@qq|@sina/g;
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      }
      setTimeout(() => {
        if (filter.test(value)) {
          callback(new Error("请输入正确的企业邮箱"));
        } else if (mailReg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱格式"));
        }
      }, 100);
    };
    return {
      account: JSON.parse(localStorage.getItem("user") || "[]").userAccount,
      sessionid: JSON.parse(localStorage.getItem("user") || "[]").sessionid,
      RegisterForm: {
        user: "",
        organ: "",
        email: "",
        tel: "",
        professional: "",
        name: ""
      },
      rules2: {
        email: [
          { required: true, message: "邮箱不能为空", trigger: "change" },
          {
            min: 4,
            max: 40,
            message: "长度在 4 到 40 个字符",
            trigger: "blur"
          },
          { validator: checkEmail, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getInformation();
  },
  methods: {
    getInformation() {
      let account = this.$route.query.account;
      axios({
        url: "/molecule/user/active/state",
        method: "post",
        data: {
          account: account
        },
        headers: {
          "content-type": "application/json" // 默认值
        }
      })
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.RegisterForm.user = data.data.user.account || "未填写";
            this.RegisterForm.organ = data.data.user.company || "未填写";
            this.RegisterForm.tel = data.data.user.phone || "未填写";
            this.RegisterForm.professional = data.data.user.title || "未填写";
            this.RegisterForm.name = data.data.user.name || "未填写";
            this.RegisterForm.email = data.data.user.mail || "未填写";
            if ((data.data.state = 1)) {
              this.$message({
                showClose: true,
                message: "请在10分钟之内修改邮箱，进行账号激活",
                type: "success"
              });
            }
          }
        })
        .catch(err => {
          let data = res.data;
          this.$message({
            showClose: true,
            message: data.info,
            type: "error"
          });
        })
        .finally(() => {});
    },
    getActive(formname) {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      const filter = /@163|@126|@yahoo|@139|@hotmail|@188|@tom|@aliyun|@sohu|@gmail|@189|@qq|@sina/g;

      setTimeout(() => {
        if (filter.test(this.RegisterForm.email)) {
          this.$message({
            showClose: true,
            message: "请输入正确的企业邮箱",
            type: "error"
          });
        } else if (mailReg.test(this.RegisterForm.email)) {
          // callback();
        } else {
          this.$message({
            showClose: true,
            message: "请输入正确的邮箱格式",
            type: "error"
          });
        }
      }, 100);
      this.$refs[formname].validate(valid => {
        let email = this.RegisterForm.email;
        let account = this.RegisterForm.user;
        if (valid) {
          axios({
            url: "/molecule/user/active/mail",
            method: "post",
            data: {
              email: email,
              account: account
            },
            headers: {
              "content-type": "application/json" // 默认值
            }
          })
            .then(res => {
              let data = res.data;
              if (data.code == 200) {
                this.$message({
                  showClose: true,
                  message: "请24小时内登录邮箱完成激活",
                  type: "success"
                });
              } else {
                this.$message({
                  showClose: true,
                  message: data.info,
                  type: "error"
                });
              }
            })
            .catch(err => {
              this.$message({
                showClose: true,
                message: "系统错误，请稍后重试",
                type: "error"
              });
            })
            .finally(() => {});
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.labelSize /deep/ .el-form-item__labe {
  font-size: 12px !important;
}
.code /deep/ .el-form-item__error {
  display: block !important;
  width: 200px !important;
  text-align: left !important;
}
.info {
  font-size: 12px;
}
.formButton {
  width: 900px;
  display: flex;
  flex-wrap: nowrap;
  .reg {
    width: 370px;
    margin: 10px 20px;
    margin-left: -20px;
  }
  .relogin .info {
    display: block;
    width: 120px;
    height: 22px;
    line-height: 22px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #1890ff;
    margin-left: 100px;
    padding: 10px 2px;
  }
}
.aaa {
  width: 900px;
}
.form-inline {
  float: left;
  width: 433px;
  .info {
    display: block;
    width: 300px;
    font-size: 12px;
  }
}

.form-content .form-control {
  width: 78% !important;
  margin-left: 80px;
}
.code {
  width: 82px;
}
.getcode {
  display: inline-block;
  margin-left: 20px;
  margin-right: 5px;
  color: #1890ff;
  width: 100px;
  cursor: pointer;
  height: 22px !important;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  line-height: 22px !important;
}
.select_phone {
  width: 90px;
}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.home-page {
  width: 100%;
}
.codeinput {
  float: left;
  width: 310px;
}
.content-container {
  width: 100%;
  background-color: rgb(238, 247, 255);
  padding-bottom: 80px;
}
.footer-container {
  width: 100%;
  background-color: rgb(0, 0, 0);
}

.regSpan {
  font-family: PingFangSC-Medium;
  font-size: 20px;
  margin-top: 10px;
  text-align: center;
  display: block;
  color: rgb(103, 184, 254);
  line-height: 24px;
}
//注册部分
.register {
  width: 1000px;
  margin: 0 auto;
  position: relative;
  text-align: center;
}
.register-form {
  margin: 0 auto;
  width: 750px;
  height: 680px;
  border-radius: 8px;
  margin-top: 10px;
  //   box-shadow: darkgrey 5px 5px 15px 2px;
  //上右下左
  padding: 10px 20px 0px 20px;

  .title {
    color: rgb(103, 184, 254);
    font-size: 20px;
    float: left;
    padding-bottom: 20px;
  }
  hr {
    clear: both;
    color: rgb(227, 227, 227);
  }
}
.form-content {
  padding-top: 20px;
  .form-control {
    width: 50%;
    float: left;
  }
  .image {
    //应该在右边
    float: right;
    width: 50%;
    height: 200px;
    cursor: pointer;
    img {
      margin: 0px auto;
      width: 100%;
    }
  }
  .clearfloat {
    clear: both;
  }
}

//footer部分
.footer {
  clear: both;
  width: 100%;
  background-color: rgb(0, 0, 0);
}
.footer-link {
  width: 100%;
  background-color: rgb(13, 31, 55);
  padding-bottom: 15px;

  .link-content {
    padding-top: 15px;
    padding-bottom: 15px;
    width: 900px;
    margin: 0px auto;
    a {
      float: left;
      color: rgb(238, 247, 255);
      padding-right: 8px;
    }
    span {
      padding-right: 8px;
    }
  }
}
.footer-logo {
  clear: both;
  width: 100%;
  background-color: rgb(0, 0, 0);

  .logo-content {
    padding-top: 20px;
    padding-bottom: 30px;
    width: 900px;
    margin: 0px auto;
    .flogo {
      img {
        float: left;
        width: 100px;
        height: 30px;
      }
      color: rgb(238, 247, 255);
      span {
        display: inline-block;
        margin-top: 5px;
      }
    }
  }
}
</style>
