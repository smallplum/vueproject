<template>
  <div class="editable-cell editnode">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-input :value="value" placeholder="字符限长100" maxlength="100" @change="handleChange" @pressEnter="check" />
      <!-- <a-icon type="check" class="editable-cell-icon-check" @click="check" /> -->
      <a-button size="small" type="primary" @click="check">确定</a-button>
    </div>
    <div v-else class="editable-cell-text-wrapper">
      {{ value || ' ' }}
      <a-icon type="edit" class="editable-cell-icon" @click="edit" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    text: String
  },
  watch:{
     text: function(val) {
      this.value = val;
    }
  },
  data() {
    return {
      value: this.text,
      editable: false
    };
  },
  methods: {
    handleChange(e) {
      const value = e.target.value;
      // console.log(890, e.target.value);

      this.value = value;
    },
    check() {
      this.editable = false;
      // console.log(222, this.editable);
      this.$emit("change", this.value);
    },
    edit() {
      this.editable = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.editnode /deep/ .ant-input {
  width: 68%;
}
</style>