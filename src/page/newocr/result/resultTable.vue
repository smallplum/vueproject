<template>
  <div class="rank-table">
    <a-table
      :columns="this.listColumn"
      :dataSource="this.tableList"
      :loading="tableloading"
      :pagination="false"
      rowKey="id"
      size="middle"
      class="rank-table-holder"
    >
      <div class="rank-table-img" slot="url" slot-scope="url">
        <img :src="url" />
      </div>
      <span slot="page" slot-scope="page">
        <p>{{`Page ${page}`}}</p>
      </span>
      <span slot="formula" slot-scope="formula">
        <p>{{formula && formula.length > 0 ? formula : '-'}}</p>
      </span>
      <span slot="smiles" slot-scope="smiles" class="rank-table-smiles">
        <p>{{smiles && smiles.length > 0 ? smiles : '-'}}</p>
      </span>
      <!-- <div class="rank-table-link" slot="action" slot-scope="text, record">
        <a-icon
          @click="showFeedbackModal(record)"
          :class="[`'rank-tableholder-table-icon' ${!record.feedback?' blue-icon':(+record.feedback.ocsrResult===1?' green-icon':' red-icon')}`]"
          type="file-sync"
        />
      </div>-->
    </a-table>
    <a-pagination
      class="rank-table-pagination"
      :pageSizeOptions="pagination.pageSizeOptions"
      :total="pagination.allCount"
      showQuickJumper
      showSizeChanger
      :pageSize="pagination.pageSize"
      v-model="pagination.current"
      @showSizeChange="onShowSizeChange"
      @change="onPageChange"
    >
      <template slot="buildOptionText" slot-scope="props">
        <span v-if="props.value<=100">{{props.value}}条/页</span>
        <span v-if="props.value>100">全部</span>
      </template>
    </a-pagination>
  </div>
</template>
<script>
import eventVue from "../event.js";
import http from "utils/http";
import util from "utils/util";
import API from "service/apis";
import { showLoading, hideLoading } from "utils/loading";
import { ocrUpload, ocrIdentify, molList } from "mock/mockData";

let listColumn = [
  {
    title: "ID",
    dataIndex: "id",
    width: 100
  },
  {
    title: "结构式",
    dataIndex: "url",
    scopedSlots: { customRender: "url" },
    width: 200
  },
  {
    title: "页面",
    dataIndex: "page",
    scopedSlots: { customRender: "page" },
    width: 150
  },
  {
    title: "分子式",
    dataIndex: "formula",
    scopedSlots: { customRender: "formula" },
    width: 150
  },
  {
    title: "SMILES",
    dataIndex: "smiles",
    scopedSlots: { customRender: "smiles" }
  }
  // {
  //   title: "操作",
  //   key: "action",
  //   scopedSlots: { customRender: "action" },
  //   width: 120
  // }
];
export default {
  name: "resultTable",
  data() {
    return {
      metaData: null,
      /// Start feedback popup ////
      feedBackData: {},
      cleanfill: true,
      showFeedbackmodal: false,
      modalStyle: {
        background: "#eeeeee",
        boxShadow: "inset 0px 0px 5px 5px #cccccc"
      },
      //// End feedback popup ////
      fileId: "",
      tableList: [],
      listColumn,
      pagination: {
        current: 1,
        pageSizeOptions: ["20", "50", "100","200"],
        allCount: 0,
        pageSize: 20
      },
      tableloading: false
    };
  },
  created() {
    this.initData();
  },
  mounted() {
    this.getMetaData(1, this.pagination.pageSize);
  },

  watch: {
    metaData(val) {
      this.tableList = val.list;
    }
  },
  methods: {
    initData() {
      eventVue.$off("getparentdata");
      eventVue.$on("getparentdata", () => {
        this.pagination.pageSize = 20;
        this.pagination.current = 1;
        this.getMetaData(this.pagination.current, this.pagination.pageSize);
      });
    },
    getMetaData(page, pz) {
      showLoading();
      this.tableloading = true;
      this.tableList = [];
      this.fileId = window.sessionStorage.getItem("uploadFileId");
      const param = { fileId: this.fileId, page: page, pageSize: pz };
      http
        .axiosget(API.apis.ocrmolslist, param)
        .then(res => {
          if (+res.code === 200 || +res.code === 201) {
            this.metaData = res.data;
            this.tableList = this.metaData.list;
            this.pagination.allCount = this.metaData.allCount;
            eventVue.$emit("passresultdata", this.metaData);
          } else {
            this.$message.error(res.info || "系统错误，请稍后重试");
          }
          setTimeout(() => {
            eventVue.$emit("receivefromtable");
            hideLoading();
          }, 300);
        })
        .catch(err => {
          this.$message.error("系统错误，请稍后重试");
          eventVue.$emit("receivefromtable");
          hideLoading();
        });

      this.tableloading = false;
    },
    regaindata() {
      this.getMetaData(this.pagination.current, this.pagination.pageSize);
    },
    onShowSizeChange(current, pageSize) {
      this.pagination.pageSize = pageSize;
      this.getMetaData(current, this.pagination.pageSize);
    },
    onPageChange(pageNumber) {
      this.getMetaData(pageNumber, this.pagination.pageSize);
    },
    //////////<--------Start feedback popup---------------->////////
    showFeedbackModal(data) {
      this.showFeedbackmodal = true;
      this.feedBackData = {
        jme: data.jme,
        fileMoleculeId: data.fileMoleculeId,
        smiles: data.smiles
      };
    },
    handleCancel() {
      this.feedBackData = {};
      this.cleanfill = !this.cleanfill;
      this.showFeedbackmodal = false;
    },
    getSmile(smile, jmefile) {
      this.feedBackData.jme = jmefile;
      this.feedBackData.smiles = smile;
      this.submitOpt();
    },
    submitOpt() {
      const param = {
        jme: this.feedBackData.jme,
        fileMoleculeId: this.feedBackData.fileMoleculeId,
        smiles: this.feedBackData.smiles
      };
      showLoading();
      http
        .axiospost(API.apis.ocrfeeback, param)
        .then(res => {
          if (+res.code === 200) {
            this.$message.success("分子修正成功");
            this.regaindata();
            this.handleCancel();
            hideLoading();
          } else {
            this.$message.error("分子修正失败，请检查分子合理性");
            this.handleCancel();
            hideLoading();
          }
        })
        .catch(err => {
          this.$message.error("系统错误，请稍后重试");
          hideLoading();
        });
    }
    //////////<--------End feedback popup---------------->////////
  }
};
</script>

<style lang="scss" scoped>
.rank-table {
  margin-left: 16px;
  overflow: hidden;
  .rank-table-holder {
    .rank-table-img {
      img {
        width: 108px;
      }
    }
    .rank-table-smiles {
      max-width: 40px;
      word-break: break-word;
    }
    .rank-table-link {
      min-width: 100px;
      .rank-tableholder-table-icon {
        font-size: 16px;
        margin-right: 10px;
      }
      .blue-icon {
        color: #1890ff;
        :hover {
          cursor: pointer;
        }
      }
      .green-icon {
        color: #52c41a;
        :hover {
          cursor: pointer;
        }
      }
      .red-icon {
        color: #f5222d;
        :hover {
          cursor: pointer;
        }
      }
    }
  }
  .rank-table-pagination {
    margin-top: 25px;
    float: right;
  }
  .rank-table-modal {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    .rank-table-modal-mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
    }
    .rank-table-modal-body {
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    }
  }
}
</style>

