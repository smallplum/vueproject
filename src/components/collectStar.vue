<template>
  <span>
    <a-icon
      class="collect-star"
      type="star"
      :theme="isFilled?'filled':'outlined'"
      @click="sendCollect"
    />
    <span v-if="showText">{{collectStr}}</span>
  </span>
</template>

<script>
import http from "utils/http";
import util from "utils/util";
import API from "service/apis";

export default {
  name: "collectStar",
  props: ["collect", "dataset", "showText"],
  data() {
    return {
      isFilled: false,
      collectStr: "收藏分子"
    };
  },
  watch: {
    dataset(newValue, oldValue) {
      this.isFilled = newValue.collect === 1 ? true : false;
    }
  },

  mounted() {
    this.isFilled = +this.collect === 1 ? true : false;
    this.collectStr = this.isFilled ? "已收藏" : "收藏分子";
  },
  methods: {
    sendCollect() {
      this.isFilled = !this.isFilled;
      this.collectStr = this.isFilled ? "已收藏" : "收藏分子";
      let storage = JSON.parse(
        window.sessionStorage.getItem("molecule-detail-params")
      );
      let params = {
        mol_ids: {
          "0": [
            this.dataset.id || this.dataset.moleculeId || storage.moleculeId
          ]
        },
        target: storage.target,
        all: 0,
        scaffold_smiles: this.dataset.smiles
      };
      // console.log(params, "===收藏接口参数");
      http
        .axiospost(API.apis.moleculecollect, params)
        .then(res => {
          // this.$message.success("收藏成功");
        })
        .catch(err => {
          this.isFilled = !this.isFilled;
          this.collectStr = this.isFilled ? "已收藏" : "收藏分子";
          this.$message.error("操作失败，请稍后重试");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.collect-star {
  font-size: 16px;
  :hover {
    font-size: 18px;
  }
}
</style>

