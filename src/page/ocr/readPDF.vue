<template>
  <div class="scaffold-input">
    <div class="title">
      <div class="tip">分子列表</div>
      <span class>从上传的文件中，系统共识别出 {{ total}} 个分子</span>
    </div>
    <div class="content-show">
      <div class="left-show">
        <a-tabs
          defaultActiveKey="1"
          tabPosition="left"
          :style="{ height: '500px'}"
          @change="changePage"
        >
          <a-tab-pane v-for="(item,index) in pageData" :tab="[`page ${index+1}`]" :key="index+1"></a-tab-pane>
        </a-tabs>
      </div>
      <!-- right show -->

      <div ref="rightShow" class="right-show">
        <!-- <el-scrollbar>滚动暂时不实现 -->
        <canvas id="canvas" class="right-canvas"></canvas>
      </div>

      <!-- end -->
      <div class="smile-show" v-if="smi_show">
        <div class="card">
          <div class="smile">
            <img :src="mol_img" />
          </div>
          <div class="info" id="test">
            <el-scrollbar>{{mol_info}}</el-scrollbar>
          </div>
        </div>
      </div>

      <div class="clearfloat"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "readPDF",
  created: function() {
    let result = JSON.parse(localStorage.getItem("result") || "[]");
    let img_url = JSON.parse(localStorage.getItem("img_url") || "[]");
    this.isOpen = true;
    let data = result;
    this.pageData = result.images_url;
    this.img_url = img_url;
    this.uploadShow = false;
    this.resultData = data;
    this.getOCR();
  },
  computed: {
    total() {
      return this.mols.length;
    }
  },
  inject: ["reload"],
  data() {
    return {
      uploadShow: false,
      img_url: "",
      pageData: [],
      isOpen: false,
      clickFun: null,
      mols: [],
      mol_img: "",
      mol_info: "",

      smi_show: false,
      canvasWidth: document.documentElement.clientWidth
    };
  },
  mounted() {
    this.mol_info = "";
    this.mol_img = "";
    window.addEventListener("resize", this.changeCanvas);
  },
  destroyed() {
    window.removeEventListener("resize", this.changeCanvas);
  },
  methods: {
    changeCanvas() {
      console.log("chaneg");
      this.reload();
    },
    changePage(e) {
      let item = this.pageData[e - 1];
      console.log(item);
      this.img_url = item;
      this.$store.commit("setPageImg", this.img_url);
      this.mol_info = "";
      this.mol_img = "";
      this.smi_show = false;
      this.getOCR();
    },
    //输入pdf并打开
    //目录栏

    sendDataByFile() {
      this.mol_info = "";
      this.mol_img = "";
      if (!this.$refs.input_file.files[0]) {
        this.$message({
          showClose: true,
          message: "请上传文件",
          type: "error"
        });
        return false;
      }
      let file = this.$refs.input_file.files[0];
      let name = file.name;
      let _this = this;

      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = e => {
        let base64 = e.target.result;
        axios({
          url: "/api/v1/get_pictures/",
          method: "post",
          data: {
            //input_scaffold_smiles: '',
            file_name: name,
            data: base64.split(",")[1]
          },
          headers: {
            "content-type": "application/json" // 默认值
          }
        })
          .then(res => {
            this.$store.commit("setData", res.data);

            let img_url = JSON.parse(localStorage.getItem("img_url") || "[]");
            this.isOpen = true;
            let data = res.data;
            this.pageData = res.data.images_url;
            this.img_url = img_url;
            this.uploadShow = false;
            this.resultData = data;

            this.showOCR(this.resultData);
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: "错误输入",
              type: "error"
            });
          });
      };
    },
    //显示crp
    getOCR() {
      //ajax
      let img_url = this.img_url;
      axios({
        url: "/api/v1/extract_structures/",
        method: "post",
        data: {
          image_path: img_url
        },
        headers: {
          "content-type": "application/json" // 默认值
        }
      })
        .then(res => {
          //是否需要再存一个值
          this.showOCR(res.data);
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: "错误输入 ",
            type: "error"
          });
        });
    },
    showOCR(data) {
      let _self = this;
      this.mols = data.molecules;
      var getPixelRatio = function(context) {
        var backingStore =
          context.backingStorePixelRatio ||
          context.webkitBackingStorePixelRatio ||
          context.mozBackingStorePixelRatio ||
          context.msBackingStorePixelRatio ||
          context.oBackingStorePixelRatio ||
          context.backingStorePixelRatio ||
          1;
        return (window.devicePixelRatio || 1) / backingStore;
      };
      let click = null;
      let dw = document.documentElement.clientWidth * 0.5;
      let dt = document.documentElement.clientHeight;
      console.log(dw);

      let height = (dw * data.png_height) / data.png_width;
      let width = dw; //超出长度需要overheden,另外css需要调整，居中
      let canvas = document.getElementById("canvas");

      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext("2d");
      var ratio = getPixelRatio(ctx);

      let img = new Image();
      img.onload = function() {
        let p = null;
        draw(p);
      };

      if (true) {
        console.log(this.clickFun);
        canvas.removeEventListener("click", this.clickFun, false);
        //remove时和add的function不能写在同一个局部函数里，会被刷新，只能重新赋值，不能重新定义
        this.clickFun = function(e) {
          let p = getEventPosition(e);
          draw(p);
          let put = null;
          put = data.molecules;
          console.log(put[click]);
          let test = null;
          test = put[click];
          console.log(test);
          if (typeof test == "undefined") {
            console.log("test");
          } else {
            _self.mol_img = test[5];
            _self.mol_info = test[0];
            _self.smi_show = true;
          }
        };
        canvas.addEventListener("click", this.clickFun, false);
      }

      function draw(p) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#0695FF"; //定义矩形的颜色
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height); //需要写在src之前
        //ctx.drawImage(img,50,50,100,100);
        let arr = data.molecules;
        arr.forEach(function(v, i) {
          console.log(v);
          ctx.beginPath();
          ctx.rect(
            v[1] * width,
            v[2] * height,
            (v[3] - v[1]) * width,
            (v[4] - v[2]) * height
          );
          ctx.stroke();
          if (p && ctx.isPointInPath(p.x, p.y)) {
            //如果传入了事件坐标，就用isPointInPath判断一下
            //如果当前环境覆盖了该坐标，就将当前环境的index值放到数组里
            click = i;
          } else {
          }
          console.log(click);
        });
      }

      function getEventPosition(e) {
        let x, y;
        if (e.layerX || e.layerX == 0) {
          x = e.layerX;
          y = e.layerY;
        } else if (e.offsetX || e.offsetX == 0) {
          // Opera
          x = e.offsetX;
          y = e.offsetY;
        }
        return { x: x, y: y }; //返回的是event 的位置
      }

      //canvas.addEventListener('click', onClick,false);
      img.src = this.img_url; //图片的位置需要仔细研究
      //img.src ="http://localhost:8080/static/img/register AI.png" //最初版
    }
  }
};
</script>

<style lang="scss" scoped>
.home-page {
  width: 100%;
}
.tip {
  font-weight: bold;
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.85);
}
.scaffold-input {
  margin: 24px 24px;
  background: #fff;
  padding: 16px 16px;
}
//主体信息显示部分
.content-show {
  width: 100%;
  margin-top: 16px;
}
.read-menu {
  float: left;
  width: 500px;
  height: 90px;
}
.menu-botton {
  float: left;
}
.float-menu {
  height: 90px;
  width: 500px;
  margin-left: 10px;
  .menu {
    float: left;
    margin-left: 5px;
    background-color: white;
    border-radius: 3px;
    height: 50px;
    width: 50px;
    margin-bottom: 5px;
  }
  .menu-button {
    background-color: white;
    font-size: 14px;
    margin-top: 10px;
  }
}
.catalog {
  clear: both;
  height: 500px;
  padding-top: 20px;
}

.left-show {
  clear: both;
  float: left;
  background-color: white;
  img {
    width: 100%;
  }
}

.card {
  position: relative;
  width: 200px;
  height: 300px;
  background-color: #fff;
  border: 0.5px solid rgb(217, 217, 217);
  border-radius: 2px;
  margin: 0px auto;
  box-shadow: 2px 1px 3px 0px rgb(217, 217, 217);
  .smile {
    width: 200px;
    height: 200px;
    line-height: 200px;
    border-bottom: 0.5px solid rgb(217, 217, 217);
    position: relative;
    text-align: center;
    img {
      //长度或者宽度
      max-width: 98%;
      max-height: 98%;
      padding-top: 10px;
      vertical-align: middle;
    }
  }
  .info {
    padding: 8px 15px;
    text-align: left;
    font-size: 13px;
    //border-bottom: 0.5px solid rgb(217,217,217);
    div {
      margin-bottom: 4px;
    }
    span {
      float: right;
    }
  }
}
.card:hover {
  box-shadow: 4px 2px 18px 0px rgb(217, 217, 217);
}
.smile-show {
  background: #fafafa;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  overflow: hidden;
  z-index: 9999;
  position: fixed;
  text-align: center;
  height: 300px;
  right: 45px;
  top: 226px;

  word-wrap: break-word;
  word-break: break-all;
}
.right-show {
  padding: 16px 16px;
  float: left;
  background-color: #fafafa;
  position: relative;
  .right-canvas {
    //position: absolute;//删除为了撑开，也许有其他的麻烦
  }
}
.clearfloat {
  clear: both;
}
</style>

<style>
.left-show .ant-tabs .ant-tabs-left-bar .ant-tabs-tab {
  padding: 4px 12px;
  padding-left: 8px;
}
.left-show .ant-tabs-nav .ant-tabs-tab {
  padding: 12px 12px;
}
</style>


