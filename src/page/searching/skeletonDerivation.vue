<template>
  <div class="scaffold-input">
    <div class="title">
      <span class="tip">分子列表</span>
    </div>

    <div class="task_table">
      <a-table
        :columns="this.listcolumns"
        :dataSource="this.listdata"
        rowKey="listdata"
        :scroll="{ x: 900 }"
      >
        <span
          slot="name"
          slot-scope="spoce,record"
          style="display:block;cursor:pointer;width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
        >
          <a-tooltip placement="topLeft" overlayClassName="abc">
            <template slot="title">
              <pre>{{spoce.smiles }}</pre>
            </template>
            <a
              href="javascript:;"
              :class="+record.haveRead ===1?'text_gray':''"
              @click="goTodetail(spoce)"
            >{{spoce.smiles}}</a>
          </a-tooltip>
        </span>
        <div class="rank-table-img" slot="url" slot-scope="url">
          <img :src="url" />
        </div>
        <span
          slot="modify"
          slot-scope="spoce"
          style="display:block;cursor:pointer;width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
        >
          <a href="javascript:;">
            <a-icon type="form" @click="goTomodify(spoce)" ref="heart" />
          </a>
        </span>
        <span style="display:block;width:60px;" slot="index" slot-scope="spoce">
          <a href="javascript:;" class="hascollect">
            <a-icon
              type="heart"
              :theme="listdata[spoce].collect?'filled':'outlined'"
              @click="collectTask(spoce)"
              ref="heart"
            />
          </a>
        </span>
        <!-- <span slot="delete" slot-scope="spoce">
                <a href="javascript:;" class="hascollect">
                  <a-icon type="delete" @click="deleteTask(spoce)" />
                </a>
        </span>-->
        <template slot="delete" slot-scope="text, spoce">
          <span style="display:block;width:60px;">
            <a-popconfirm
              title="确定要删除该分子吗?"
              overlayClassName="moldele"
              @confirm="() => onDelete(spoce)"
            >
              <a href="javascript:;">
                <a-icon type="delete" />
              </a>
            </a-popconfirm>
          </span>
        </template>
        <template slot="description" slot-scope="text,spoce">
          <editable-cell
            :text="spoce.description"
            @change="onCellChange(spoce, 'description', $event)"
          />
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import http from "utils/http";
import util from "utils/util";
import API from "service/apis";
import moment from "moment";
import targetSelect from "components/targetSelect.vue";
import jsmeInput from "components/jsmeInput.vue";
import uploadInput from "components/uploadInput.vue";
import EditableCell from "components/EditableCell";
import { detailData } from "mock/mockData";
let listcolumns = [
  {
    title: "分子SMILES", //列头显示文字
    key: "name", //Vue 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性
    scopedSlots: { customRender: "name" },
    filters: [
      { text: "已阅", value: "haveread" },
      { text: "未阅", value: "noread" }
    ],
    filterMultiple: false,
    align: "center",
    width: "120px"
  },

  // {
  //   title: "发起人",
  //   dataIndex: "sponser",
  //   key: "sponser"
  // },
  {
    title: "结构式",
    key: "url",
    dataIndex: "url",
    scopedSlots: { customRender: "url" },
    align: "center",
    width: "150px"
  },
  {
    title: "创建时间",
    dataIndex: "begintime",
    key: "begintime",
    align: "center",
    width: "180px"
  },
  {
    title: "修改分子",
    key: "modify",
    dataIndex: "modify",
    align: "center",
    width: "100px",
    scopedSlots: { customRender: "modify" } //使用 columns 时，可以通过该属性配置支持 slot-scope 的属性
  },
  {
    title: "收藏",
    dataIndex: "index",
    key: "index",
    filters: [
      { text: "是", value: "yes" },
      { text: "否", value: "no" }
    ],
    filterMultiple: false,
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "90px"
  },
  {
    title: "删除分子",
    key: "delete",
    dataIndex: "delete",
    align: "center",
    width: "100px",
    scopedSlots: { customRender: "delete" } //使用 columns 时，可以通过该属性配置支持 slot-scope 的属性
  },
  {
    title: "备注",
    dataIndex: "description",
    width: "200px",
    scopedSlots: { customRender: "description" },
    align: "center"
  }
];

export default {
  data() {
    return {
      listcolumns,
      listdata: [],
      target_select: "请选择靶标",
      smile_input: "",
      input: "",
      dericationType: 1, //药物或阳性分子类型
      radioStyle: {
        display: "inline-block",
        height: "30px",
        lineHeight: "30px",
        marginBottom: "10px",
        position: "relative",
        span: {
          marginRight: "25px"
        }
      },
      jobname: "",
      jsmeType: 2, //jsme输出结果类型
      positive_molecule: "", //阳性分子的值
      disabledMolecule: true, //是否激活阳性分子按钮
      /////////定点衍生分子
      disabledPositonswitch: true, //是否禁用定点衍生的开关
      checkedPosition: false, //是否激活定点衍生的开关
      checkReverseall: false, //定点衍生反选
      positionImg: "", //当前选中的定点衍生分子图片
      positionChecked: [], //当前选中的定点衍生分子列表
      checkAll: false, //定点衍生全选
      checkList: [], //定点衍生分子选项列表
      allIndeterminate: true, //定点衍生全选默认样式
      reverseIndeterminate: true, //定点衍生反选默认样式
      showCheckedloading: false, // 是否展示定点衍生loading
      showPositioncontainer: false, // 是否展示定点衍生弹窗
      ///////////////////
      cleanfill: true,
      cleanselect: true,
      //input
      value: 1,
      fillShow: true,
      uploadShow: false,
      tar_res: "",
      origin_smile: "",
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
      }
    };
  },
  components: {
    "jsme-input": jsmeInput,
    "target-select": targetSelect,
    "upload-input": uploadInput,
    EditableCell
  },
  created() {
    console.log(11, detailData);
    this.listdata = detailData.data.moleculelist;
    for (var i = 0; i < this.listdata.length; i++) {
      this.listdata[i].begintime = moment(this.listdata[i].ctime).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.listdata[i].collect = !(this.listdata[i].collect === 0);
      this.listdata[i].index = i;
      this.listdata[i].description = this.listdata[i].description;
    }
  },
  watch: {
    input: function(val) {
      if (val != this.smile_input) {
        this.cleanfill = !this.cleanfill;
      }
      if (val && val.length !== 0) {
        this.disabledPositonswitch = false;
      } else {
        Object.assign(this, {
          checkedPosition: false,
          showCheckedloading: false,
          showPositioncontainer: false,
          disabledPositonswitch: true,
          allIndeterminate: true,
          reverseIndeterminate: true,
          positionChecked: []
        });
      }
    },
    dericationType: function(val) {
      if (val === 1) {
        this.positive_molecule = "";
        this.disabledMolecule = true;
        this.jsmeType = 2;
      } else if (val === 2) {
        this.target_select = "请选择靶标";
        this.cleanselect = !this.cleanselect;
        this.disabledMolecule = false;
        this.jsmeType = 1;
      }
    },
    checkedPosition: function(val) {
      this.onchangePosition(val);
    },
    positionChecked: function(val) {
      if (val.length === this.checkList.length) {
        this.allIndeterminate = false;
        this.reverseIndeterminate = false;
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    }
  },
  methods: {
    goTomodify() {
      let routeData = this.$router.resolve({
        path: "/search/molecularOptimize",
        query: {
          
        }
      });
      window.open(routeData.href, "_blank");
    },
    goTodetail(spoce) {
      // console.log("goTodetail", spoce);

      let routeData = this.$router.resolve({
        path: "/search/taskmoleculedetail",
        query: {
          taskid: spoce.id,
          page: this.page1,
          tabVal: 2,
          pageSize: this.pagination.pageSize,
          number: this.$route.query.number
        }
      });
      window.open(routeData.href, "_blank");
      // this.searchForData(this.page1, this.pagination.pageSize);
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
              message: "删除成功",
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
    clean() {
      this.target_select = "请选择靶标";
      this.positive_molecule = "";
      this.cleanselect = !this.cleanselect;
      this.smile_input = "";
      this.input = "";
      this.jobname = "";
      this.cleanfill = !this.cleanfill;
    },
    onChange(e) {
      if (e.target.value == 1) {
        this.uploadShow = false;
        this.fillShow = true;
      } else if (e.target.value == 2) {
        this.uploadShow = true;
        this.fillShow = false;
      } else if (e.target.value == 3) {
        this.uploadShow = false;
        this.fillShow = false;
      }
    },
    //点击输入框之后的默认行为
    onFocusmole(type) {
      this.dericationType = type;
      if (type === 2) {
        this.jsmeType = 1;
      }
    },
    //选择药物靶标或者阳性分子
    onMolechange(e) {
      this.dericationType = e.target.value;
    },
    //选择输入结果是阳性分子或者优势骨架
    onJsmechange(e) {
      this.jsmeType = e.target.value;
    },
    onSelectskeleton() {
      this.jsmeType = 2;
    },
    selectTarget(tar) {
      this.target_select = tar;
      this.onFocusmole(1);
    },
    getSmiles(smile) {
      //       console.log(999,smile);
      this.smile_input = smile;
      if (this.jsmeType === 1) {
        this.positive_molecule = this.smile_input;
      } else {
        this.input = this.smile_input;
      }
      //       this.input = this.smile_input;
      //       this.positive_molecule = this.smile_input;
    },
    getSmile(smile, file, new_smile) {
      // console.log(123,arguments[0][0],arguments[0][1],arguments[0][2]);
      if (this.jsmeType === 2) {
        // console.log(this.jsmeType);
        if (arguments[0][2] === "") {
          this.origin_smile = "";
        } else {
          this.origin_smile = arguments[0][2];
        }
        this.smile_input = arguments[0][0];
        this.input = this.smile_input;
        if (this.input.length === 0) {
          this.checkedPosition = false;
          this.disabledPositonswitch = true;
        } else if (this.checkedPosition) {
          this.checkedPosition = !this.checkedPosition;
          setTimeout(() => {
            this.checkedPosition = !this.checkedPosition;
          }, 300);
        }
      } else if (this.jsmeType === 1) {
        // console.log('aaaa',this.jsmeType,123,arguments[0][0],arguments[0][1],arguments[0][2]);
        this.target_select = "请选择靶标";
        this.cleanselect = !this.cleanselect;
        this.positive_molecule = arguments[0][0];
      }
    }

    //<--------------------END 定点衍生----------------->//
  }
};
</script>
<style lang="scss" scoped>
.rank-table-img {
  img {
    width: 108px;
  }
}
.text_gray {
  color: #676767;
}

.hascollect {
  color: red;
  // background-color: red;
}
.aaaaa /deep/ .ant-select-selection-selected-value {
  opacity: 0.7 !important;
}
.aaaaa /deep/ .ant-select-selection--single {
  width: 400px;
}
span {
  margin-right: 10px;
}
.fixed-point {
  color: rgba(0, 0, 0, 0.3);
  font-size: 14px;
  margin-top: 4px;
  margin-bottom: 10px;
  span {
    margin-left: 10px;
    img {
      width: 20px;
      height: 20px;
    }
  }
}
.scaffold-input {
  margin: 24px;
  background: #fff;
  padding: 16px;
  div {
    margin-bottom: 24px; //全部改成24px
  }
  .sub-title {
    margin-left: 24px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
  }
  .title {
    display: flex;
    align-items: center;
  }
  .title:before {
    content: " ";
    display: inline-block;
    height: 20px;
    width: 14px;
    background: #1890ff; /**控制图标颜色**/
    margin-right: 6px; /**图标与文字距离**/
  }
  .tip {
    font-weight: bold;
    margin-right: 20px;
    color: rgba(0, 0, 0, 0.85);
  }
  //没有div的margin-bottom
  .target {
    padding-left: 16px;
    margin-bottom: 0px;
  }
  .scaffold {
    padding-left: 24px;
  }
  .position-loading {
    width: 500px;
    margin: 50px 0;
    color: #1890ff;
    font-size: 40px;
    text-align: center;
  }

  .position-container {
    width: 750px;
    overflow: hidden;
    height: 400px;
    margin-left: 24px;
    background: #ffffff;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.5);
    .position-container-molecule {
      width: 100%;
      height: 80%;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      margin-bottom: 0;
      .position-container-image {
        position: relative;
        min-width: 50%;
        max-width: 66%;
        .position-container-image-toolpit {
          position: absolute;
          top: 25px;
          left: 30px;
          color: rgba(0, 0, 0, 0.25);
        }
        img {
          width: 100%;
        }
      }
      .position-container-select {
        width: 34%;
        height: 100%;
        position: relative;
        margin-left: 20px;
        margin-top: 30px;
        background: #fff;
        .position-container-select-header {
          position: absolute;
          top: 0;
        }
        .position-container-select-content {
          height: 91%;
          margin-top: 40px;
          overflow: scroll;
        }
      }
    }
  }
  hr {
    width: 99%;
    margin: 25px 7px;
    border: 0;
    height: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  }
  .input {
    margin-bottom: 0px;
  }
  .skeleton-container {
    display: flex;
    align-items: center;
    margin-bottom: 0;
  }
  .smile {
    margin-left: 24px;
  }
  .smile :before {
    content: " *";
    color: red;
    font-size: 100%;
    margin-right: 10px;
  }
  .skeleton-container-switch {
    margin-bottom: 24px;
    margin-left: 30px;
    span {
      margin-right: 5px;
    }
  }
  .input-conponent {
    padding: 0px 0px;
    div {
      margin-bottom: 0px;
    }
    .conponent {
      width: 700px;
    }
  }
}
.enter {
  text-align: right;
}
</style>

<style>
.focus-opacity {
  opacity: 0.7;
}
.a-input {
  width: 400px;
}
.smile .ant-input {
  width: 400px;
  margin-left: -7px;
}
.job {
  margin-left: 29px;
}
.job .ant-input {
  width: 400px;
  margin-left: 9px;
}
</style>
