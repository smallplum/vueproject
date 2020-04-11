<template>
  <div class="physical">
    <div class="physical-title">
      理化性质
      <a-tooltip placement="top">
        <template slot="title">
          <span>{{physicalTooltip}}</span>
        </template>
        <a-icon type="info-circle" />
      </a-tooltip>
    </div>
    <error-toolpit v-if="isDataerror" type="error"></error-toolpit>
    <div class="physical-tableholder-table" v-if="!isDataerror">
      <a-table
        class="physical-tableholder-table-block"
        :columns="this.propsColumns"
        :dataSource="this.propsTableLeft"
        :pagination="false"
        rowKey="propsTableLeft"
        size="middle"
      >
        <span slot="name" slot-scope="name">
          {{name}}
          <a-tooltip placement="top" v-if="name=='溶解度logS'">
            <template slot="title">
              <span>{{logsTooltip}}</span>
            </template>
            <a-icon type="info-circle" />
          </a-tooltip>
        </span>
      </a-table>
      <a-table
        class="physical-tableholder-table-block"
        :columns="this.propsColumns"
        :dataSource="this.propsTableRight"
        :pagination="false"
        rowKey="propsTableRight"
        size="middle"
      >
        <span slot="name" slot-scope="name">
          {{name}}
          <a-tooltip placement="top" v-if="name=='溶解度logS'">
            <template slot="title">
              <span>{{logsTooltip}}</span>
            </template>
            <a-icon type="info-circle" />
          </a-tooltip>
        </span>
      </a-table>
    </div>
  </div>
</template>
<script>
import { TOOLTIP } from "service/constant.js";
import errorToolpit from "components/errorToolpit";

const propsColumns = [
  {
    title: "属性名称",
    dataIndex: "name",
    scopedSlots: { customRender: "name" }
  },
  {
    title: "属性值",
    dataIndex: "props"
  }
];
const keyPairs = {
  logp: "脂溶性logP",
  logs: "溶解度logS",
  mp: "熔点MP(℃)"
};
export default {
  name: "physicalModule",
  props: ["result"],
  components: {
    "error-toolpit": errorToolpit
  },
  data() {
    return {
      metaData: this.result,
      propsColumns,
      physicalTooltip: "",
      logsTooltip: "",
      keyPairs,
      propsTableData: [],
      propsTableLeft: [],
      propsTableRight: [],
      isDataerror: false
    };
  },
  mounted() {
    this.getMetaData();
  },
  watch: {},
  methods: {
    getMetaData() {
      if (this.metaData) {
        this.physicalTooltip =
          TOOLTIP.search.moleculeDetail.detail.physicochemical.physicochemical;
        this.logsTooltip =
          TOOLTIP.search.moleculeDetail.detail.physicochemical.logs;
        Object.keys(this.metaData).map(item => {
          this.propsTableData.push({
            name: this.keyPairs[item],
            props: this.metaData[item]
          });
        });
        for (let i = 0; i < 2; i++) {
          this.propsTableLeft.push(this.propsTableData[i]);
        }
        for (let i = 2; i < this.propsTableData.length; i++) {
          this.propsTableRight.push(this.propsTableData[i]);
        }
      } else {
        this.isDataerror = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.physical {
  margin-top: 16px;
  .physical-title {
    margin-left: 16px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 24px;
  }
  .physical-tableholder-table {
    display: flex;
    margin: 16px 0 0 32px;
    .physical-tableholder-table-block {
      width: 50%;
      margin-right: 20px;
    }
  }
}
</style>
