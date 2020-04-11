<template class="home-page">
  <div>
    <!-- 主体框架 -->
    <div class="content-container">
      <div class="content-show">
        <!-- 个人信息 -->
        <div class="user-show">
          <div class="title">{{account}}</div>
          <div class="user-cont">
            <div class="left">
              <el-menu default-active="1" class="el-menu-vertical-demo">
                <el-menu-item index="1">
                  <span slot="title" @click="searchHis">查询历史</span>
                </el-menu-item>
                <el-menu-item index="2">
                  <span slot="title" @click="showCollect">我的收藏</span>
                </el-menu-item>
                <el-menu-item index="3">
                  <span slot="title" @click="userinfo">个人资料</span>
                </el-menu-item>
                <el-menu-item index="4">
                  <span slot="title" @click="security">安全设置</span>
                </el-menu-item>
              </el-menu>
            </div>

            <div class="right">
              <div class="userinfo-show">
                <div class="title">查询历史</div>
                <hr />
                <div class="showtable">
                  <!-- 搜索栏 -->
                  <div class="info-ui">
                    <div>
                      <el-input
                        style="width: 180px"
                        v-model="value1"
                        @keyup.enter.native="queryHis"
                        placeholder="查询历史记录"
                      ></el-input>
                    </div>
                    <div>
                      <el-date-picker
                        v-model="value2"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions1"
                        @change="queryHis"
                      ></el-date-picker>
                      <span @click="queryHis">
                        <img src="../../assets/img/icon-serach.png" />
                      </span>
                    </div>
                  </div>

                  <!-- 主体显示 -->
                  <div>
                    <el-table
                      :data="tableData.slice((currentPage-1)*PageSize,currentPage*PageSize)"
                      style="width: 100%"
                      :header-cell-style="tableHeaderColor"
                      @row-click="clickTable"
                    >
                      <el-table-column label="smiles式" prop="scaffold">
                        <template slot-scope="scope">
                          <span>{{scope.row.scaffold.smiles}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="分子结构" prop="scaffold">
                        <template slot-scope="scope">
                          <img
                            :src="scope.row.scaffold.img_url"
                            alt
                            style="width: 90px;height: 90px"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column label="查询时间" prop="time" width="100"></el-table-column>
                      <el-table-column label="查询靶点" prop="target">
                        <template slot-scope="scope">
                          <span>{{scope.row.target.entry}}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                    <!-- 分页设置 -->
                  </div>
                  <div class="page-busi">
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="pageSizes"
                      :page-size="PageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="totalCount"
                    ></el-pagination>
                  </div>
                </div>
              </div>
            </div>

            <div class="clearfloat"></div>
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
  name: "history",
  data() {
    return {
      // 日期
      value1: "",
      value2: "",
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      // 分页
      // 总数据
      tableData: [],
      // 默认显示第几页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 1,
      // 个数选择器（可修改）
      pageSizes: [5, 10],
      // 默认每页显示的条数（可修改）
      PageSize: 5,
      account: JSON.parse(localStorage.getItem("user") || "[]").username
    };
  },
  methods: {
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background-color: #eef7ff;color: #black;font-weight: 500;";
      }
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
    searchHis() {
      this.$router.push("/user/history");
    },
    userinfo() {
      this.$router.push("/user/userinfo");
    },
    security() {
      this.$router.push("/user/security");
    },
    showCollect() {
      this.$router.push("/user/collect");
    },
    // 分页
    // 每页显示的条数
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.PageSize = val;
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage = 1;
    },
    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val;
    },
    getData() {
      // 这里使用axios，使用时请提前引入
      axios
        .get("/api/v1/scaffolds/", {
          params: {
            username: JSON.parse(localStorage.getItem("user") || "[]").username
          }
        })
        .then(res => {
          // 将数据赋值给tableData
          console.log(res.data);
          let tdata = res.data;
          // 将数据的长度赋值给totalCount
          this.totalCount = tdata.length;
          this.tableData = tdata;
          console.log(this.totalCount);
        })
        .catch(err => {
          if (err.res_contents == "Username doesn't exist.") {
            this.$message({
              showClose: true,
              message: "用户不存在 ",
              type: "error"
            });
          } else {
            this.$message({
              showClose: true,
              message: "输入无效 ",
              type: "error"
            });
          }
        });
    },
    queryHis() {
      let time = this.value2;
      let input = this.value1;
      console.log(time);
      console.log(input);
      this.queryHisByTime(time, input);
    },
    queryHisByTime(time, input) {
      axios
        .get("/api/v1/scaffolds/", {
          params: {
            username: JSON.parse(localStorage.getItem("user") || "[]").username,
            date: time,
            scaffold: input
          }
        })
        .then(res => {
          // 将数据赋值给tableData
          console.log(res.data);
          let tdata = res.data;
          // 将数据的长度赋值给totalCount
          this.totalCount = tdata.length;
          this.tableData = tdata;
          console.log(this.totalCount);
        })
        .catch(err => {
          if (err.res_contents == "Username doesn't exist.") {
            this.$message({
              showClose: true,
              message: "用户不存在 ",
              type: "error"
            });
          } else {
            this.$message({
              showClose: true,
              message: "输入无效",
              type: "error"
            });
          }
        });
    },
    //行点击事件
    clickTable(row) {
      let str = row.scaffold.smiles;
      let tar = row.target.entry;
      this.submit(str, tar);
    },
    //sendData
    submit(str, tar) {
      if (tar.length != 0 && str.length != 0) {
        this.$router.push({
          path: "/search/derivationResult",
          query: {
            smiles: str,
            target: tar
          }
        });
      }
    }
  },

  created: function() {
    this.getData();
  }
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
.footer-container {
  width: 100%;
  background-color: rgb(0, 0, 0);
}

//主体信息显示部分
.content-show {
  width: 900px;
  margin: 0px auto;
  padding-top: 50px;
  padding-left: 80px;
}
.user-show {
  .title {
    color: rgb(103, 184, 254);
    float: left;
    font-size: 20px;
  }
}
.user-cont {
  clear: both;
  padding-top: 30px;
  width: 100%;
  .left {
    float: left;
    width: 20%;
    margin-top: 0px;
    border-radius: 8px;
  }
  .right {
    float: right;
    width: 77%;
    border-radius: 8px;
    margin: 0px auto;
    margin-bottom: 80px;
  }

  .clearfloat {
    clear: both;
  }
  .userinfo-show {
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    .title {
      font-size: 15px;
      padding-bottom: 10px;
    }
  }
}
.showtable {
  margin-top: 10px;
  margin-bottom: 30px;
  padding-left: 20px;

  .info-ui {
    margin: 0 auto;
    display: flex;
    clear: both;
    div {
      margin-right: 5px;
    }
    margin-bottom: 20px;
    img {
      height: 35px;
      width: 35px;
    }
  }
  .info-input {
    float: left;
    margin-left: 40px;
    margin-bottom: 20px;
    width: 300px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    padding: 5px;
    border-radius: 8px;
    font-size: 14;
  }
  .info-button {
    float: left;
    margin-left: 70px;
    width: 80px;
    border-radius: 8px;
    font-size: 14;
    color: white;
    background-color: rgb(103, 184, 254);
  }
  .page-busi {
    margin-top: 20px;
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


