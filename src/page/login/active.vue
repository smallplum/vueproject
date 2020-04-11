<template>
  <div>激活页面</div>
</template>

<script>
import axios from "axios";
export default {
  components: {},
  mounted() {
    this.auto();
  },
  name: "active",
  methods: {
    auto() {
        let url= window.location.href;
        let userActiveCode = url.split("=")[1];
      axios
        .get("/molecule/user/active?userActiveCode="+userActiveCode )
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
              console.log(this.userActiveCode);
              
            this.$message({
              showClose: true,
              message: "激活成功，请登录",
              type: "success"
            });
            this.$router.push({ path: "/" });
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: '系统错误，清稍后重试',
            type: "error"
          });
          this.$router.push({ path: "/review" });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>