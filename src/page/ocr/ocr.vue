<template class="home-page">
  <div>
    <!-- 主体框架 -->
    <div class="content-container">
      <div class="content-show">
        <div class="ocr-show">
          <!-- ocr搜索 -->
          <div class="ocr-search">
            <div class="title">
              <p class="fir-line">OCR分子结构提取</p>
            </div>
            <div class="ipt">
              <div class="ipt-container">
                <span class="ipt-button">
                  选择文件
                  <input
                    type="file"
                    class="file-show"
                    value="选取文件"
                    ref="input_file"
                    @change="inputChange"
                  />
                </span>
                <input
                  class="input_file"
                  ref="ipt"
                  v-model="input_file"
                  @keyup.enter="showOCR"
                  placeholder="选择PDF/JPG格式文件"
                />
                <span class="icon-serach" v-on:click="showOCR"></span>
              </div>
            </div>
          </div>

          <!-- ocr内容 -->
          <div class="ocr-content">
            <div class="ocr-smile">
              <div class="ocr-img">
                <img src="static/img/test.png" />
              </div>
              <span>Cc1ccc(NC(=O)c2sccc2C)cc1S(=O)(=O)N1CCOCC1</span>
            </div>

            <div class="ocr-main">
              <div class="pdf-show">
                <el-scrollbar>
                  <img src />
                  <canvas></canvas>
                </el-scrollbar>
              </div>

              <div class="menu">
                <el-scrollbar>
                  <div
                    class="menu-item"
                    v-for="(item,index) in pageData"
                    :key="index"
                    @click="changePage(item)"
                  >
                    <img style="width:50px" :src="item" />
                  </div>
                </el-scrollbar>
              </div>

              <div class="clearfloat"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "collect",
  data() {
    return {
      input_file: "",
      file: [],
      account: JSON.parse(localStorage.getItem("user") || "[]").username
    };
  },
  methods: {
    inputChange() {
      this.file = this.$refs.input_file.files[0];
      this.input_file = this.file.name;
      console.log(this.$refs.input_file.files[0]);
      //需要将file信息保存到store以及session中；
    },
    showOCR() {
      console.log(this.file);
      this.$store.commit("setFile", this.file);
      this.$router.push("/ocr/readPDF");
    },

    logoutHandle() {
      console.log("xsx");
      this.$confirm("您确定要退出吗?", "退出管理平台", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          //需要通知后台，所以采用后台退出
          this.$store.commit("removeUser");
          this.$router.push("/login");
        })
        .catch(() => {});
    },

    //sendData
    sendDataByStr(str, tar) {
      console.log(str);
      this.$router.push({
        path: "/searching",
        query: {
          smiles: str,
          target: tar
        }
      });
    }
  },

  created: function() {}
};
</script>

<style lang="scss" scoped>
.home-page {
  width: 100%;
}
.content-container {
  width: 100%;
  background-color: rgb(238, 247, 255);
}
//主体信息显示部分
.content-show {
  width: 900px;
  margin: 0px auto;
  padding-top: 50px;
  padding-left: 60px;
  padding-bottom: 100px;
}
.ocr-show {
  clear: both;
  width: 95%;
  margin: auto;
  margin-bottom: 15px;
}

.ocr-search {
  text-align: left;
  padding-bottom: 20px;
  .fir-line {
    color: rgb(47, 138, 219);
    font-size: 30px;
    letter-spacing: 5px;
    font-weight: bold;
  }
  .ipt-button {
    padding: 10px 10px;
    height: 40px;
    width: 80px;
    line-height: 20px;
    position: relative;
    border: 1px solid #999;
    text-decoration: none;
    color: white;
    float: left;
    font-size: 16px;
    background-color: rgb(47, 138, 219);
    .file-show {
      position: absolute;
      overflow: hidden;
      right: 0;
      top: 0;
      opacity: 0;
    }
  }
  .ipt {
    width: 800px;
    height: 45px;
    margin-top: 35px;
    margin-bottom: 30px;
    .ipt-container {
      width: 800px;
      height: 45px;
      border-radius: 35px;
      border: 2px solid #3d93de;
      background: #fff;
      overflow: hidden;
      position: relative;
      input {
        width: 100px;
        height: 45px;
        line-height: 52px;
        font-size: 20px;
        padding-left: 30px;
        display: block;
      }
      .input_file {
        width: 500px;
      }
      .icon-serach {
        clear: both;
        width: 38px;
        height: 38px;
        background: url("../../assets/img/icon-serach.png") 0 0 no-repeat;
        background-size: cover;
        position: absolute;
        right: 12px;
        top: 3px;
        cursor: pointer;
      }
    }
  }
}

.ocr-content {
  background-color: rgb(77, 77, 77);
  border-radius: 16px;
  padding-top: 25px;
  .ocr-smile {
    width: 95%;
    height: 150px;
    margin: auto;
    background-color: white;
    margin-bottom: 15px;
    .ocr-img {
      width: 150px;
      height: 150px;
      float: left;
      margin-left: 40px;
      img {
        width: 100%;
      }
    }
    span {
      float: left;
      margin-left: 50px;
      line-height: 150px;
      font-size: 16px;
      font-weight: bold;
    }
  }
}

.ocr-main {
  clear: both;
  width: 95%;
  margin: auto;
  background-color: rgb(77, 77, 77);
  padding-bottom: 20px;
  .pdf-show {
    float: left;
    width: 76%;
    height: 800px;
    border: 1px solid rgb(98, 98, 98);
    padding: 5px;
  }
  .menu {
    width: 20%;
    height: 800px;
    float: right;
    border: 1px solid rgb(98, 98, 98);
    padding: 5px;
  }
  .clearfloat {
    clear: both;
  }
}
</style>

<style scoped>
/* 此处需要限定使用范围 */
.el-menu-vertical-demo {
  border-radius: 8px;
}
.link .el-dropdown-link {
  color: white;
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

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>


