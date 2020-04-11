<template>
  <div class="targetSelect">
    <div class="target">
      <span class="smile">
        <span :class="['nessary', ifShowNessary?'':'fill']">*</span>
        <span>药物靶标：</span>
      </span>
      <a-select
      showSearch
      :getPopupContainer="triggerNode=>triggerNode.parentNode"
      :value="value"
      class="selectOption"
      placeholder="请选择靶标"
      style=" opacity: 0.95;"
      :defaultActiveFirstOption="false"
      showArrow
      :filterOption="false"
      @search="getData"
      @change="handleChange"
      @select="selected"
      @focus="focused"
      v-model="target_select"
      :notFoundContent="geting ? undefined : nofind"
    >
      <a-spin v-if="geting" slot="notFoundContent" size="small"/>
      <a-select-option v-for="(d,index) in data" :key="d.entry" >{{d.entry}}&nbsp;&nbsp;{{d.mainName}}</a-select-option>
    </a-select>
    </div>
    </div>
</template>
<script>
import axios from "axios";
import querystring from "querystring";
import debounce from "lodash/debounce";

export default {
  data() {
    this.lastFetchId = 0;
    this.getData = debounce(this.getData, 300);
    return {
      data: this.initData,
      ifShowNessary: true,
      value: [],
      geting: false,
      init_data:[],
      nofind:'无数据',
      target_select:'请选择靶标',
      sessionid: JSON.parse(localStorage.getItem("user") ||'[]').sessionid
    }
  },
  props: {
    isNessary: true,
    cleanselect: {},
    uptarget:''
  },
  watch: {
    cleanselect: function(val) {
      this.value = [];
    },
    uptarget:function(val){
      if(val==='FAKE'){
        this.target_select = '请选择靶标';
      }else{
        this.target_select = val;
      }     
    }
  },
  created() { 
    this.initTargetData();
  },
  mounted(){
    this.target_select = this.uptarget;
  },
  methods: {
    initTargetData() {
      this.ifShowNessary = this.isNessary;
      let inp='Q1';
      axios.get('/molecule/innovation/targets',{
        params:{
          searchWord:inp,
          sessionid:this.sessionid
        }
        }).then((res)=>{         
          let targets = res.data.data;
          if (res.data.code == 200) {
            this.init_data=res.data.data;           
            this.data=this.init_data;            
          }
        })
    },
    getData(value) {
      this.lastFetchId += 1;
      const fetchId = this.lastFetchId;
      this.data = []
      this.geting = true
      if(value==0){
        value=5;
      }
      axios.get('/molecule/innovation/targets',{
        params:{
          searchWord:value,
          sessionid:this.sessionid
        }
      }).then((res)=>{
        if (fetchId !== this.lastFetchId) { // for fetch callback order
          return;
        }
        this.data=res.data.data;
        this.geting = false
      })
    },
    handleChange(value) {
      Object.assign(this, {
        value,
        geting: false
      });
    },
    selected(value) {
      this.$emit("selectTarget", value);
    },
    focused() {
      this.$emit("fucusedTarget");
    }
  }
};
</script>
<style lang="scss" scoped>
.targetSelect {
  display: inline-block;
  margin-bottom: 0px;
}
//没有div的margin-bottom
.target {
  padding-left: 6px;
  margin-bottom: 0px;
  .smile {
    margin-right: 0px;
    .nessary {
      content: " * ";
      color: red;
      font-size: 100%;
    }
  }
  .fill {
    opacity: 0;
  }
}
</style>

<style>
.target .el-select .el-input__inner {
  width: 400px;
  height: 35px;
}
.target .ant-select {
  font-size: 13px;
}
.selectOption{
  color: #CCCCCC;
}
</style>