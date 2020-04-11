<template>
  <div>

    <div>
    <!-- 且和或的form -->
    <div style="float:left;width:150px;">
      <a-form
        :form="logform"
      >
        <a-form-item
        v-for="(t, index) in logform.getFieldValue('keys1')"
        :key="t"   
        :required="false"
        >
          <a-select  placeholder="且"  v-decorator="[`logical[${t}]`]" style="width: 72px;margin-right:20px">
            <a-select-option value="且">且</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </div>

    <!-- 筛选条件的form -->
    <div style="float:left;width:750px;">
      <a-form
        :form="form"
      >
        <a-form-item
          v-for="(k, index) in form.getFieldValue('keys2')"
          :key="k" 
          :label="index === 0 ? '' : ''"
          :required="false"
        >
          <a-select placeholder="请选择分子属性" v-decorator="[`attribute[${k}]`]"  @change="handleScreenChange($event,index)" style="width: 200px;margin-right:20px">
              <a-select-option v-for="(i,j) in screenCondition" :key="i" :value="j+1">{{i}}</a-select-option>
          </a-select>
          <a-select  placeholder="请选择逻辑值"  v-decorator="[`operate[${k}]`]" style="width: 150px;margin-right:20px">
              <a-select-option v-for="(i,j) in logOp[index]" :key="i" :value="j+1">{{i}}</a-select-option>
          </a-select>
          <a-input v-decorator="[`data[${k}]`]" placeholder="请输入属性值" style="width: 200px; margin-right: 8px" />
          <a-button
            v-if="form.getFieldValue('keys2').length > 1"
            style="margin-left:20px"
            type="dashed"
            :disabled="form.getFieldValue('keys2').length === 1"
            @click="() => remove(k)"
          >
          <a-icon type="minus" />
          </a-button>

          <a-button
            v-if="index==form.getFieldValue('keys2').length-1"
            type="dashed"
            style="margin-left:20px"
            @click="add"
          >
            <a-icon type="plus" />
          </a-button>
        </a-form-item>

        <a-form-item >
          <a-button
            type="primary"
            @click="handleSubmit"
          >
            Submit
          </a-button>
        </a-form-item>
      </a-form>
    </div>

    </div>

  </div>
</template>

<script>
const screenCondition=['SMILES','ChEMBL ID','Name','Molecular Formula','Aromatic Rings','Heavy Atoms',
                       'Mol Weight',	'MW Monoisotopic',	'ALogP',	'QED Weighted',
                       'SA Score','Rotatable Bonds',	'Polar Surface Area',	'HBA',	'HBD',	'Ro5 Violations',
                       'HBA(Lipinski)',	'HBD(Lipinski)',	'Ro5 Violations(Lipinski)','Max Phase',]
let logOptions={
  str:['等于','不等于'],
  num:['≥','≤','>','<','=']
}
let id = 0;
export default {
  data () {
    return {
      screenCondition,
      logOptions,
      logOp:{},
      change_item:0,//改变的是哪一行
    };
  },
  beforeCreate () {
    this.logform = this.$form.createForm(this);
    this.logform.getFieldDecorator('keys1', { initialValue: [0], preserve: true });
    this.form = this.$form.createForm(this);
    this.form.getFieldDecorator('keys2', { initialValue: [0], preserve: true });
  },
  methods: {
    remove  (k) {
      const { form } = this;
      // can use data-binding to get
      const keys2 = form.getFieldValue('keys2');
      // We need at least one passenger
      if (keys2.length === 1) {
        return;
      }

      // can use data-binding to set
      form.setFieldsValue({
        keys2: keys2.filter(key => key !== k),
      });
    },

    add  () {
      const { form } = this;
      // can use data-binding to get
      const keys2 = form.getFieldValue('keys2');
      const nextkeys2 = keys2.concat(++id);
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        keys2: nextkeys2,
      });
    },
    handleScreenChange(e,index){
      //需要取得value的值，$event
      if(e<=4){
        this.logOp[index]=logOptions.str;
      }
      if(e>4){
        this.logOp[index]=logOptions.num
      }
    },
    handleSubmit  (e) {
    
      const { form } = this;
      const keys2 = form.getFieldsValue();
      console.log('Submit',form.getFieldsValue())
      let res={};
      let attr=keys2.attribute;
      let log=keys2.operate;
      let data=keys2.data;
      let n_attr=[];
      let n_log=[];
      let n_data=[];
      for(var i=0;i<attr.length;i++){
        if(typeof attr[i]==="undefined"){
        }else{
          n_attr.push(attr[i]);
          n_log.push(log[i]);
          n_data.push(data[i]);
        }
      }
      res['prop_idx']=n_attr;
      res['ops']=n_log;
      res['values']=n_data;

    },
    
  },
};
</script>
<style>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all .3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>