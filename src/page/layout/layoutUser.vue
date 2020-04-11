<template>
  <div>
    <div>
      <page-header/>
     </div>
    <div>
      <app-main/>
    </div>
    <div>
      <page-footer/>
    </div>
  </div>
</template>

<script>
import pageFooter from 'page/layout/pageFooter.vue'
import pageHeader from 'page/layout/pageHeader.vue'
import appMain from 'page/layout/appMain.vue'

export default {
    name:'Layout',
    components:{
      "page-footer":pageFooter,
      "page-header":pageHeader,
      "app-main":appMain
    }
}
</script>

<style scoped>
 
</style>


