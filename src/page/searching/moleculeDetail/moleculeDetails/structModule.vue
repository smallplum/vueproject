<template>
  <div class="struct">
    <div class="struct-title">结构性质</div>
    <error-toolpit v-if="isDataerror" type="error"></error-toolpit>
    <div class="struct-container" v-if="!isDataerror">
      <div class="struct-tableholder">
        <p class="struct-tableholder-title">
          分子属性
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{propsTooltip}}</span>
            </template>
            <a-icon type="info-circle" />
          </a-tooltip>
        </p>
        <div class="struct-tableholder-table">
          <a-table
            class="struct-tableholder-table-block"
            :columns="this.propsColumns"
            :dataSource="this.propsTableLeft"
            :pagination="false"
            rowKey="propsTableLeft"
            size="middle"
          >
            <!-- <span slot="action" slot-scope="text, record">
            <a href="javascript:;" @click="test(record.name)">Delete</a>
            </span>-->
          </a-table>
          <a-table
            class="struct-tableholder-table-block"
            :columns="this.propsColumns"
            :dataSource="this.propsTableRight"
            :pagination="false"
            rowKey="propsTableRight"
            size="middle"
          >
            <!-- <span slot="action" slot-scope="text, record">
            <a href="javascript:;" @click="test(record.name)">Delete</a>
            </span>-->
          </a-table>
        </div>
      </div>
      <div class="struct-tableholder">
        <p class="struct-tableholder-title">
          官能团
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{groupTooltip}}</span>
            </template>
            <a-icon type="info-circle" />
          </a-tooltip>
        </p>
        <div class="struct-tableholder-table">
          <a-table
            class="struct-tableholder-table-block"
            :columns="this.groupColumns"
            :dataSource="this.groupTableLeft"
            :pagination="false"
            rowKey="groupTableLeft"
            size="middle"
          >
            <!-- <span slot="action" slot-scope="text, record">
            <a href="javascript:;" @click="test(record.name)">Delete</a>
            </span>-->
          </a-table>
          <a-table
            class="struct-tableholder-table-block"
            :columns="this.groupColumns"
            :dataSource="this.groupTableRight"
            :pagination="false"
            rowKey="groupTableRight"
            size="middle"
          >
            <!-- <span slot="action" slot-scope="text, record">
            <a href="javascript:;" @click="test(record.name)">Delete</a>
            </span>-->
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { TOOLTIP } from "service/constant.js";
import errorToolpit from "components/errorToolpit";

const groupColumns = [
  {
    title: "官能团名称",
    dataIndex: "name"
  },
  {
    title: "官能团个数",
    dataIndex: "number"
  }
  //   {
  //     title: "operation",
  //     key: "action",
  //     scopedSlots: { customRender: "action" }
  //   }
];
const propsColumns = [
  {
    title: "属性名称",
    dataIndex: "name"
  },
  {
    title: "属性值",
    dataIndex: "props"
  }
];
const keyPairs = {
  weight: "分子量M",
  hba: "氢键受体数目HBA",
  hbd: "氢键供体数目HBD",
  psa: "极性分子表面积PSA",
  nor: "可旋转的柔性键数目NOR",
  aromatic_ring: "芳香环数目",
  imaromatic: "非芳香环数目",
  imcal: "非碳氢原子占非氢原子数比率"
};
export default {
  name: "structModule",
  props: ["result"],
  components: {
    "error-toolpit": errorToolpit
  },
  data() {
    return {
      metaData: this.result,
      groupColumns,
      propsColumns,
      keyPairs,
      propsData: {},
      propsTableData: [],
      propsTableLeft: [],
      propsTableRight: [],
      groupData: {},
      groupTableData: [],
      groupTableLeft: [],
      groupTableRight: [],
      groupTooltip: "",
      propsTooltip: "",
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
        this.propsData = this.metaData.props;
        this.propsTooltip = TOOLTIP.search.moleculeDetail.detail.struct.props;
        this.groupData = this.metaData.group;
        this.groupTooltip = TOOLTIP.search.moleculeDetail.detail.struct.group;

        //TODO: 这里需要处理一下异常情况
        Object.keys(this.propsData).map(item => {
          this.propsTableData.push({
            name: this.keyPairs[item],
            props: this.propsData[item]
          });
        });
        for (let i = 0; i < 3; i++) {
          this.propsTableLeft.push(this.propsTableData[i]);
        }
        for (let i = 3; i < this.propsTableData.length; i++) {
          this.propsTableRight.push(this.propsTableData[i]);
        }

        Object.keys(this.groupData).map(item => {
          this.groupTableData.push({
            name: item,
            number: this.groupData[item]
          });
        });

        for (let i = 0; i < 7; i++) {
          this.groupTableLeft.push(this.groupTableData[i]);
        }
        for (let i = 7; i < this.groupTableData.length; i++) {
          this.groupTableRight.push(this.groupTableData[i]);
        }
      } else {
        this.isDataerror = true;
      }
    },
    test(text) {
      this.$message.success(text);
    }
  }
};
</script>

<style lang="scss" scoped>
.struct {
  .struct-title {
    margin-left: 16px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 24px;
  }
  .struct-container {
    margin-left: 32px;
    .struct-tableholder {
      .struct-tableholder-title {
        margin-top: 16px;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
      }
      .struct-tableholder-table {
        display: flex;
        margin-top: 16px;
        .struct-tableholder-table-block {
          width: 50%;
          margin-right: 20px;
        }
      }
    }
  }
}
</style>

