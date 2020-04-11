<template>
  <div class="footer-container">
    <div class="advantage">
      <div class="advant-text">
        <br />
        <span>技术优势</span>
      </div>
      <br />
      <div class="advant-pro">
        <p>多平台支撑</p>
        <div class="adlist">
          <div class="list1">
            <div class="img">
              <img src="static/img/rgzn.png" />
            </div>
            <div class="title">
              <p>人工智能</p>
            </div>
          </div>
          <div class="list1">
            <div class="img">
              <img src="static/img/jshx.png" />
            </div>
            <div class="title">
              <p>计算化学</p>
            </div>
          </div>
          <div class="list1">
            <div class="img">
              <img src="static/img/wlk.png" />
            </div>
            <div class="title">
              <p>微流控</p>
            </div>
          </div>
          <div class="list1">
            <div class="img">
              <img src="static/img/gtl.png" />
            </div>
            <div class="title">
              <p>高通量</p>
            </div>
          </div>
          <div class="list1">
            <div class="img">
              <img src="static/img/gnh.png" />
            </div>
            <div class="title">
              <p>高内涵</p>
            </div>
          </div>
        </div>
        <div class="team-pro">
          <p>跨界团队</p>
          <div class="team">
            <div class="team1">
              <a-icon type="radar-chart" class="team-icon" />
              <h3>核心顾问团队</h3>
              <span>由北大药学教授和默克、阿斯利康等国际知名外企的药物化学家、计算化学家构成的核心顾问团队，保障了药物研发平台的专业性和权威性。</span>
            </div>
            <div class="team1">
              <a-icon type="rise" class="team-icon" />
              <h3>技术研发团队</h3>
              <span>由百度、阿里、腾讯的高级技术人才构成，在自然语言处理、计算机视觉、推荐系统、搜索等AI研发领域和云存储、云计算等大数据领域，均有核心技术储备。</span>
            </div>
            <div class="team1">
              <a-icon type="dot-chart" class="team-icon" />
              <h3>药物研发团队</h3>
              <span>由计算生物学、化学信息学、合成化学、药学、药理学、药物毒理学、医学等专业博士硕士构成，在药物研发全流程均有专业人才储备。</span>
            </div>
          </div>
        </div>
        <div class="advant-text">
          <br />
          <span>产品服务</span>
        </div>
        <br />
        <div class="product">
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
          <!-- <div>
            <div class="img">
              <img src="static/img/desc_tp.png" />
            </div>
            <div class="title">
              <p>打破专利壁垒</p>
            </div>
            <div class="detail">
              <p>利用自然语言处理、光学结构识别算法，自建专利图谱，系统推荐的分子确保打破知识产权壁垒</p>
            </div>
          </div> -->
           <div>
            <div class="img">
              <img src="static/img/desc_dp.png" />
            </div>
            <div class="title">
              <p>研发知识图谱</p>
            </div>
            <div class="detail">
              <p>利用知识图谱技术，从多种可靠数据源的数十亿不同数据点中提炼整合信息，协助药物研发过程查询、决策、洞察</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="footer-link">
      <div class="link-content">
        <a>
          骨架衍生
          <span>|</span>
        </a>
        <a>
          望石智慧
          <span>|</span>
        </a>
        <a>
          联系我们
          <span>|</span>
        </a>
        <a href="http://www.stonewise.cn/">望石智慧官网1</a>
      </div>
    </div> -->
    <div class="footer-logo">
      <div class="logo-content">
        <!-- <div class="flogo" @click="gwHandler"> -->
          <div class="flogo">
          <img src="../../assets/img/home-logo.png"  @click="gwHandler"/>
          <span>北京望石智慧科技有限公司 Copyright©2018 Stonewise All Rights Reserved | 京ICP备18054269号</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "loginFooter",
  methods: {
    gwHandler() {
      window.location.href = "http://www.stonewise.cn/";
    }
  }
};
</script>

<style lang="scss" scoped>
.footer-container {
  clear: both;
  width: 100%;
  // background-color: rgb(0, 0, 0);
}
.advantage {
  width: 100%;
  height: 1100px;
  background-color: #f0f3f7;
  .advant-text {
    font-size: 24px;
    font-weight: bold;
    font-family: PingFangSC-Semibold;
  }
  .advant-pro {
    width: 100%;
    height: 300px;
    padding: 10px 200px;
    >p {
      text-align: left;
      font-size: 20px;
      font-weight: bold;
    }
    .adlist {
      width: 100%;
      display: flex;
      justify-content: space-around;
      .list1 {
        width: 18%;
        height: 200px;

        .img {
          width: 100px;
          height: 100px;
          margin: 20px auto;
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
            font-size: 16px;
            min-width: 100px;
            color: rgba(0, 0, 0, 0.65);
            letter-spacing: 0;
            text-align: center;
            line-height: 28px;
          }
        }
      }
    }
  }
  .team-pro {
    width: 100%;
    height: 300px;
    p {
      text-align: left;
      font-size: 20px;
      font-weight: bold;
    }
    .team {
      display: flex;
      justify-content: space-around;
      width: 100%;
      height: 300px;
      padding: 5px 0;
      .team1 {
        width: 240px;
        height: 240px;
        background-color: white;
        .team-icon {
          font-size: 22px;
          color: #1890ff;
          margin-top: 15px;
        }
        h3 {
          font-size: 24px;
          height: 24px;
          padding: 14px 14px;
          color: rgba(0, 0, 0, 0.85);
          line-height: 24px;
        }
        span {
          display: inline-block;
          padding: 14px 14px;
          text-align: left;
        }
      }
    }
  }
  .product {
      width: 96%;
      height: 230px;
      margin: 0 auto;
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
            font-size: 16px;
             min-width: 100px;
            color: rgba(0, 0, 0, 0.65);
            letter-spacing: 0;
            text-align: center;
            line-height: 28px;
          }
        }
        .detail {
          width: 150px;
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
.footer-link {
  width: 100%;
  background-color: rgb(13, 31, 55);

  .link-content {
    width: 70%;
    margin: 0px auto;
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: left;
    a {
      color: rgb(238, 247, 255);
      padding-right: 8px;
    }
    span {
      padding-right: 8px;
    }
  }
}
// 需要修改其盖度自适应问题
.footer-logo {
  clear: both;
  width: 100%;
  background-color: rgb(0, 0, 0);

  .logo-content {
    padding-top: 20px;
    padding-bottom: 30px;
    width: 70%;
    margin: 0px auto;
    .flogo {
      img {
        float: left;
        width: 100px;
        height: 30px;
        cursor: pointer;
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


     