<template>
  <div class="t">
    <div class="t-title">
      毒性
      <a-tooltip placement="top">
        <template slot="title">
          <span>{{tTooltip}}</span>
        </template>
        <a-icon type="info-circle" />
      </a-tooltip>
    </div>
    <error-toolpit v-if="isDataerror" type="error"></error-toolpit>
    <div class="t-tableholder-table" v-if="!isDataerror">
      <a-table
        :columns="this.tColumn"
        :dataSource="this.tTable"
        :pagination="false"
        rowKey="tTable"
        size="middle"
      >
        <span slot="predictTitle">
          毒性概率
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{rateTooltip}}</span>
            </template>
            <a-icon type="info-circle" />
          </a-tooltip>
        </span>
        <div class="t-table-desc" slot="value" slot-scope="value">
          <div :class="[+value === 1 ? 'green-dot' : 'red-dot','pre-dot']"></div>
          <div>{{value && +value===1 ? "无" : "有"}}</div>
        </div>
        <span
          slot="experimentDesc"
          slot-scope="experimentDesc"
        >{{experimentDesc && experimentDesc.length > 0 ? experimentDesc : "-"}}</span>

        <span slot="action" slot-scope="text, record,index">
          <a-icon
            class="t-tableholder-table-icon"
            type="edit"
            @click="showEditModal(tTable[index])"
          />
        </span>
      </a-table>
    </div>
    <experienment-modal
      v-if="visible"
      :meta-data="modalData"
      @showModal="showModal"
      @regaindata="regaindata"
      v-bind="$attrs"
      v-on="$listeners"
    ></experienment-modal>
  </div>
</template>
<script>
import experimentModal from "components/experimentModal";
import errorToolpit from "components/errorToolpit";

import { TOOLTIP } from "service/constant.js";

const tColumn = [
  {
    title: "指标名称",
    dataIndex: "name",
    width: 400
  },
  {
    title: "预测结果",
    dataIndex: "value",
    width: 400,
    scopedSlots: { customRender: "value" }
  },
  {
    dataIndex: "predict",
    width: 400,
    slots: { title: "predictTitle" },
    scopedSlots: { customRender: "predict" }
  },
  {
    title: "操作",
    key: "action",
    width: 150,
    scopedSlots: { customRender: "action" }
  }
];
const experienmentColumn = {
  title: "实验结果",
  dataIndex: "experimentDesc",
  width: 500,
  scopedSlots: { customRender: "experimentDesc" }
};
// let tShow = false;

export default {
  name: "tModule",
  props: ["result"],
  components: {
    "experienment-modal": experimentModal,
    "error-toolpit": errorToolpit
  },
  data() {
    return {
      metaData: this.result,
      visible: false,
      modalData: {},
      tTable: [],
      tColumn,
      tTooltip: "",
      rateTooltip: "",
      isDataerror: false
    };
  },
  created() {
    this.getMetaData(this.metaData);   
  },

  computed: {},

  watch: {
    result(newValue, oldValue) {
      this.metaData = newValue;
      this.getMetaData(this.metaData);
    }
  },
  methods: {
    getMetaData(dataset) {
      let flag = 0;
      this.tTable = [];

      Object.keys(dataset).map(item => {
        if (dataset[item].experimentDesc) {
          // this.isExperimentColumn();
          flag++;
        }
        dataset[item].key = item;
        this.tTable.push(dataset[item]);
      });
      if (flag === 0 && tColumn.length === 5) {
        console.log("=====should delete");
        this.isDeleteExperimentColumn();
      } else if (flag > 0 && tColumn.length !== 5) {
        console.log("=====should plus");
        this.isExperimentColumn();
      }
      this.tTooltip = TOOLTIP.search.moleculeDetail.detail.t.t;
      this.rateTooltip = TOOLTIP.search.moleculeDetail.detail.t.t_rate;
    },
    isExperimentColumn() {
      // if (tShow) {
      // return;
      // } else {
      // tShow = true;
      tColumn.splice(3, 0, experienmentColumn);
      // }
    },
    isDeleteExperimentColumn() {
      tColumn.splice(3, 1);
    },
    showModal(show) {
      this.visible = show;
    },
    showEditModal(record) {
      this.modalData = record;
      this.visible = true;
    },
    regaindata() {
      this.$emit("regaindata");
    }
  }
};
</script>

<style lang="scss" scoped>
.t {
  margin-top: 16px;
  .t-title {
    margin-left: 16px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 24px;
  }

  .t-tableholder-table {
    margin-left: 32px;
    margin-top: 16px;
    .t-table-desc {
      display: flex;
      align-items: center;
      .pre-dot {
        content: " ";
        height: 5px;
        width: 5px;
        margin-right: 8px;
        border-radius: 50%;
      }
      .red-dot {
        background: #f5222d;
      }
      .green-dot {
        background: #52c41a;
      }
    }
    .t-tableholder-table-icon {
      color: #1890ff;
    }
    .t-tableholder-table-icon:hover {
      cursor: pointer;
    }
  }
}
</style>
