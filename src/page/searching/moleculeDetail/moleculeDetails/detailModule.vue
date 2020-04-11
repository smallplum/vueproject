<template>
  <div class="detail">
    <div class="detail-title">分子详情</div>
    <div class="detail-container">
      <div class="detail-container-modulecontainer" ref="aLocation">
        <struct-module id="stucture-props" :result="metaData.struct"></struct-module>
        <physical-module id="physical-props" :result="metaData.physicochemical"></physical-module>
        <dmpk-module id="dmpk-props" :result="metaData.dmtk" v-bind="$attrs" v-on="$listeners"></dmpk-module>
        <!-- <t-module id="t-props" :result="metaData.t" v-bind="$attrs" v-on="$listeners"></t-module> -->
        <rank-module id="rank-props" v-if="isNewMolecule===1"></rank-module>
      </div>
      <a-anchor :affix="false" :offsetTop="140" class="detail-container-anchorcontainer" @click="handleClick">
        <a-anchor-link data-index="0" ref="a" href="#stucture-props" title="结构性质" />
        <a-anchor-link data-index="1" href="#physical-props" title="理化性质" />
        <a-anchor-link data-index="2" href="#dmpk-props" title="DMPK" />
        <a-anchor-link data-index="3" href="#t-props" title="毒性" />
        <a-anchor-link
          data-index="4"
          v-if="isNewMolecule===1"
          href="#arank-props"
          title="排序超过的已有分子"
        />
      </a-anchor>
    </div>
  </div>
</template>

<script>
import { TOOLTIP } from "service/constant";
import structModule from "./structModule";
import physicalModule from "./physicalModule";
import dmpkModule from "./dmpkModule";
import tModule from "./tModule.vue";
import rankModule from "./rankModule";

export default {
  inject: ["reload"],
  name: "detailModule",
  components: {
    "struct-module": structModule,
    "physical-module": physicalModule,
    "dmpk-module": dmpkModule,
    "t-module": tModule,
    "rank-module": rankModule
  },
  props: ["result", "isNewMolecule"],
  data() {
    return {
      metaData: this.result
    };
  },
  mounted() {
    // console.log(this.metaData);
  },
  watch: {
    result(newValue, oldValue) {
      this.metaData = newValue;
    }
  },
  methods: {
    handleClick(e, link) {
      var index = e.currentTarget.parentElement.getAttribute("data-index");
      var arr = Array.prototype.slice.call(this.$refs.aLocation.children);
      arr.forEach(element => {
        if (index === "0") {
          document.getElementById("stucture-props").scrollIntoView();
        } else if (index === "1") {
          document.getElementById("physical-props").scrollIntoView();
        } else if (index === "2") {
          document.getElementById("dmpk-props").scrollIntoView();
        } else if (index === "3") {
          document.getElementById("t-props").scrollIntoView();
        } else {
          document.getElementById("rank-props").scrollIntoView();
        }
      });
      e.preventDefault();
    },
    regaindata() {
      this.$emit("regaindata");
    }
  }
};
</script>

<style lang="scss" scoped>
.detail {
  margin: 24px;
  padding: 16px;
  background: #ffffff;
  border-radius: 2px 2px 2px 2px 0px;
  .detail-title {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 16px;
  }
  .detail-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
    .detail-container-modulecontainer {
      width: 83%;
    }
  }
  .detail-container-anchorcontainer {
    min-width: 10%;
  }
}
</style>

