<template>
  <div class="item">
    <div class="flag">
      <div class="progress back" v-if="!first_path"></div>
      <div class="progress no_back" v-if="first_path"></div>
      <div class="num" v-bind:class="{ current: isCurrent,normal:!isCurrent}">{{flag}}</div>
      <div class="progress back" v-if="!last_path"></div>
    </div>
    <div class="card" v-bind:class="{ current: isCurrent, normal:!isCurrent}" @click="clickPath">
      <div class="smile">
        <img :src="path.imgUrl" />
      </div>
      <div class="info">
        <!-- <div>药物靶标评分：
        <span>{{path.score}}</span>
        </div>-->
        <div v-bind:class="{ opt: isOptQed}">
          QED Weighted：
          <span>{{path.qed}}</span>
        </div>
        <div v-bind:class="{ opt: isOptQedsa}">
          SA score:
          <span>{{path.saScore}}</span>
        </div>
        <div>
          #Ro5 Violations：
          <span>{{path.ro5Violations}}</span>
        </div>
      </div>
    </div>
    <div class="clearfloat"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cur_path: JSON.parse(sessionStorage.getItem("cur_path"))
    };
  },
  props: {
    path: {},
    flag: {},
    current_num:''
  },
  created() {
    // console.log(11111, this.path,this.current_num);
    // console.log(22222, this.flag);
  },
  computed: {
    first_path() {
      if (this.flag == 1) {
        return true;
      } else {
        return false;
      }
    },
    last_path() {
      // let paths = JSON.parse(sessionStorage.getItem("path") || "[]");
      if (this.flag == this.current_num) {
        return true;
      } else {
        return false;
      }
    },
    isCurrent() {
      // if (this.path.id === this.cur_path.id) {
      //   // if (this.path.scoring_target === this.cur_path.scoring_target) {
      //   //   if (this.path.optimize_prop === this.cur_path.optimize_prop) {
      //       return true;
      //   //   }
      //   // }
      // }
      return false;
    },
    isOptQed() {
      if (this.path.property == 1) {
        return true;
      } 
    },
    isOptQedsa() {
      if (this.path.property == 2) {
        return true;
      } 
    }
  },

  methods: {
    clickPath() {
      this.cur_path == this.path; //当前优化分子的详情卡片
    

      sessionStorage.setItem("cur_path", JSON.stringify(this.path));

      let taskid = this.path.taskId;
      if (this.flag === 1) {
      } else if(this.current_num === this.flag){

      }
      else {
        let routeData = this.$router.resolve({
        path: "/search/taskdetail",
        query: {
          taskid: taskid,
          page:this.$route.query.page,
          pageSize:this.$route.query.pageSize,
          // optimizationMoleculeId:this.path.id
        }
      }); 
        window.open(routeData.href,"_blank"); 
      }

    }
  }
};
</script>
<style lang="scss" scoped>
.item {
  width: 290px;
  height: 380px;
  float: left;
}
.flag {
  width: 300px;
  margin: 0px auto;
  padding: 0px 0px;
}
.progress {
  float: left;
  width: 128px;
  height: 8px;
  border-radius: 20px;
  margin-top: 8px;
  margin-bottom: 8px;
  overflow: visible;
  position: relative;
}
.back {
  background: rgb(234, 234, 234);
}
.no_back {
  background: #fafafa;
}

.num {
  float: left;
  width: 22px;
  margin: 0 auto;
  border-radius: 18px;
  margin-bottom: 8px;
  margin-left: 8px;
  margin-right: 8px;
  text-align: center;
}
.current {
  border: 1px solid rgba(24, 144, 255, 1);
}
.normal {
  border: 0.5px solid rgb(217, 217, 217);
}
.card {
  width: 270px;
  height: 352px;
  background-color: white;
  border-radius: 2px;
  margin-left: 16px;
  float: left;
  box-shadow: 2px 1px 3px 0px rgba(24, 144, 255, 0.2);
}
.card:hover {
  box-shadow: 4px 2px 18px 0px rgba(24, 144, 255, 0.2);
}

.smile {
  width: 270px;
  height: 240px;
  border-bottom: 0.5px solid rgb(217, 217, 217);
  padding-top: 2px;
  text-align: center;
  img {
    width: 80%;
  }
}
.opt {
  color: red;
}
.info {
  padding: 8px 15px;
  text-align: left;
  font-size: 13px;
  div {
    margin-bottom: 4px;
  }
  span {
    float: right;
  }
}
.operate {
  clear: both;
  padding: 8px 15px;
  display: flex;
  justify-content: space-between;
}
.check {
  position: relative;
  z-index: 10;
  left: 270px;
  top: -10px;
  width: 20px;
  height: 20px;
  border: 1px solid rgb(217, 217, 217);
}
</style>

