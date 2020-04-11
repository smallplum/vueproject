<template>
  <div class="dmpk">
    <div class="dmpk-title">
      DMPK
      <a-tooltip placement="top">
        <template slot="title">
          <span>{{dmpkTooltip}}</span>
        </template>
        <a-icon type="info-circle" />
      </a-tooltip>
    </div>
    <error-toolpit v-if="isDataerror" type="error"></error-toolpit>
    <div class="dmpk-table" v-if="!isDataerror">
      <a-table
        :columns="this.dmpkColumn"
        :dataSource="this.dmpkTable"
        :pagination="false"
        :loading="tableloading"
        rowKey="dmpkTable"
        size="middle"
      >
        <span slot="predictTitle">
          异常概率
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{predictTooltip}}</span>
            </template>
            <a-icon type="info-circle" />
          </a-tooltip>
        </span>
        <span
          slot="experimentDesc"
          slot-scope="experimentDesc"
        >{{experimentDesc && experimentDesc.length > 0 ? experimentDesc : "-"}}</span>
        <span class="dmpk-table-desc" slot="desc" slot-scope="desc, record">
          <div
            v-if="desc && record.key !=='ppb'"
            :class="[+record.value === 1 ? 'green-dot' : 'red-dot','pre-dot']"
          ></div>
          <div>{{desc && desc.length > 0 ? desc : "-"}}</div>
        </span>

        <span
          slot="predict"
          slot-scope="predict,record"
        >{{predict && predict.length> 0 && record.key!=="ppb" ? predict : "-"}}</span>

        <span slot="action" slot-scope="text, record,index ">
          <a-icon
            class="dmpk-tableholder-table-icon"
            type="edit"
            @click="showEditModal(dmpkTable[index])"
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
import { TOOLTIP } from "service/constant.js";
import experimentModal from "components/experimentModal";
import errorToolpit from "components/errorToolpit";

let dmpkColumn = [
  {
    title: "指标名称",
    dataIndex: "name",
    width: 400
  },
  {
    title: "预测结果",
    dataIndex: "desc",
    width: 400,
    scopedSlots: { customRender: "desc" }
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
// let dmpkitemShow = false;

export default {
  name: "dmpkModule",
  components: {
    "experienment-modal": experimentModal,
    "error-toolpit": errorToolpit
  },
  props: ["result"],
  // inheritAttrs: false,
  data() {
    return {
      metaData: this.result,
      dmpkTable: [],
      dmpkColumn,
      visible: false,
      tableloading: false,
      modalData: {},
      dmpkTooltip: "",
      predictTooltip: "",
      isDataerror: false
    };
  },
  mounted() {
    this.getMetaData(this.metaData);
  },
  watch: {
    result(newValue, oldValue) {
      this.metaData = newValue;
      this.getMetaData(this.metaData);
    }
  },
  methods: {
    getMetaData(dataset) {
      let flag = 0;
      if (dataset) {
        this.tableloading = true;
        this.dmpkTable = [];
        Object.keys(dataset).map(item => {
          if (dataset[item].experimentDesc) {
            // this.isExperimentColumn();
            flag++;
          }
          if (typeof dataset[item] === "object") {
            dataset[item].key = item;
            if (dataset[item].key === "ppb") {
              dataset[item].desc = dataset[item].predict;
            }
            this.dmpkTable.push(dataset[item]);
          }
        });
        if (flag === 0 && dmpkColumn.length === 5) {
          console.log("=====should delete");
          this.isDeleteExperimentColumn();
        } else if (flag > 0 && dmpkColumn.length !== 5) {
          console.log("=====should plus");
          this.isExperimentColumn();
        }

        this.tableloading = false;
        this.dmpkTooltip = TOOLTIP.search.moleculeDetail.detail.dmpk.dmpk;
        this.predictTooltip =
          TOOLTIP.search.moleculeDetail.detail.dmpk.abnormalrate;
      } else {
        this.isDataerror = true;
      }
    },
    isExperimentColumn() {
      // if (dmpkitemShow) {
      // return;
      // } else {
      // dmpkitemShow = true;
      dmpkColumn.splice(3, 0, experienmentColumn);
      // }
    },
    isDeleteExperimentColumn() {
      dmpkColumn.splice(3, 1);
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
.dmpk {
  margin-top: 16px;
  .dmpk-title {
    margin-left: 16px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 24px;
  }
  .dmpk-table {
    margin-left: 32px;
    margin-top: 16px;
    .isexitexp {
      color: #52c41a;
    }
    .dmpk-table-desc {
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
    .dmpk-tableholder-table-icon {
      color: #1890ff;
    }
    .dmpk-tableholder-table-icon:hover {
      cursor: pointer;
    }
  }
}
</style>
