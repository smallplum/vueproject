<template>
  <div class="container">
    <div class="navbar">
      <page-header />
    </div>
    <div class="mainapp">
      <app-main />
    </div>
  </div>
</template>

<script>
import pageFooter from "page/layout/pageFooter.vue";
import pageHeader from "page/layout/pageHeader.vue";
import appMain from "page/layout/appMain.vue";

export default {
  name: "Layout",
  components: {
    "page-footer": pageFooter,
    "page-header": pageHeader,
    "app-main": appMain
  }
};
</script>

<style scoped>
.container {
  height: 100%;
}
.mainapp {
  height: 100%;
}
.navbar {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 999;
}
</style>


