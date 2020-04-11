<template class="home-page">
  <div>
    <!-- 主体框架 -->
    <div class="content-container">

      <!-- 注册 -->
      <div class="register">
        
        <div class="register-form">
                <span class="regSpan">欢迎注册分子设计平台</span>
          <div class="form-content">
            <el-form
              ref="RegisterForm"
              class="form-control container"
              label-width="120px"
              :model="RegisterForm"
              :rules="rules2"
            >
              <el-form-item label="用 户 名" prop="user" class="labelSize aaa">
                <el-input
                  type="text"
                  v-model="RegisterForm.user"
                  auto-complete="off"
                  placeholder="用户名支持中英文、数字、下划线"
                  @focus="clearUser"
                  class="form-inline"
                ></el-input>
                <span
                  class="info"
                  ref="user"
                  style="display:none;color:red;font-size:16px;"
                >(已存在该用户名)</span>
              </el-form-item>
              <el-form-item label="设置密码" prop="pass" class="aaa">
                <el-input
                  type="password"
                  v-model.trim="RegisterForm.pass"
                  auto-complete="off"
                  placeholder="6-16位，区分大小写，必须同时包含字母和数字，不支持下划线"
                  class="form-inline"
                ></el-input>
                <span class="info">(必须同时包含字母和数字，不支持下划线)</span>
              </el-form-item>
              <el-form-item label="确认密码" prop="passtrue">
                <el-input
                  type="password"
                  v-model.trim="RegisterForm.passtrue"
                  auto-complete="off"
                  placeholder="确认密码"
                ></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="tel" class="aaa">
                <el-input
                  placeholder="11位手机号"
                  v-model.trim="RegisterForm.tel"
                  class="input-with-select form-inline"
                  @blur="checkUser(1)"
                  @focus="clearPhone"
                >
                  <el-select
                    v-model.trim="RegisterForm.phoneseq"
                    slot="prepend"
                    placeholder="+86"
                    class="select_phone"
                  >
                    <el-option label="+86" value="1"></el-option>
                    <!-- <el-option label="+886" value="1"></el-option>
                    <el-option label="+852" value="2"></el-option>
                    <el-option label="+853" value="3"></el-option> -->
                  </el-select>
                </el-input>
              </el-form-item>
              <div class="formButton">
                <el-form-item>
                  <el-button type="primary" @click="checkregister('RegisterForm')" class="reg">立即注册</el-button>
                </el-form-item>
                <div class="relogin">
                  <router-link :to="'/'">
                    <span class="info">使用已有帐号登录</span>
                  </router-link>
                </div>
              </div>
            </el-form>

            <div class="clearfloat"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 主体框架end -->
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
  name: "register",
  data() {
    //校验用户名    中英文数字和下划线 空格  点
    var validateUser = (rule, value, callback) => {
      var userReg = /^[\u4e00-\u9fa5a-zA-Z0-9_.\s]{1,}$/;
      if (!value) {
        return callback(new Error("账号不能为空"));
      } else if (userReg.test(value)) {
        callback();
      } else {
        callback(new Error("用户名不符合要求"));
      }
    };

    // 手机号验证
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|6|7|8][0-9]{9}$/;
      if (!value) {
        return callback(new Error("电话号码不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(+value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (phoneReg.test(value)) {
            callback();
          } else {
            callback(new Error("电话号码格式不正确"));
          }
        }
      }, 100);
    };
    //校验验证码
    var checkLength = (rule, value, callback) => {
      var codeReg = /^\d{6}$/;
      if (codeReg.test(value)) {
        callback();
      } else {
        callback(new Error("验证码不正确，请重新输入"));
      }
    };
    //密码验证
    var validatePass = (rule, value, callback) => {
      const passReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/g;
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else if (passReg.test(value)) {
        callback();
      } else {
        callback(new Error("密码不符合要求"));
      }
    };
    //请再次输入密码验证
    var validatePasstrue = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.RegisterForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    //邮箱验证
    return {
      staus: true,
      checked: "",
      count: "",
      timer: null,
      RegisterForm: {
        user: "",
        pass: "",
        passtrue: "",
        tel: "",
        phoneseq: "",
        select: "1"
      },
      rules2: {
        user: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "长度在 1 到 30 个字符",
            trigger: "blur"
          },
          { validator: validateUser, trigger: "blur" }
        ],
        pass: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur"
          },
          { validator: validatePass, trigger: "blur" }
        ],
        passtrue: [
          { required: true, message: "请再次输入密码", trigger: "change" },
           {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur"
          },
          { validator: validatePasstrue, trigger: "blur" }
        ],
        tel: [{ required: true, validator: checkPhone, trigger: "blur" }],
      }
    };
  },
  methods: {
    clearUser() {
      // this.RegisterForm.user = "";
      this.$refs.user.style.display = "none";
    },
    clearPhone() {
      // this.RegisterForm.tel = "";
      this.$refs.phone.style.display = "none";
    },
   
  
    checkregister(formname) {
      if (
        this.RegisterForm.user == "" ||
        this.RegisterForm.pass == "" ||
        this.RegisterForm.passtrue == "" ||
        this.RegisterForm.tel == "" 
      ) {
        this.$message({
          showClose: true,
          message: "必填项未填写，请再次核对",
          type: "error"
        });
      }
      if (this.RegisterForm.pass !== this.RegisterForm.passtrue) {
        this.$message({
          showClose: true,
          message: "两次输入的密码不一致，请再次核对",
          type: "error"
        });
      }
      const passReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/g;
       if (passReg.test(this.RegisterForm.pass)) {
       
      } else {
         this.$message({
            showClose: true,
            message: "密码不符合要求，请修改密码",
            type: "error"
          });
      }

      this.$refs[formname].validate(valid => {
        let user = this.RegisterForm.user;
        let pass = this.RegisterForm.pass;
        let tel = this.RegisterForm.tel;
        if (valid) {
          axios({
            url: "/molecule/user/register",
            method: "post",
            data: {
              account: user,
              password: pass,
              phone: tel
            },
            headers: {
              "content-type": "application/json" // 默认值
            }
          })
            .then(res => {
              let data = res.data;
              console.log(res.data);
              if (data.code == 200) {
                this.$message({
                  showClose: true,
                  message: "您已注册成功，请登录",
                  type: "success"
                });
                this.$router.push({ path: "/login"});
              }else {
                this.$message({
                  showClose: true,
                  message: data.info,
                  type: "error"
                });
              }
            })
            .catch(err => {
              console.log(err);
              this.$message({
                showClose: true,
                message: "系统错误，请稍后重试",
                type: "error"
              });
            });
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
.agree {
  margin-left: -110px;
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
  padding-top: 30px;
}
.footer-container {
  width: 100%;
  background-color: rgb(0, 0, 0);
}

.regSpan {
  font-family: PingFangSC-Medium;
  font-size: 20px;
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
  width: 950px;
  height: 470px;
  border-radius: 8px;
  // margin-top: 100px;
  box-shadow:darkgrey 5px 5px 15px 2px;
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
