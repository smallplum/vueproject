<template>
  <div class="box">
    <div class="welcome">
      <div id="components-form-demo-advanced-search">
        <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
          <a-row :gutter="24">
            <a-col :key="1" :span="8" :style="{ display: 1 < count ? 'block' : 'none' }">
              <a-form-item
                label="任务类型: "
                :label-col="{ span: 5,offset:1 }"
                :wrapper-col="{ span: 12,offset:1 }"
              >
                <a-select
                  :getPopupContainer="triggerNode=>triggerNode.parentNode"
                  v-decorator="[
                    'type'
                  ]"
                  placeholder="骨架跃迁"
                  @change="handleSelectChange"
                  style="width:200px;"
                >
                  <a-select-option value="3">骨架跃迁</a-select-option>
                  <a-select-option value="1">骨架衍生</a-select-option>
                  <a-select-option value="2">分子优化</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="8" :key="2" :style="{ display: 2 < count ? 'block' : 'none' }">
              <a-form-item
                label="任务名称:"
                :label-col="{ span: 5,offset:1 }"
                :wrapper-col="{ span: 12,offset:1 }"
              >
                <a-input
                  v-decorator="[
                'name'
              ]"
                  placeholder="请输入"
                  style="width:200px;"
                />
              </a-form-item>
            </a-col>

            <a-col
              :span="8"
              :key="3"
              class="starttime"
              :style="{ display: 3 < count ? 'block' : 'none' }"
            >
              <a-form-item
                v-bind="formItemLayout"
                label="发起时间:"
                :label-col="{ span: 5,offset:1 }"
                :wrapper-col="{ span: 12,offset:1 }"
              >
                <a-range-picker
                  v-decorator="['time', rangeConfig]"
                  :allowClear="allowClear"
                  style="width:230px;"
                />
              </a-form-item>
            </a-col>

            <!-- <a-col
              :span="8"
              :key="4"
              class="people"
              :style="{ display: 4 < count ? 'block' : 'none' }"
            >
              <a-form-item
                label="发起人:"
                :label-col="{ span: 5,offset:1 }"
                :wrapper-col="{ span: 12,offset:1 }"
              >
                <a-input
                  v-decorator="[
                    'people'
                  ]"
                  placeholder="请输入"
                  style="width:200px;"
                />
              </a-form-item>
            </a-col>-->
          </a-row>
          <a-row>
            <a-col
              :span="24"
              :style="!expand?{ textAlign: 'right',marginTop:'-5px' }:{ textAlign: 'right',marginTop:'40px' }"
              class="btnsub"
            >
              <a-button type="primary" icon="search" html-type="submit">检索</a-button>
              <a-button :style="{ marginLeft: '8px' }" @click="handleReset">重置</a-button>
              <!-- <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="toggle">
                {{ !expand ?'展开':'收起'}}
                <a-icon :type="expand ? 'up' : 'down'" />
              </a>-->
            </a-col>
          </a-row>
        </a-form>
        <div class="search-result-list">
          <div class="fresh">
            <a-button
              type="primary"
              icon="retweet"
              size="default"
              class="fresh_btn"
              @click="refresh"
            >刷新</a-button>
            <a-form-item
              label="自动刷新:"
              :label-col="{ span: 5,offset:2 }"
              :wrapper-col="{ span: 12,offset:1  }"
            >
              <a-select
                :getPopupContainer="triggerNode=>triggerNode.parentNode"
                v-decorator="[
                    'type'
                  ]"
                placeholder="5分钟"
                @change="handleTimeChange"
                style="width:200px;"
              >
                <a-select-option value="5分钟">5分钟</a-select-option>
                <a-select-option value="10分钟">10分钟</a-select-option>
                <a-select-option value="15分钟">15分钟</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="task_table">
            <a-table
              :columns="this.listcolumns"
              :dataSource="this.listdata"
              :pagination="false"
              @change="handleTableChange"
              :loading="loading"
              rowKey="listdata"
              bordered
            >
              <span slot="name" slot-scope="spoce">
                <a href="javascript:;" @click="goTodetail(spoce)">{{spoce.name}}</a>
              </span>

              <span
                style="display:block;cursor:pointer;width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
                slot="originSmiles"
                slot-scope="spoce"
              >
                <a-tooltip>
                  <template slot="title">
                    <pre>{{spoce.showcontent }}</pre>
                  </template>
                  {{spoce.originSmiles}}
                  <!--  -->
                </a-tooltip>
              </span>
              <!-- <div v-if="showtext" style="width:200px;height:60px;background:yellow;"></div> -->
              <!-- <span slot="stateStr" slot-scope="stateStr">
                <a href="javascript:;">{{stateStr}}</a>
              </span>-->
              <span class="state-type" slot="stateStr" slot-scope="stateStr, record">
                <div
                  v-if="stateStr"
                  :class="[+record.state === 1 ? 'orange_status' : '',
                +record.state === 10 ? 'blue_status' : '',
                +record.state === 11 ? 'blue_status' : '',
                +record.state === 12 ? 'blue_status' : '',
                +record.state === 13 ? 'blue_status' : '',
                +record.state === 50 ? 'red_status' : '',
                +record.state === 30 ? 'yellow_status' : '',
                +record.state === 20 ? 'green_status' : '',
                'status_default']"
                ></div>
                <div>{{stateStr}}</div>
              </span>
              <span slot="index" slot-scope="spoce">
                <a href="javascript:;" class="hascollect">
                  <a-icon
                    type="heart"
                    :theme="listdata[spoce].collect?'filled':'outlined'"
                    @click="collectTask(spoce)"
                    ref="heart"
                  />
                </a>
              </span>
              <span slot="pause" slot-scope="spoce">
                <a href="javascript:;" class="hascollect">
                  <a-icon type="info-circle" @click="pauseTask(spoce)" />
                </a>
              </span>
              <!-- <span slot="delete" slot-scope="spoce">
                <a href="javascript:;" class="hascollect">
                  <a-icon type="delete" @click="deleteTask(spoce)" />
                </a>
              </span>-->
              <template slot="delete" slot-scope="text, spoce">
                <a-popconfirm title="确定要删除该任务吗?" @confirm="() => onDelete(spoce)">
                  <a href="javascript:;"><a-icon type="delete" /></a>
                </a-popconfirm>
              </template>
              <template slot="description" slot-scope="text,spoce">
                <editable-cell
                  :text="spoce.description"
                  @change="onCellChange(spoce, 'description', $event)"
                />
              </template>
            </a-table>
            <a-pagination
              class="list-table-pagination"
              :pageSizeOptions="pagination.pageSizeOptions"
              :total="pagination.allCount"
              showSizeChanger
              :pageSize="pagination.pageSize"
              v-model="pagination.current"
              :defaultCurrent="pagination.current"
              @showSizeChange="onShowSizeChange"
              @change="onPageChange"
            >
              <template slot="buildOptionText" slot-scope="props">
                <span v-if="props.value!=='50'">{{props.value}}条/页</span>
                <span v-if="props.value==='50'">全部</span>
              </template>
            </a-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="flogo">
      <span>Copyright © 2018 Stonewise All Rights Reserved | 京ICP备18054269号</span>
    </div>-->
  </div>
</template>

<script>
import reqwest from "reqwest";
import axios from "axios";
import http from "utils/http";
import API from "service/apis";
import moment from "moment";
import EditableCell from "components/EditableCell";
let listcolumns = [
  {
    title: "任务名称", //列头显示文字
    key: "name", //Vue 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性
    scopedSlots: { customRender: "name" },
    align: "center",
    width: "100px"
  },
  // {
  //   title: "发起人",
  //   dataIndex: "sponser",
  //   key: "sponser"
  // },
  {
    title: "SMILES",
    key: "originSmiles",
    scopedSlots: { customRender: "originSmiles" },
    align: "center",
    width: "160px"
  },
  {
    title: "开始时间",
    dataIndex: "begintime",
    key: "begintime",
    align: "center"
  },
  {
    title: "持续时间",
    dataIndex: "durationStr",
    key: "durationStr",
    align: "center",
    width: "100px"
  },
  {
    title: "状态",
    dataIndex: "stateStr",
    filters: [
      { text: "排队中", value: "1" },
      { text: "运行中", value: "10" },
      { text: "已终止", value: "30" },
      { text: "运行出错", value: "50" },
      { text: "已完成", value: "20" }
    ],
    key: "stateStr",
    align: "center",
    width: "120px",
    scopedSlots: { customRender: "stateStr" }
  },
  {
    title: "收藏",
    dataIndex: "index",
    key: "index",
    filters: [{ text: "是", value: "yes" }, { text: "否", value: "no" }],
    filterMultiple: false,
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "80px"
  },
  {
    title: "终止任务",
    key: "pause",
    scopedSlots: { customRender: "pause" },
    align: "center"
  },
  {
    title: "删除任务",
    key: "delete",
    dataIndex: "delete",
    align: "center",
    scopedSlots: { customRender: "delete" } //使用 columns 时，可以通过该属性配置支持 slot-scope 的属性
  },
  {
    title: "备注",
    dataIndex: "description",
    width: "220px",
    scopedSlots: { customRender: "description" },
    align: "center"
  }
];

export default {
  name: "historypage",
  components: {
    EditableCell
  },
  data() {
    return {
      allowClear: false,
      // showtext:true,
      loading: false,
      expand: false,
      form: this.$form.createForm(this, { name: "advanced_search" }),
      listcolumns,
      listdata: [],
      task_type: "",
      task_name: "",
      task_timebegin: "",
      task_timeend: "",
      task_people: "",
      datetotal: "",
      iscollect: "", //传的值collect
      colorcollect: false,
      querycollect: "", //收藏过滤传的值
      querystate: [],
      statemid: "",
      page1: 1,
      deletepage: "",
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      //表格
      key: "",
      rangeConfig: {
        rules: [{ type: "array" }]
      },
      pagination: {
        pageSizeOptions: ["5", "10", "20"],
        current: 1,
        pageSize: 10,
        allCount: 0
      },
      timer: null,
      freshtime: ""
    };
  },
  computed: {
    count() {
      return this.expand ? 5 : 4;
    }
  },
  created() {},
  mounted() {
    // console.log(333, this.pagination.current, this.$route.query.page);

    if (
      this.$route.query.page !== undefined ||
      this.$route.query.pageSize !== undefined
    ) {
      this.pagination.current = Number(this.$route.query.page);
      this.pagination.pageSize = Number(this.$route.query.pageSize);
      // console.log(222, this.pagination.current);

      this.searchForData(this.$route.query.page, this.$route.query.pageSize);
    } else {
      // console.log(111, this.pagination.current);
      this.searchForData(this.pagination.current, this.pagination.pageSize);
    }
    if (this.timer) {
      clearInterval(this.timer);
    } else {
      this.timer = setInterval(() => {
        this.searchForData(this.current, this.pagination.pageSize);
      }, 300000);
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "time_related_controls" });
  },
  methods: {
    onDelete(spoce) {
      let params = {
        taskId: spoce.id
      };
      http
        .axiospost(API.apis.deletetask, params)
        .then(res => {
          if (res.code == 200) {
            this.loading = true;
            this.$message({
              showClose: false,
              message: '删除成功',
              type: "success"
            });
            if (this.pagination.allCount % 10 === 1) {
              this.current = this.page1 - 1;
              this.pagination.current = this.current;
            } else {
              this.current = this.page1;
            }
            this.searchForData(this.current, this.pagination.pageSize);
          } else {
            this.$message({
              showClose: false,
              message: res.info || "系统错误，请稍后重试",
              type: "error"
            });
          }
        })
        .catch(err => {
          console.warn("接口报错：", err);
          this.$message({
            showClose: false,
            message: "系统错误，请稍后重试",
            type: "error"
          });
        });
    },
    onCellChange(spoce, dataIndex, value) {
      // console.log(spoce, dataIndex, value);
      let params = {
        taskId: spoce.id,
        description: value
      };
      http
        .axiospost(API.apis.taskdescription, params)
        .then(res => {
          if (res.code == 200) {
            this.current = this.page1;
            this.searchForData(this.current, this.pagination.pageSize);
          } else {
            this.$message({
              showClose: false,
              message: res.info || "系统错误，请稍后重试",
              type: "error"
            });
          }
        })
        .catch(err => {
          console.warn("接口报错：", err);
          this.$message({
            showClose: false,
            message: "系统错误，请稍后重试",
            type: "error"
          });
        });
    },
    searchForData(page, pz) {
      let params = {
        page: page,
        pageSize: pz
      };
      if (this.task_type) {
        params = Object.assign(params, { type: this.task_type });
      }
      if (this.task_name) {
        params = Object.assign(params, { name: this.task_name });
      }
      if (this.task_timebegin) {
        params = Object.assign(params, { btimeStr: this.task_timebegin });
      }
      if (this.task_timeend) {
        params = Object.assign(params, { etimeStr: this.task_timeend });
      }
      if (this.querycollect !== "") {
        params = Object.assign(params, { collect: this.querycollect });
      }
      if (this.querystate) {
        params = Object.assign(params, { states: this.querystate });
      }
      http
        .axiosget(API.apis.tasklist, params)
        .then(res => {
          if (res.code == 200) {
            this.loading = false;
            if (+res.data.allCount !== 0) {
              // console.log(res.data);
              this.listdata = res.data.list;
              this.pagination.allCount = res.data.allCount;
              this.page1 = page;
              for (var i = 0; i < this.listdata.length; i++) {
                // this.listdata[i].collect = this.listdata[i].collect === 0
                this.listdata[i].collect = !(this.listdata[i].collect === 0);
                // console.log(999,this.listdata[i].collect);
                this.listdata[i].index = i;
                this.listdata[i].description = this.listdata[i].description;
                this.listdata[i].begintime = moment(
                  this.listdata[i].ctime
                ).format("YYYY-MM-DD HH:mm:ss");

                if (this.listdata[i].type === 2) {
                  if (this.listdata[i].chainMoleculeViews !== null) {
                    this.listdata[i].showcontent = "";
                    for (
                      var j = 0;
                      j < this.listdata[i].chainMoleculeViews.length;
                      j++
                    ) {
                      this.listdata[i].showcontent += `第${j + 1}次优化${
                        this.listdata[i].chainMoleculeViews[j].smiles
                      }\n`;
                    }
                  } else {
                    this.listdata[
                      i
                    ].showcontent = `第1次优化${this.listdata[i].originSmiles}`;
                  }
                } else {
                  this.listdata[i].showcontent = this.listdata[i].originSmiles;
                }

                // this.listdata[i].delaytime = moment(this.listdata[i].utime).diff(this.listdata[i].ctime,'minute');
              }
            } else {
              this.listdata = [];
              this.pagination.allCount = res.data.allCount;
            }
          } else {
            this.loading = false;
            this.$message({
              showClose: false,
              message: res.info || "系统错误，请稍后重试",
              type: "error"
            });
          }
        })
        .catch(err => {
          this.loading = false;
          console.warn("接口报错：", err);
          this.$message({
            showClose: false,
            message: "系统错误，请稍后重试",
            type: "error"
          });
        });
    },
    onShowSizeChange(current, pageSize) {
      this.loading = true;
      this.pagination.pageSize = pageSize;
      this.searchForData(current, this.pagination.pageSize);
    },
    onPageChange(pageNumber) {
      this.loading = true;
      this.searchForData(pageNumber, this.pagination.pageSize);
    },
    handleTableChange(pagination, filters, sorter) {
      this.loading = true;
      //过滤状态和是否收藏
      // console.log(999, filters.stateStr.join(','));
      if (filters.stateStr) {
        this.querystate = filters.stateStr.join(",");
        // console.log(444, this.querystate);
        this.current = 1;
        this.pagination.current = 1;
        this.searchForData(this.current, this.pagination.pageSize);
      } else {
        // this.querystate = [];
      }
      // console.log(222,filters.index);

      if (filters.index && filters.index.length === 1) {
        filters.index[0] === "yes"
          ? (this.querycollect = 1)
          : (this.querycollect = 0);
        this.current = 1;
        this.pagination.current = 1;
        this.searchForData(this.current, this.pagination.pageSize);
      } else {
        this.querycollect = "";
        this.current = 1;
        this.pagination.current = 1;
        this.searchForData(this.current, this.pagination.pageSize);
      }
      // filters.index[0]&&filters.index[0]==='yes'?this.querycollect = 1:this.querycollect = 0;
    },
    refresh() {
      // console.log("点击刷新");
      this.loading = true;
      this.current = 1;
      this.pagination.current = 1;
      this.searchForData(this.current, this.pagination.pageSize);
    }, //刷新
    handleTimeChange(value) {
      var reg = /[\u4e00-\u9fa5]/g;
      // console.log(typeof(Number(value.replace(reg, "")))); //下拉菜单刷新时间
      this.freshtime = Number(value.replace(reg, "")) * 60000;
      // console.log(Number(value.replace(reg, "")), this.freshtime);

      this.current = 1;
      this.pagination.current = 1;
      this.timer = setInterval(() => {
        this.searchForData(this.current, this.pagination.pageSize);
      }, this.freshtime);
    },
    selectStatus(e) {
      console.log("筛选" + e.currentTarget.parentElement);
    },
    goTodetail(spoce) {
      // console.log("goTodetail", spoce);

      let routeData = this.$router.resolve({
        path: "/search/taskdetail",
        query: {
          taskid: spoce.id,
          page: this.page1,
          pageSize: this.pagination.pageSize
        }
      });
      window.open(routeData.href, "_blank");
      // this.$router.push("/search/taskdetail");
    },
    collectTask(index) {
      // this.loading = true;
      // console.log("收藏任务", index, this.listdata[index]);
      this.listdata[index].collect = !this.listdata[index].collect;
      if (this.listdata[index].collect === false) {
        this.iscollect = 0;
      } else {
        this.iscollect = 1;
      }
      let params = {
        taskId: this.listdata[index].id,
        collect: this.iscollect
      };
      http
        .axiospost(API.apis.taskcollect, params)
        .then(res => {
          if (res.code == 200) {
            this.current = this.page1;
            this.searchForData(this.current, this.pagination.pageSize);
          } else {
            this.$message({
              showClose: false,
              message: res.info || "系统错误，请稍后重试",
              type: "error"
            });
          }
        })
        .catch(err => {
          console.warn("接口报错：", err);
          this.$message({
            showClose: false,
            message: "系统错误，请稍后重试",
            type: "error"
          });
        });
    },
    pauseTask(spoce) {
      // console.log("终止任务", spoce);
      let params = {
        taskId: spoce.id
      };
      http
        .axiospost(API.apis.stoptask, params)
        .then(res => {
          if (res.code == 200) {
            this.current = this.page1;
            this.searchForData(this.current, this.pagination.pageSize);
          } else {
            this.$message({
              showClose: false,
              message: res.info || "系统错误，请稍后重试",
              type: "error"
            });
          }
        })
        .catch(err => {
          console.warn("接口报错：", err);
          this.$message({
            showClose: false,
            message: "系统错误，请稍后重试",
            type: "error"
          });
        });
    }, //终止任务
    deleteTask(spoce) {
      this.loading = true;
      // console.log("删除任务", spoce.id);
      let params = {
        taskId: spoce.id
      };
      http
        .axiospost(API.apis.deletetask, params)
        .then(res => {
          if (res.code == 200) {
            if (this.pagination.allCount % 10 === 1) {
              this.current = this.page1 - 1;
              this.pagination.current = this.current;
            } else {
              this.current = this.page1;
            }

            this.searchForData(this.current, this.pagination.pageSize);
          } else {
            this.$message({
              showClose: false,
              message: res.info || "系统错误，请稍后重试",
              type: "error"
            });
          }
        })
        .catch(err => {
          console.warn("接口报错：", err);
          this.$message({
            showClose: false,
            message: "系统错误，请稍后重试",
            type: "error"
          });
        });
    }, //删除任务
    handleSelectChange(value) {
      // console.log(value);//下拉菜单骨架衍生 跃迁
    },
    handleSearch(e) {
      e.preventDefault();
      this.loading = true;
      this.form.validateFields((error, values) => {
        console.log("error", error);
        // console.log(2222,values);
        if (values["time"]) {
          const rangeValue = values["time"];
          var datetotal = [
            rangeValue[0].format("YYYY-MM-DD"),
            rangeValue[1].format("YYYY-MM-DD")
          ];
          var [datebegin, dateend] = datetotal;
          this.task_timebegin = datebegin;
          this.task_timeend = dateend;
        } else {
          this.task_timebegin = "";
          this.task_timeend = "";
        }
        values["type"]
          ? (this.task_type = values["type"])
          : (this.task_type = "");
        values["name"]
          ? (this.task_name = values["name"])
          : (this.task_name = "");
        values["people"]
          ? (this.task_people = values["people"])
          : (this.task_people = "");
      });

      // console.log(
      //   "提交数据",
      //   this.task_type,
      //   this.task_name,
      //   this.task_timebegin,
      //   this.task_timeend,
      //   this.task_people
      // );
      this.current = 1;
      this.pagination.current = 1;
      this.searchForData(this.current, this.pagination.pageSize);
    },

    handleReset() {
      this.loading = true;
      this.form.resetFields();
      this.task_type = "";
      this.task_name = "";
      this.task_timebegin = "";
      this.task_timeend = "";
      this.task_people = "";
      this.current = 1;
      this.pagination.current = 1;
      this.searchForData(this.current, this.pagination.pageSize);
    },

    toggle() {
      this.expand = !this.expand;
    }
  }
};
</script>

<style lang="scss" scoped>
.ant-advanced-search-form {
  padding: 24px;
  background: #fbfbfb;
  // border: 1px solid #d9d9d9;
  border-radius: 6px;
}

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}

#components-form-demo-advanced-search .ant-form {
  max-width: none;
}
#components-form-demo-advanced-search .search-result-list {
  margin-top: 0px;
  // border: 1px dashed #e9e9e9;
  border-radius: 6px;
  // background-color: #fbfbfb;
  min-height: 200px;
  text-align: center;
  padding-top: 0px;
  padding-bottom: 55px;
}
.starttime {
  margin-top: -4px;
}
.btnsub {
  margin-top: 8px;
}
.people {
  display: block;
  position: absolute;
  margin-top: 50px;
  // margin-left: 26px;
}
.fresh /deep/ .ant-form-item {
  margin-bottom: 0;
}
.fresh {
  width: 90%;
  height: 60px;
  // border: 1px solid red;
  margin-left: 5%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .fresh_btn {
  }
}
.task_table {
  width: 90%;
  // height: 660px;
  // border: 1px solid red;
  margin-top: 10px;
  margin-left: 5%;
}
.box {
  width: 100%;
  height: 100%;
  .welcome {
    margin: 24px 24px;
    background: #fff;
    // height: 900px;
    padding: 16px 10px;
  }
  .flogo {
    text-align: center;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    line-height: 20px;
  }
}
.list-table-pagination {
  margin-top: 25px;
  float: right;
}
.hascollect {
  color: red;
  // background-color: red;
}
.state-type {
  display: flex;
  align-items: center;
  justify-content: center;
  .status_default {
    content: " ";
    height: 8px;
    width: 8px;
    margin-right: 8px;
    border-radius: 50%;
  }
  .red_status {
    background: #f5222d;
  }
  .green_status {
    background: #52c41a;
  }
  .yellow_status {
    background: #f3ea29;
  }
  .blue_status {
    background: #3ea5ff;
  }
  .orange_status {
    background: #f0c9b0;
  }
}
.task_table /deep/ .ant-table-tbody > tr > td {
    padding: 15px 10px!important;
}
.task_table /deep/ .ant-table-thead > tr > th {
    padding: 15px 10px!important;
}
</style>