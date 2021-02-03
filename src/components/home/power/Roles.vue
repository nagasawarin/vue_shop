<template>
  <div>
    <breadcrumb></breadcrumb>

    <el-card>
      <div class="buttonBox">
        <el-button type="primary">添加用户</el-button>
      </div>

      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              class="btmBorder"
              :class="{ tpBorder: index === 0 }"
              v-for="(item, index) in scope.row.children"
              :key="item.id"
              type="flex"
              align="middle"
            >
              <el-col :span="5">
                <el-tag>{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <el-col :span="19">
                <el-row
                  v-for="(childItem01, childIndex) in item.children"
                  :key="childItem01.id"
                  :class="{ tpBorder: childIndex !== 0 }"
                  type="flex"
                  align="middle"
                >
                  <el-col :span="6">
                    <el-tag type="success">{{ childItem01.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="childItem02 in childItem01.children"
                      :key="childItem02.id"
                      >{{ childItem02.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="284">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="small"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="small"
              >删除</el-button
            >
            <el-button type="warning" icon="el-icon-setting" size="small"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from "components/common/Breadcrumb";
import request from "assets/content";
import { rolesListRequest } from "network/powerRequest";
export default {
  data() {
    return {
      rolesList: [],
    };
  },
  methods: {
    getRolesList() {
      request({
        request: rolesListRequest,
        success: (data) => {
          this.rolesList = data;
        },
        successMsg: false,
      });
    },
  },
  components: {
    Breadcrumb,
  },
  created() {
    this.getRolesList();
  },
};
</script>

<style lang="less" scoped>
.buttonBox {
  margin-bottom: 17px;
}
.el-tag {
  margin: 10px 0;
}
.el-tag.el-tag--warning {
  margin: 10px;
}
.btmBorder {
  border-bottom: 1px solid rgb(218, 218, 218);
}
.tpBorder {
  border-top: 1px solid rgb(218, 218, 218);
}
</style>