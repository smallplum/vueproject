<template >
  <div>
    <login-header />
    <!-- content  忘记密码三步走,最好是需要加个箭头形状的-->
    <div class="page-container bg-wihte">
      <div class="center-content">
        <div class="forgetpass">
          <el-form
            ref="ForgetForm"
            :model="ForgetForm"
            :rules="rulefirst"
            :label-position="labelPosition"
            label-width="100px"
            class="forget-form"
          >
            <div v-if="firststep">
              <div>
                <el-form-item label="找回密码方式">
                  <el-radio-group v-model="type" @change="tabChange">
                    <el-radio label="手机号"></el-radio>
                    <el-radio label="邮箱"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <div v-if="pass_type==1">
                  <el-form-item label="手机号" prop="phonenum">
                    <el-input
                      placeholder="输入要重置密码的手机号"
                      v-model.trim="ForgetForm.phonenum"
                      class="input-with-select"
                    >
                      <el-select
                        v-model.trim="ForgetForm.phoneseq"
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
                  <el-form-item label="短信验证码" prop="mescode" class="code">
                    <el-input
                      placeholder="输入验证码"
                      v-model.trim="ForgetForm.mescode"
                      class="codeinput"
                    ></el-input>
                    <span v-if="staus" class="getcode" @click="getCode">获取验证码</span>
                    <span v-else class="getcode">{{count}}s后重新发送</span>
                  </el-form-item>
                  <div>
                    <el-form-item>
                      <el-button type="primary" style="width:300px" @click="SendForget">下一步</el-button>
                    </el-form-item>
                  </div>
                </div>
                <div v-if="pass_type==2">
                  <el-form-item label="邮箱" prop="email">
                    <el-input
                      type="text"
                      v-model.trim="ForgetForm.email"
                      auto-complete="off"
                      style="width:350px;"
                      placeholder="请输入您的邮箱"
                      class="form-control"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="验证码" prop="mescodeemail" class="code">
                    <el-input
                      placeholder="输入验证码"
                      v-model.trim="ForgetForm.mescodeemail"
                      class="codeinput"
                    ></el-input>
                    <span v-if="staus" class="getcode" @click="getCode">获取验证码</span>
                    <span v-else class="getcode">{{count}}s后重新发送</span>
                  </el-form-item>
                  <div>
                    <el-form-item>
                      <el-button type="primary" style="width:300px" @click="SendForget">下一步</el-button>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="secondstep">
              <el-form-item label="设置密码：" prop="pass" class="aaa">
                <el-input
                  type="password"
                  v-model.trim="ForgetForm.pass"
                  auto-complete="off"
                  style="width:300px"
                  placeholder="6 - 16 位密码，区分大小写"
                  class="form-control form-inline"
                ></el-input>
                <span class="info">必须同时包含字母和数字，不支持下划线</span>
              </el-form-item>

              <el-form-item label="确认密码：" prop="passtrue">
                <el-input
                  type="password"
                  v-model.trim="ForgetForm.passtrue"
                  auto-complete="off"
                  style="width:300px"
                  placeholder="确认密码"
                  class="form-control refer"
                ></el-input>
              </el-form-item>

              <el-form-item label>
                <el-button
                  type="primary"
                  style="width:300px;margin-left:-50px;"
                  @click="FinishForget('ForgetForm')"
                >完成</el-button>
              </el-form-item>
              <button></button>
            </div>
            <div v-if="thirdstep">
              <div class="hasSubmit">
                <div class="iconc">
                  <i class="el-icon-circle-check"></i>
                </div>
                <div class="context">
                  <p>您的密码已重置成功！</p>
                  <span @click="goLogin">
                    <a>返回登录页面</a>
                  </span>
                </div>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
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
  name: "forgetpassword",
  data() {
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
    //密码验证
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
    //请再次输入密码验证
    var validatePasstrue = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ForgetForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
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
    //邮箱验证
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      const filter = /@163|@126|@yahoo|@139|@hotmail|@188|@tom|@aliyun|@sohu|@gmail|@189|@qq|@sina/g;
      if (!value) {
        return callback(new Error("邮箱不能为空"));
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
    return {
      staus: true,
      labelPosition: "right",
      active: 0,
      firststep: true,
      secondstep: false,
      thirdstep: false,
      pass_type: 1,
      accountType: "",
      codeType: "",
      type: "手机号",
      count: "",
      timer: null,
      ForgetForm: {
        phonenum: "",
        mescode: "",
        email: "",
        mescodeemail: "",
        check: "",
        pass: "",
        passtrue: "",
        phoneseq: ""
      },
      rulefirst: {
        phonenum: [{ required: true, validator: checkPhone, trigger: "blur" }],
        mescode: [
          { required: true, message: "请获取验证码", trigger: "blur" },
          { validator: checkLength, trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "change" },
          {
            min: 4,
            max: 40,
            message: "长度在 4 到 40 个字符",
            trigger: "blur"
          },
          { validator: checkEmail, trigger: "blur" }
        ],
        mescodeemail: [
          { required: true, message: "请获取验证码", trigger: "blur" },
          { validator: checkLength, trigger: "blur" }
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
        ]
      }
    };
  },

  methods: {
    tabChange() {
      if (this.type == "手机号") {
        this.pass_type = 1;
        this.staus = true;
        this.$refs.ForgetForm.resetFields();
        this.$refs["ForgetForm"].clearValidate();
      }
      if (this.type == "邮箱") {
        this.pass_type = 2;
        this.staus = true;
        this.$refs.ForgetForm.resetFields();
        this.$refs["ForgetForm"].clearValidate();
      }
    },
    getCode() {
      const TIME_COUNT = 60; // 倒计时的时间
      let tel = this.ForgetForm.phonenum;
      let email = this.ForgetForm.email;
      if (this.pass_type == 1) {
        this.accountType = tel;
      } else if (this.pass_type == 2) {
        this.accountType = email;
      }
      axios({
        url: "/molecule/user/verification/code",
        method: "post",
        data: {
          userAccount: this.accountType,
          accountType: this.pass_type, //1 手机号   2 邮箱
          type: 3
        },
        headers: {
          "content-type": "application/json" // 默认值
        }
      })
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            clearInterval(this.timer);
            this.staus = false;
            this.count = TIME_COUNT;
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--;
              } else {
                this.staus = true;
                clearInterval(this.timer);
                this.timer = null;
              }
            }, 1000);
            this.$message({
              showClose: true,
              message: "请在10分钟之内输入验证码",
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
            message: data.info,
            type: "error"
          });
        })
        .finally(() => {});
    },
    SendForget() {
      let tel = this.ForgetForm.phonenum;
      let email = this.ForgetForm.email;
      let code = this.ForgetForm.mescode;
      let mescodeemail = this.ForgetForm.mescodeemail;
      if (this.pass_type == 1) {
        this.accountType = tel;
        this.codeType = code;
      } else if (this.pass_type == 2) {
        this.accountType = email;
        this.codeType = mescodeemail;
      }
      axios({
        url: "/molecule/user/password/check",
        method: "post",
        data: {
          userAccount: this.accountType,
          type: this.pass_type, //1 手机号   2 邮箱
          code: this.codeType
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
              message: "请在10分钟之内重置密码",
              type: "success"
            });
            this.firststep = false;
            this.secondstep = true;
          } else if (data.code == 433) {
            this.$message({
              showClose: true,
              message: data.info,
              type: "error"
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
            message: "请稍后再重置密码",
            type: "error"
          });
        })
        .finally(() => {});
    },
    FinishForget(formname) {
      //修改密码
      if (this.ForgetForm.pass !== this.ForgetForm.passtrue) {
        this.$message({
          showClose: true,
          message: "两次输入的密码不一致，请再次核对",
          type: "error"
        });
      }
      const passReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/g;
      if (passReg.test(this.ForgetForm.pass)) {
      } else {
        this.$message({
          showClose: true,
          message: "密码不符合要求，请修改密码",
          type: "error"
        });
      }
      this.$refs[formname].validate(valid => {
        let tel = this.ForgetForm.phonenum;
        let email = this.ForgetForm.email;
        let code = this.ForgetForm.mescode;
        let mescodeemail = this.ForgetForm.mescodeemail;
        let pass = this.ForgetForm.pass;
        let newpass = this.ForgetForm.passtrue;
        if (this.pass_type == 1) {
          this.accountType = tel;
          this.codeType = code;
        } else if (this.pass_type == 2) {
          this.accountType = email;
          this.codeType = mescodeemail;
        }
        if (valid) {
          axios({
            url: "/molecule/user/password/reset",
            method: "post",
            data: {
              userAccount: this.accountType,
              type: this.pass_type, //1 手机号   2 邮箱
              code: this.codeType,
              newPassword: newpass
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
                  message: "重置密码成功，请登录",
                  type: "success"
                });
                this.secondstep = false;
                this.thirdstep = true;
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
                message: data.info,
                type: "error"
              });
            })
            .finally(() => {});
        }
      });
    },
    goLogin() {
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="scss" scoped="true">
.home-page {
  width: 100%;
}
.el-radio-button__inner,
.el-radio-group {
  display: inline-block;
  line-height: 0;
  margin-left: -198px;
  vertical-align: baseline;
}

.page-container {
  width: 100%;
  margin: 0px;
  padding: 0px;
  .content {
    width: 1200px;
    margin: auto;
    height: 28px;
  }
}
// .input-with-select .el-input-group__prepend {
//     background-color: #fff;
//   }
.select_phone {
  width: 75px;
}
.code {
  .codeinput {
    width: calc(100% - 110px);
    margin-left: -10px;
  }
  .getcode {
    display: inline-block;
    color: #1890ff;
    width: 98px;
    cursor: pointer;
    height: 22px !important;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    line-height: 22px !important;
  }
}
.bg-black {
  background: #000;
  margin: 0px;
}
.bg-white {
  background: #fff;
  margin: 0px;
}
.center-content {
  clear: both;
  width: 100%;
  height: 600px;
  background-color: rgb(238, 247, 255);
  padding-top: 50px;
}
.aaa {
  width: 900px;
}
.form-inline {
  float: left;
  width: 433px;
  // margin-left:10px;
  .info {
    display: block;
    width: 300px;
    font-size: 12px;
  }
}
.refer {
  margin-left: -50px;
}
.forgetpass {
  width: 720px;
  border-radius: 8px;
  margin: 10px auto;
  padding: 20px;
  .title {
    height: 50px;
    width: 100%;
    padding-top: 10px;
    font-size: 24px;
    color: black;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
}

.step {
  margin: 0px auto;
  margin-top: 30px;
  width: 600px;
  text-align: left;
}

.forget-form {
  margin: auto;
  margin-right: 170px;
  margin-left: 50px;
  width: 500px;
  text-align: center;
  padding: 20px 20px 20px 30px;

  el-form-item {
    margin: auto;
    margin-top: 15px;
  }
  span {
    font-size: 16px;
  }
  label {
    padding-top: 10px;
  }
}
</style>
<style>
.forgetpass .el-form-item__label {
  /* padding:12px 0 0; */
}
</style>
