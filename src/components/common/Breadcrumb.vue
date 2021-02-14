<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>
      {{
      $store.state.menuName.submenuName
      }}
    </el-breadcrumb-item>
    <el-breadcrumb-item>
      {{
      $store.state.menuName.menuitemName
      }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  created() {
    if (sessionStorage.getItem("menuitemName")) {
      let submenuName = sessionStorage.getItem("submenuName");
      let menuitemName = sessionStorage.getItem("menuitemName");
      this.$store.commit("menuNameChange", { submenuName, menuitemName });
      sessionStorage.removeItem("submenuName");
      sessionStorage.removeItem("menuitemName");
    }
    // 监听用户刷新页面
    window.addEventListener("beforeunload", (e) => {
      sessionStorage.setItem(
        "submenuName",
        this.$store.state.menuName.submenuName
      );
      sessionStorage.setItem(
        "menuitemName",
        this.$store.state.menuName.menuitemName
      );
    });
  },
  destroyed() {
    window.removeEventListener("beforeunload", () => {});
  },
};
</script>

<style scoped>
</style>