 <template>
  <div id="jsme">
    <div v-if="false">
      <span>绘制结构式：</span>
      <span style="font-size:13px;">系统要求输入为合法的分子，如不合法，无法进行分子优化。</span>
    </div>
    <a-icon type="loading" class="appletContainer-loading" v-if="!jsmeShow" />
    <div class="appletContainer-holder">
      <div class="appletContainer-wrapper">
        <div id="appletContainer"></div>
        <p class="appletContainer-info" v-if="jsmeShow && imgShow">
          <a-icon type="exclamation-circle" />
          <span class="appletContainer-info-text">上传结构式图片，系统可自动识别并进行绘制。点击提交前记得确认结构式无误哦～</span>
        </p>
        <div class="appletContainer-button" v-if="jsmeShow">
          <a-upload
            class="jsme-upload"
            name="file"
            :multiple="false"
            action="/molecule/innovation/ocsr/smiles"
            accept=".png, .jpg"
            :customRequest="customRequest"
            :headers="{'Content-Type': 'multipart/form-data'}"
            :showUploadList="false"
          >
            <a-button v-if="imgShow">
              <a-icon type="upload" />上传图片
            </a-button>
          </a-upload>
          <div class="jsme-submit" v-on:click="sendDataByFill">
            <a-button id="jsme-button" type="primary">确定</a-button>
          </div>
        </div>
      </div>
      <div class="appletContainer-img" v-if=" moculeImg!=='' && imgShow">
        <img :src="moculeImg" />
      </div>
    </div>
  </div>
</template>
<script>
import http from "utils/http";
import API from "service/apis";
import { showLoading, hideLoading } from "utils/loading";
import util from "utils/util";

function setTemplate() {
  const jme = document.getElementById("appletContainer").value;
  let name = "";
  document.JME.setTemplate(jme, "");
  document.JME.options("newLook");
}
export default {
  name: "jsmeInput",
  mounted() {
    this.pageInit();
    
  },

  data() {
    return {
      jme: null,
      jsmeShow: false,
      moculeImg: "",
      imgShow: true
    };
  },
  props: {
    cleanfill: {},
    metaData: {},
    showImg: true,
    jsmeWidth: 0,
    jsmeHeight: 0
  },

  watch: {
    cleanfill: function(val) {
      if (this.jme!==null) {
        this.jme.reset();
      this.moculeImg = "";
      }
      
    }
  },
  methods: {
    pageInit() {
      this.imgShow = this.showImg;
      this.jsmeLoader();
    },
    initMolimage(mol) {
      this.jme.readMolecule(mol);
    },

    jsmeLoader() {
      this.loaderIntval = setInterval(() => {
        if (window.JSApplet) {
          let jsme = new JSApplet.JSME(
            "appletContainer",
            `${this.jsmeWidth}px`,
            `${this.jsmeHeight}px`,
            {
              //optional parameters
              options: "query,hydrogens,star"
            }
          );
          this.jme = jsme;
          if (this.metaData && this.metaData.jme) {
            this.initMolimage(this.metaData.jme);
          }
          clearInterval(this.loaderIntval);
          this.jsmeShow = true;
        }
      }, 300);
    },

    sendDataByFill: function() {
      let str = "";
      let jmsfile = "";
      let new_smiles = "";
      var patt = /\[([A-Za-z][a-z]?)H?\d*:\d+\]/g;
      try {
        str = this.jme.smiles();
        if (str.replace(patt, "$1") === str) {
          new_smiles = "";
        } else {
          new_smiles = str;
          str = new_smiles.replace(patt, "$1");
        }
        this.moculeImg = '';
        jmsfile = this.jme.jmeFile();
      } catch (err) {
        console.log(err, "====>jsme插件报错");
      }
      this.$emit("getSmile", str, jmsfile, new_smiles);
      // console.log(999,str,jmsfile,new_smiles);
    },

    sendDataByPic(ocrInput) {
      if (ocrInput.smiles && ocrInput.smiles.length !== 0) {
        let jmestr = ocrInput.jme_string;
        this.jme.readMolecule(jmestr);
        this.moculeImg = ocrInput.img_url;
        // this.sendDataByFill();
      } else {
        this.moculeImg = ocrInput.img_url;
      }
      setTimeout(() => hideLoading(), 300);
    },

    customRequest(data) {
      showLoading();
      let reader = new FileReader();
      let filename = util.transformFileName(
        data.file.name,
        data.file.lastModified
      );
      reader.readAsDataURL(data.file);
      reader.onloadend = e => {
        let base64 = e.target.result;
        let formdata = new FormData();
        formdata.append("file", data.file);
        this.moculeImg = "";
        this.jme.reset();

        http
          .axiospostForUpData(API.apis.ocrinput, formdata)
          .then(res => {
            if (res.code && +res.code === 200) {
              this.sendDataByPic(res.data);
            } else if (+res.code === 400) {
              this.$message({
                showClose: false,
                message: "未识别到结构式，请确认图片无误。",
                type: "warning"
              });
              this.sendDataByPic(res.data);
            } else if (+res.code === 401) {
              this.$message({
                showClose: false,
                message: "用户未登录",
                type: "warning"
              });
              setTimeout(() => hideLoading(), 300);
            } else if (+res.code === 418) {
              this.$message({
                showClose: false,
                message: "仅支持.jpg和.png格式的图片",
                type: "error"
              });
              setTimeout(() => hideLoading(), 300);
            } else {
              this.$message({
                showClose: false,
                message: "系统错误，请稍后重试。",
                type: "error"
              });
              setTimeout(() => hideLoading(), 300);
            }
          })
          .catch(err => {
            console.log(err);
            this.$message({
              showClose: false,
              message: "系统错误，请稍后重试。",
              type: "error"
            });
            setTimeout(() => hideLoading(), 300);
          });
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.appletContainer-loading {
  width: 500px;
  margin: 80px 0 50px;
  color: #1890ff;
  font-size: 40px;
  text-align: center;
}
.appletContainer-holder {
  display: flex;
  .appletContainer-wrapper {
    position: relative;
    margin-top: 10px;
    #appletContainer {
      box-shadow: 0px 0px 5px 2px #cccccc;
    }

    .appletContainer-info {
      font-family: PingFangSC-Regular;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.25);
      text-align: center;
      margin-top: 20px;
      .appletContainer-info-text {
        margin-left: 3px;
      }
    }
    .appletContainer-button {
      display: flex;
      justify-content: space-around;
      position: absolute;
      top: 7px;
      right: 0;
      z-index: 10;
      .jsme-submit {
        margin-left: 15px;
        margin-right: 10px;
      }
      .jsme-upload {
        // width: 100px;
      }
    }
  }
  .appletContainer-img {
    background: #fafafa;
    width: 300px;
    height: 300px;
    margin-left: 60px;
    margin-top: 10px;
    padding: 16px;
    box-shadow: 0px 0px 5px 4px #cccccc;
    img {
      max-width: 268px;
      max-height: 268px;
    }
  }
}
</style>

