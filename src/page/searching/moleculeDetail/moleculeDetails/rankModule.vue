<template>
  <div class="rank">
    <div class="rank-title">
      排序超过的已有分子
      <a-tooltip placement="top">
        <template slot="title">
          <span>{{rankTooltip}}</span>
        </template>
        <a-icon type="info-circle" />
      </a-tooltip>
    </div>
    <error-toolpit v-if="isDataerror || isEmptyData" :type="isDataerror?'error':'empty'"></error-toolpit>
    <!-- <error-toolpit v-if="isEmptyData" type="empty"></error-toolpit> -->

    <div class="rank-table" v-if="!isDataerror && !isEmptyData">
      <a-table
        :columns="this.rankColumn"
        :dataSource="this.rankTable"
        :loading="tableloading"
        :pagination="false"
        rowKey="id"
        size="middle"
        class="rank-table-holder"
      >
        <div class="rank-table-img" slot="url" slot-scope="url">
          <img :src="url" />
        </div>
        <span class="rank-table-name" slot="name" slot-scope="name">
          <p>{{name}}</p>
        </span>
        <span slot="activity" slot-scope="activity" class="rank-table-activity">
          <p>{{activity && activity.length > 0 ? activity : '-'}}</p>
        </span>
        <div class="rank-table-link" slot="action" slot-scope="text, record">
          <a :href="record.chembl_url" target="_blank">
            <a-icon class="rank-tableholder-table-icon" type="bars" />
          </a>
        </div>
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
          <span v-if="props.value!=='50'">{{props.value}}条/页</span>
          <span v-if="props.value==='50'">全部</span>
        </template>
      </a-pagination>
    </div>
  </div>
</template>
<script>
import collectStar from "components/collectStar";
import errorToolpit from "components/errorToolpit";

import { TOOLTIP } from "service/constant.js";
import { rankData } from "mock/mockData";

import http from "utils/http";
import util from "utils/util";
import API from "service/apis";
let rankColumn = [
  {
    title: "分子排序",
    dataIndex: "rank",
    width: 80
  },
  {
    title: "结构式",
    dataIndex: "url",
    scopedSlots: { customRender: "url" },
    width: 80
  },
  {
    title: "Name",
    dataIndex: "smiles",
    scopedSlots: { customRender: "name" }
  },
  {
    title: "生物活性",
    dataIndex: "activity",
    scopedSlots: { customRender: "activity" },
    width: 100
  },
  {
    title: "Max Phase",
    dataIndex: "maxPhase",
    width: 100
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
    width: 100
  }
];

export default {
  name: "rankModule",
  components: {
    "collect-star": collectStar,
    "error-toolpit": errorToolpit
  },
  data() {
    return {
      rankTooltip: "",
      rankTable: [],
      rankColumn,
      pagination: {
        current: 1,
        pageSizeOptions: ["5", "10", "20"],
        allCount: 0,
        pageSize: 5
      },
      tableloading: false,
      isDataerror: false,
      isEmptyData: false
    };
  },

  mounted() {
    this.getMetaData(1, this.pagination.pageSize);
  },
  methods: {
    getMetaData(page, pz) {
      this.tableloading = true;
      let storage = window.sessionStorage.getItem("molecule-detail-params");
      const positionNum = this.$route.query.positionNum;
      const positiveSmiles = this.$route.query.positiveSmiles;
      let params = {
        target: this.$route.query.target,
        moleculeId: this.$route.query.moleculeId,
        scaffoldSmiles: this.$route.query.scaffoldSmiles,
        pageFrom: this.$route.query.pageFrom,
        labelSmiles: this.$route.query.origin_smile,
        targetType:this.$route.query.targetType,
        ref3dSmilesId:this.$route.query.smileId,
        page: page,
        pageSize: pz,
        optimizationProp: this.$route.query.property||'',
        taskId:this.$route.query.taskid
      };
      if (positionNum && positionNum.length !== 0) {
        params = Object.assign(params, { positionNum: positionNum });
      }
      if (positiveSmiles && positiveSmiles.length !== 0) {
        params = Object.assign(params, { positiveSmiles: positiveSmiles });
      }
      http
        .axiospost(API.apis.mockexists, params)
        .then(res => {
          if (+res.code === 200 || +res.code === 201) {
            if (+res.data.allCount !== 0) {
              this.rankTable = res.data.list;
              // console.log(this.rankTable);

              this.pagination.allCount = res.data.allCount;
            } else {
              this.isEmptyData = true;
            }
          } else {
            this.isDataerror = true;
          }
          this.tableloading = false;
        })
        .catch(err => {
          this.isDataerror = true;
          this.$message.error("系统错误，请稍后重试");
        });
      this.rankTooltip = TOOLTIP.search.moleculeDetail.detail.rank.rank_exist;
    },

    onShowSizeChange(current, pageSize) {
      this.pagination.pageSize = pageSize;
      this.getMetaData(current, this.pagination.pageSize);
    },
    onPageChange(pageNumber) {
      this.getMetaData(pageNumber, this.pagination.pageSize);
    }
  }
};
</script>

<style lang="scss" scoped>
.rank {
  margin-top: 16px;
  .rank-title {
    margin-left: 16px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 24px;
  }

  .rank-table {
    margin-left: 32px;
    margin-top: 16px;
    overflow: hidden;

    .rank-table-holder {
      .rank-table-img {
        img {
          width: 108px;
          height: 108px;
        }
      }
      .rank-table-name {
        max-width: 40px;
        word-break: break-word;
        p {
          margin-bottom: 0;
        }
      }
      .rank-table-activity {
        p {
          margin-bottom: 0px;
        }
      }
      .rank-table-link {
        min-width: 100px;
        .rank-tableholder-table-icon {
          color: #1890ff;
          font-size: 16px;
          margin-right: 10px;
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
  }
}
</style>
