<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{
      $store.state.menuName.submenuName
    }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{
      $store.state.menuName.menuitemName
    }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
};
</script>

<style scoped>
</style>