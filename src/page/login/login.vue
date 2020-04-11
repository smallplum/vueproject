<template class="home-page">
  <div>
    <!-- 主体框架 -->
    <div class="content-container">
      <!-- 登录-->
      <div class="login">
        <div class="login-text">
          <div class="lt">
            <p style="font-size:30px;margin-bottom:10px">人工智能驱动新药研发</p>智能化药物研发平台，让更多的疾病有药可医
          </div>
        </div>

        <div class="login-form">
          <div class="title-container">
            <div @click="loginTab1" :class="['title',login_type==1?'active':'']">账号密码登录</div>
          </div>

          <div class="form-content" v-if="login_type==1">
            <el-form
              ref="LoginForm"
              class="form-control"
              label-width="55px"
              :model="LoginForm"
              :rules="rules1"
            >
              <el-form-item label prop="user">
                <el-input
                  type="text"
                  prefix-icon="el-icon-user"
                  v-model.trim="LoginForm.user"
                  auto-complete="off"
                  placeholder="用户名/手机号"
                ></el-input>
              </el-form-item>
              <el-form-item label prop="pass">
                <el-input
                  type="password"
                  prefix-icon="el-icon-lock"
                  v-model.trim="LoginForm.pass"
                  auto-complete="off"
                  placeholder="密码"
                ></el-input>
              </el-form-item>
              <div class="forcheck">
                <el-form-item label prop="chec" style="width:60%;">
                  <el-input
                    type="text"
                    prefix-icon="el-icon-picture-outline"
                    auto-complete="off"
                    v-model.trim="LoginForm.chec"
                    placeholder="验证码"
                  ></el-input>
                </el-form-item>
                <div class="code">
                  <SIdentify :identifyCode="identifyCode"></SIdentify>
                </div>
                <div class="icon" @click="refreshCode">
                  <img style="height: 30px;" src="/static/img/fresh.png" />
                </div>
              </div>
              <div class="formButton">
                <el-form-item style="width:100%;">
                  <el-button
                    type="primary"
                    :loading="loading"
                    @click="checklogin('LoginForm')"
                    style="width:100%;"
                  >登录</el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>


          <div class="form-footer">
            <div class="account">
              <span @click="registerHandler">注册账号</span>
            </div>
            <!-- <div class="forget">
              <span @click="forgetHandle">忘记密码</span>
            </div> -->
          </div>
        </div>
        <div class="clearfloat"></div>
      </div>
    </div>
    <!-- login end -->
    <!-- <page-footer /> -->
  </div>
</template>

<script>
import axios from "axios";
import SIdentify from "components/identify.vue"; //在页面中引入验证码图片绘制组件
import loginHeader from "page/login/loginHeader.vue";
import loginFooter from "page/layout/loginFooter.vue";

axios.defaults.withCredentials = true;

export default {
  components: {
    SIdentify,
    "login-header": loginHeader,
    "page-footer": loginFooter
  },
  name: "login",
  data() {
    let Base64 = require('js-base64').Base64;
    // 自定义验证规则
    var checkUser = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      const filter = /@163|@126|@yahoo|@139|@hotmail|@188|@tom|@aliyun|@sohu|@gmail|@189|@qq|@sina/g;
      if (!value) {
        return callback(new Error("账号不能为空"));
      }
      setTimeout(() => {
        if (filter.test(value)) {
          callback(new Error("请输入企业邮箱"));
        } else {
          callback();
        }
        if (mailReg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱格式"));
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
    // 验证码自定义验证规则
    var validateVerifycode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (value !== this.identifyCode) {
        callback(new Error("验证码不正确!"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      const passReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/g;
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else if (passReg.test(value)) {
        callback();
      } else {
        callback(
          new Error(
            "密码格式为必须同时包含字母和数字，区分大小写，不支持下划线"
          )
        );
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

    return {
      identifyCodes: "1234567890", //说明一下identifyCodes这个字符串可以是数字加英文字母，如果需要验证码有字幕和数字的加上字母即可
      identifyCode: "",
      loading: false,
      login_type: 1,
      count:'',
      timer:null,
      LoginForm: {
        user: "",
        pass: "",
        chec: "",
        checked: true,
        tel: "",
        code: "",
        chec1: ""
      },
      rules1: {
        user: [
          { required: true, validator: checkUser, trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到30 个字符", trigger: "blur" }
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
        chec: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { validator: validateVerifycode }
        ],
        tel: [{ required: true, validator: checkPhone, trigger: "blur" }],
        code: [
          { required: true, message: "请输入短信验证码", trigger: "blur" },
          { validator: checkLength, trigger: "blur" }
        ],
        chec1: [
          { required: true, trigger: "blur", validator: validateVerifycode }
        ]
      },
      imgCode: "",
      mas: "",
      staus: true
    };
  },
  mounted() {
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
  },

  methods: {
    loginTab1() {
      this.login_type = 1;
      this.$nextTick(() => {
        this.$refs.LoginForm.resetFields();
        this.$refs["LoginForm"].clearValidate();
      });
    },
    getCode() {
      let tel = this.LoginForm.tel;
      const TIME_COUNT = 60 // 倒计时的时间
      axios({
        url: "/molecule/user/verification/code",
        method: "post",
        data: {
          userAccount: tel,
          accountType: 1,
          type: 2
        },
        headers: {
          "content-type": "application/json" // 默认值
        }
      })
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            clearInterval(this.timer)
            this.staus = false;
            this.count = TIME_COUNT;
             this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--
              } else {
                 this.staus = true;
                clearInterval(this.timer);
                this.timer = null
              }
            }, 1000)
            this.$message({
              showClose: true,
              message: "请在10分钟之内输入验证码",
              type: "success"
            });
          }else{
            if(data.code == 401){
             this.$message({
              showClose: true,
              message: data.info,
              type: "error"
            });
          }else{
            this.$message({
              showClose: true,
              message: data.info,
              type: "error"
            });
          }
          }
         
        })
        .catch(err => { 
          this.$message({
            showClose: true,
            message: "请稍后再发送验证码",
            type: "error"
          });
        })
        .finally(() => {});
    },
    forgetHandle() {
      this.$router.push("forgetpassword");
    }, //忘记密码
    registerHandler() {
      this.$router.push("register");
    }, //新用户注册
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    }, //验证码生成
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
      
      window.affinityrule = Base64.encode('peiying'+this.identifyCode);
      // console.log(111,window.affinityrule,Base64.decode(window.affinityrule)); //将验证码打印出来
    },

    checklogin(loginform) {
      this.$refs[loginform].validate(valid => {
        let acc = this.LoginForm.user;
        let pas = this.LoginForm.pass;
        if (valid) {
          this.loading = true;
          axios({
            url: "/molecule/user/account/login",
            method: "post",
            data: {
              account: acc,
              password: pas
            },
            xhrFields: {
              withCredentials: true
            },
            // crossDomain: true,
            headers: {
              "content-type": "application/json" // 默认值
            }
          })
            .then(res => {             
              let data = res.data;
              if (data.code == 200) {
                this.$store.commit("setUser", data.data);
                this.$message({
                  showClose: true,
                  message: "登录成功",
                  type: "success"
                });
                if (data.data.auth == "1") {
                  let routeData = this.$router.resolve({
                    path: "/newocr"
                  });
                  window.open(routeData.href, "_self");
                } else if (data.data.auth == "2") {
                  this.$router.push("/search/homepage");
                }
              } else if(res.data.code === 438){
                this.$message({
                  showClose: true,
                  message: data.info,
                  type: "error"
                });
                this.$router.push({path: '/review', query: {account: acc}});
              }
              else {
                // let data = res.data;
                this.$message({
                  showClose: true,
                  message:res.data.info,
                  type: "error"
                });
              }
              this.refreshCode();
              this.LoginForm.chec = '';
            })
            .catch(err => {
              this.$message({
                showClose: true,
                message: '系统错误，清稍后重试',
                type: "error"
              });
              this.refreshCode();
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },

    
  }
};
</script>

<style lang="scss" scoped>
.home-page {
  width: 100%;
}
.content-container {
  width: 100%;
  height: 100%;
  background-image: url("/static/img/login.jpg");
  background-size: 100% auto;
}
.clearfloat {
  clear: both;
}
//登录部分
.login {
  width: 70%;
  margin: 0 auto;
  padding-top: 65px;
}
.login-text {
  float: left;
  width: 44%;
  text-align: center;
  .lt {
    margin: 70px auto;
    color: white;
    font-size: 20px;
    letter-spacing: 5px;
  }
}
.code {
  .codeinput {
    width: calc(100% - 110px);
    margin-left: -10px;
  }
  .getcode {
    display: bolck;
    margin-left: 20px;
    margin-right: 5px;
    color: #1890ff;
    cursor: pointer;
    width: 80px;
  }
}
.login-form {
  float: right;
  width: 50%;
  height: 400px;
  margin-top:80px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: darkgrey 5px 5px 15px 2px;
  .title-container {
    display: flex;
    justify-content: space-around;
    .title {
      color: rgb(74, 74, 74);
      font-size: 16px;
      margin-top: 20px;
      padding: 0 30px 10px 30px;
      text-align: center;
      border-bottom: 2px solid transparent;
    }
    .active {
      position: relative;
      border-bottom-color: #1890ff;
    }
  }
}
.form-content {
  padding-top: 20px;
  padding-right: 60px;
}
.forcheck {
  display: flex;
  .code {
    margin-left: 6px;
    width: 114px;
    height: 40px;
    border: 1px solid rgb(250, 239, 239);
  }
  .icon {
    width: 10px;
    height: 10px;
    padding-left: 5px;
    padding-top: 5px;
    cursor: pointer;
  }
}
.form-footer {
  clear: both;
  background-color: rgb(242, 242, 242);
  height: 76px;
  border: 8px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  cursor: pointer;
  .forget {
    width: 22%;
    height: 65px;
    float: right;
    font-size: 14px;
    padding-top: 20px;
    color: rgb(103, 184, 254);
  }
  .account {
    width: 22%;
    height: 65px;
    font-size: 14px;
    float: right;
    padding-top: 20px;
    color: rgb(103, 184, 254);
  }
}
</style>
