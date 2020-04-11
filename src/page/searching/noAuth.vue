<template>
  <div class="noauth">
    <div class="content-container">
      <div class="box">
        <div class="hasSubmit">
          <div class="iconc">
            <i class="el-icon-message-solid"></i>
          </div>
          <div class="context">
            <span>抱歉，您暂无权限使用药物设计功能</span>
          </div>
          <div class="permission">
            <button @click="getAuth">联系商务获取VIP权限</button>
          </div>
        </div>
        <div class="describtion">
          <p
            class="desc"
          >药物设计为Stonewise AI药物研发平台VIP功能，致力于Me better/Best in class/First in class药物的设计、优化、合成全流程服务</p>
        </div>
        <div class="introduce">
          <div>
            <div class="img">
              <img src="static/img/desc_sj.png" />
            </div>
            <div class="title">
              <p>设计分子结构</p>
            </div>
            <div class="detail">
              <p>系统使用生成对抗网络、自编码网络等人工智能算法，融合计算化学知识，智能化设计分子结构</p>
            </div>
          </div>
          <div>
            <div class="img">
              <img src="static/img/desc_yc.png" />
            </div>
            <div class="title">
              <p>预测分子性质</p>
            </div>
            <div class="detail">
              <p>基于独有分子性质实验数据，利用机器学习、深度学习算法，预测分子性质，帮助选择优质分子</p>
            </div>
          </div>
          <div>
            <div class="img">
              <img src="static/img/desc_sc.png" />
            </div>
            <div class="title">
              <p>生成合成路径</p>
            </div>
            <div class="detail">
              <p>基于海量合成路径数据，利用深度学习、增强学习算法，智能预测合成产物、生成最佳合成路径</p>
            </div>
          </div>
          <div>
            <div class="img">
              <img src="static/img/desc_dp.png" />
            </div>
            <div class="title">
              <p>打破专利壁垒</p>
            </div>
            <div class="detail">
              <p>利用自然语言处理、光学结构识别算法，自建专利图谱，系统推荐的分子确保打破知识产权壁垒</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import loginHeader from "page/login/loginHeader.vue";

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
    getAuth() {
      axios({
        url: "/molecule/user/vip",
        method: "get",
        params: {
          userAccount: this.account,
          sessionid: this.sessionid
        }
      })
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.$message({
              showClose: true,
              message: "系统自动给邮件组bd发送邮件",
              type: "success"
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
  }
};
</script>
<style lang="scss" scoped>
.home-page {
  width: 100%;
  background-color: rgb(240, 242, 245);
  text-align: left;
}
.clearfloat {
  clear: both;
}
.noauth {
  margin: 24px 24px;
  background: #fff;
  height: 700px;
  padding: 16px 10px;
  .content-container {
    width: 100%;
    height: -moz-calc(100% - 116px);
    height: -webkit-calc(100% - 116px);
    height: calc(100% - 116px);
    -webkit-display: flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
    .box {
      width: 96%;
      height: 84%;
      .hasSubmit {
        width: 96%;
        height: 60px;
        margin-top: 10px;
        margin: 0 10px;
        display: flex;
        justify-content: space-between;
        .iconc {
          width: 4%;
          height: 100%;
          margin-top: 10px;
          .el-icon-message-solid {
            font-size: 22px;
            color: #1890ff;
          }
        }
        .context {
          width: 66%;
          height: 100%;
          min-width: 100px;
          span {
            font-size: 16px;
            color: rgba(0, 0, 0, 0.65);
            letter-spacing: 0;
            display: block;
            text-align: left;
            margin-top: 10px;
            line-height: 22px;
          }
        }
        .permission {
          width: 30%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: -2%;
          button {
            min-width: 116px;
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
      .describtion {
        width: 100%;
        height: 90px;
        margin-left: 3px;
        .desc {
          font-family: PingFangSC-Regular;
          font-size: 16px;
          min-width: 300px;
          color: rgba(0, 0, 0, 0.65);
          letter-spacing: 0;
          display: inline-block;
          margin: 12px 10px;
          text-align: left;
        }
      }
      .introduce {
        width: 80%;
        height: 230px;
        margin: 25px auto;
        display: flex;
        justify-content: space-around;
        > div {
          width: 22%;
          height: 100%;
          .img {
            width: 100px;
            height: 100px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 100%;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .title {
            width: 100%;
            height: 30px;

            p {
              min-width: 100px;
              font-size: 15px;
              color: rgba(0, 0, 0, 0.65);
              letter-spacing: 0;
              text-align: center;
              line-height: 28px;
            }
          }
          .detail {
            width: 98%;
            height: calc(100% - 130px);
            margin: 10px auto;
            display: inline-block;
            text-align: left;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.65);
            letter-spacing: 0;
            line-height: 24px;
          }
        }
      }
    }
  }
}
</style>


