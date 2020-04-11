<template class="home-page">
  <div>
    <login-header></login-header>
    <div class="content-container">
      <div class="box">
        <div class="hasSubmit">
          <div class="context">
            <p>
              <i class="el-icon-circle-check"></i>您的注册信息已成功提交,请去邮箱进行激活！
            </p>
            <br />
            <span>若您长时间未收到激活链接，请点击下方按钮检查邮箱是否填写正确，并再次激活</span>
          </div>
        </div>
        <div class="permission">
          <button @click="getActive">修改邮箱，再次激活</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import loginHeader from "page/login/loginHeader.vue";

axios.defaults.withCredentials = true;

export default {
  components: {
    "login-header": loginHeader
  },
  data() {
    return {
      account: JSON.parse(localStorage.getItem("user") || "[]").userAccount,
      sessionid: JSON.parse(localStorage.getItem("user") || "[]").sessionid
    };
  },
  name: "review",
  methods: {
    getActive() {
      let account = this.$route.query.account;
      this.$router.push({ path: "/resetEmail", query: { account: account } });
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
  height: 90%;
  background-color: rgb(238, 247, 255);
  -webkit-display: flex;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
  .box {
    width: 80%;
    height: 84%;
    .hasSubmit {
      width: 80%;
      height: 77px;
      position: absolute;
      top: 50%;
      margin-top: -34px;
      display: flex;
      justify-content: flex-start;

      .context {
        width: 100%;
        height: 100%;
        p {
          font-size: 24px;
          font-weight: bold;
          color: rgba(0, 0, 0, 0.85);
          letter-spacing: 0;
          text-align: center;
          line-height: 24px;
          margin-bottom: 0;
            .el-icon-circle-check {
              font-size: 22px;
              color: #52c41a;
              margin-right: 5px;
              height: 20px;
              line-height: 20px;
          }
        }
        span {
          font-size: 20px;
          color: rgba(0, 0, 0, 0.65);
          letter-spacing: 0;
          display: block;
          text-align: center;
          line-height: 22px;
        }
      }
    }
    .permission {
      width: 100%;
      height: 20%;
      margin-top: 30%;
      button {
        width: 166px;
        height: 32px;
        
        font-size: 14px;
        color: #ffffff;
        text-align: center;
        line-height: 22px;
        border-radius: 4px;
        background: #1890ff;
        cursor: pointer;
      }
    }
  }
}
</style>