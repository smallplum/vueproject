<template>
  <div>
    <div class="condition">
      <div class="input sc-margin">
        <span class="tip">快速筛选：</span>
        <a-checkbox-group :options="plainOptions" v-model="checkedList" @change="onChange" />
        <span class="clearfloat"></span>
      </div>
      <div class="tip">筛选条件：</div>
      <a-form :form="form">
        <a-form-item
          v-for="(k, index) in form.getFieldValue('keys')"
          :key="index"
          v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
          :label="index === 0 ? '' : ''"
          :required="false"
        >
          <a-select
            placeholder="且"
            v-decorator="[`option[${k}]`]"
            v-if="index>= 1"
            style="width: 72px;margin-right:20px"
          >
            <a-select-option value="且">且</a-select-option>
          </a-select>

          <a-select
            placeholder="请选择分子属性"
            :getPopupContainer="triggerNode=>triggerNode.parentNode"
            v-decorator="[`attribute[${k}]`]"
            @change="handleScreenChange($event,index)"
            style="width: 280px;margin-right:20px"
          >
            <a-select-option v-for="(i,j) in columns" :key="j" :value="j+1">{{i.columnName}}</a-select-option>
          </a-select>
          <a-select
            placeholder="请选择逻辑值"
            :getPopupContainer="triggerNode=>triggerNode.parentNode"
            v-decorator="[`logical[${k}]`]"
            style="width: 150px;margin-right:20px"
          >
            <a-select-option v-for="(i,j) in logOp[index]" :key="i" :value="j+1">{{i}}</a-select-option>
          </a-select>
          <a-input placeholder="请输入属性值" v-decorator="[`data[${k}]`]" style="width: 150px"></a-input>
          <a-button
            v-if="form.getFieldValue('keys').length > 1 && index!=0"
            type="dashed"
            style="margin-left:20px"
            @click="() => remove(k)"
          >
            <a-icon type="minus" />
          </a-button>
          <a-button
            v-if="index==form.getFieldValue('keys').length-1"
            type="dashed"
            style="margin-left:20px"
            @click="add"
          >
            <a-icon type="plus" />
          </a-button>
        </a-form-item>

        <a-form-item v-bind="formItemSubmit">
          <a-button @click="clearScreen" style="margin-right:20px">清空</a-button>
          <a-button type="primary" @click="selectSubmit">确定</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script>
import axios from "axios";
let plainOptions = [
  "符合类药五原则",
  "分子质量≤500",
  "-5≤ALogP≤5",
  "HBA≤10",
  "HBD≤5"
];

let defaultCheckedList = [];
let logOptions = {
  str: ["==", "!="],
  num: ["≥", "≤", ">", "<", "="]
};
let id = 0;
export default {
  data() {
    return {
      checkedList: defaultCheckedList,
      checkAll: false,
      enterList: [],
      plainOptions,
      logOptions,
      logOp: {},
      sessionid: JSON.parse(localStorage.getItem("user") || "[]").sessionid,
      screen: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 24, offset: 4 }
        }
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 24, offset: 2 }
        }
      },
      formItemSubmit: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 24, offset: 20 }
        }
      },
      test: [
        {
          name: "符合类药五原则",
          portity: { columnName: "ro5Violations", op: "=", value: 0 }
        },
        {
          name: "分子质量≤500",
          portity: { columnName: "weight", op: "<=", value: 500 }
        },
        {
          name: "-5≤ALogP≤5",
          portity: { columnName: "logp", op: "<=", value: 5 }
        },
        {
          name: "-5≤ALogP≤5",
          portity: { columnName: "logp", op: ">=", value: -5 }
        },
        {
          name: "HBA≤10",
          portity: { columnName: "hba", op: "<=", value: 10 }
        },
        {
          name: "HBD≤5",
          portity: { columnName: "hbd", op: "<=", value: 5 }
        }
      ]
    };
  },
  props: {
    columns: {
      type: Array
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
    this.form.getFieldDecorator("keys", { initialValue: [0], preserve: true });
  },
  methods: {
    clearScreen() {
      this.form.resetFields();
      this.checkedList = [];
      this.$emit("screenChange2", false);
      this.$emit("screenChange",this.getFormList());
      this.selectSubmit();
    },
    openScreen() {
      this.screen = !this.screen;
    },
    handleScreenChange(e, index) {
      //需要取得value的值，$event
      // console.log(e);
      if (this.columns[e-1].valueType === 2) {
        this.logOp[index] = logOptions.str;
      } else if (this.columns[e-1].valueType === 1) {
        this.logOp[index] = logOptions.num;
      }
    },
    getList() {
      let res = [];
      if (this.checkedList.length == 0) {
      }
      for (var i = 0; i < this.test.length; i++) {
        for (var j = 0; j < this.checkedList.length; j++) {
          if (this.test[i].name == this.checkedList[j]) {
            // console.log(this.checkedList);
            res.push(this.test[i].portity);
            // console.log(res);
          }
        }
      }
      return res;
    },
    onChange(e) {
      this.$emit("screenChange", this.getFormList());
      // console.log("screenChange",this.getFormList());
      
    },
    remove(k) {
      const { form } = this;
      const keys = form.getFieldValue("keys");
      let attr = form.getFieldValue("attribute");
      let data = form.getFieldValue("data");
      let log = form.getFieldValue("logical");
      let opt = form.getFieldValue("option");
      attr.splice(k, 1);
      data.splice(k, 1);
      opt.splice(k, 1);
      log.splice(k, 1);
      form.setFieldsValue({
        keys: keys.filter(key => key !== k),
        data: data,
        attribute: attr,
        logical: log,
        option: opt
      });
    },
    add() {
      const { form } = this;
      const keys = form.getFieldValue("keys");
      const nextKeys = keys.concat(++id);
      let attr = form.getFieldValue("attribute");
      let data = form.getFieldValue("data");
      let log = form.getFieldValue("logical");
      let opt = form.getFieldValue("option");
      if (typeof opt == "undefined") {
        opt = [""];
      } else {
        opt.push("");
      }
      if (typeof attr == "undefined") {
        attr = [""];
      } else {
        attr.push("");
      }
      if (typeof data == "undefined") {
        data = [""];
      } else {
        data.push("");
      }
      if (typeof log == "undefined") {
        log = [""];
      } else {
        log.push("");
      }
      form.setFieldsValue({
        keys: nextKeys,
        data: data,
        attribute: attr,
        logical: log,
        option: opt
      });
      // console.log('add',form.getFieldsValue())
    },
    selectSubmit() {
      const { form } = this;
      const keys = form.getFieldsValue();
      // console.log('Submit',form.getFieldsValue())
      let res = [];
      let attr = keys.attribute; //表单的值  第一个input的索引
      let log = keys.logical; //第二个input的索引
      let data = keys.data; //第三个input的值
      let n_attr = [];
      let n_log = [];
      let n_data = [];
      for (var i = 0; i < attr.length; i++) {
        if (typeof attr[i] === "undefined") {
        } else {
          let res2 = {};
          res2.columnName = this.columns[attr[i] - 1].value;
          if (this.columns[attr[i] - 1].valueType === 2) {
            res2.op = logOptions.str[log[i] - 1];
          } else if (this.columns[attr[i] - 1].valueType === 1) {
            res2.op = logOptions.num[log[i] - 1];
          }
          res2.value = data[i];
          res.push(res2);
        }
      }
      this.enterList = res;
      let back = this.getFormList();
      // console.log(333, back);
      this.$emit("screenChange", back);
    },
    getFormList() {
      let res = [];
      let list1 = this.getList();
      let list2 = this.enterList;
      res = list1.concat(list2);
      return res;
    }
  }
};
</script>
<style  lang="scss" scoped>
.sc-margin {
  margin-bottom: 16px;
}
.tip {
  font-weight: bold;
  margin-right: 20px;
}
.condition {
  background-color: #fafafa;
  padding: 24px 24px;
  margin-top: 30px;
}
.stick {
  color: rgb(24, 144, 255);
}
</style>

<style>
.condition .ant-form-item {
  margin-bottom: 16px;
}
.condition .ant-btn {
  padding: 0px 9px;
}
</style>