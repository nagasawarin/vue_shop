<template>
  <div id="#app">
    <breadcrumb></breadcrumb>

    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from "components/common/Breadcrumb";
import { request } from "assets/content";
import { rightsListRequest } from "network/powerRequest";
export default {
  data() {
    return {
      rightsList: [],
    };
  },
  components: {
    Breadcrumb,
  },
  methods: {
    getRightsList() {
      request({
        request: rightsListRequest,
        params: "list",
        success: (data) => {
          this.rightsList = data;
        },
        successMsg: false,
      });
    },
  },
  created() {
    this.getRightsList();
  },
};
</script>

<style scoped>
</style>