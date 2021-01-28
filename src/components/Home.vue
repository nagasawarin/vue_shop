<template>
  <div>
    <el-button type="info" round @click="logOutClick">退出</el-button>
  </div> 
</template>

<script>
export default {
  name: "",
  methods:{
    logOutClick(){
      window.sessionStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
</style>