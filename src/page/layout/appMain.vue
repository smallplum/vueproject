<template>
  <div id="appMain">
    <router-view :key="key"></router-view>
  </div>
</template>
<script>
export default {
  name: "appMain",
  data() {
    return {};
  },
  computed: {
    key() {
      return this.$route.path + Math.random();
    }
  }
};
</script>
<style scoped>
#appMain {
  height: 100%;
}
</style>

