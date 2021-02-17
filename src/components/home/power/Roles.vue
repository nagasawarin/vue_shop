<template>
  <div id="#app">
    <breadcrumb></breadcrumb>

    <!-- 卡片开始 -->
    <el-card>
      <div class="buttonBox">
        <el-button type="primary" @click="addRoleDialogVisible=true">添加角色</el-button>
      </div>

      <!-- 表格开始 -->
      <el-table :data="rolesList" border stripe>
        <!-- 权限展开开始 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 一级权限 -->
            <el-row
              class="btmBorder"
              :class="{ tpBorder: index === 0 }"
              v-for="(item, index) in scope.row.children"
              :key="item.id"
              type="flex"
              align="middle"
            >
              <el-col :span="5">
                <el-tag closable @close="deleteRoleRights(scope.row, item.id)">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row
                  v-for="(childItem01, childIndex) in item.children"
                  :key="childItem01.id"
                  :class="{ tpBorder: childIndex !== 0 }"
                  type="flex"
                  align="middle"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="deleteRoleRights(scope.row, childItem01.id)"
                    >{{ childItem01.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="childItem02 in childItem01.children"
                      :key="childItem02.id"
                      closable
                      @close="deleteRoleRights(scope.row, childItem02.id)"
                    >{{ childItem02.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 权限展开结束 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <!-- 角色操作开始 -->
        <el-table-column label="操作" width="284">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="UpdRoleDialogShow(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="roleDelete(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="small"
              @click="roleRightsAdmin(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
        <!-- 角色操作结束 -->
      </el-table>
      <!-- 表格结束 -->

      <!-- 添加角色dialog开始 -->
      <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="40%" @close="dialogClose">
        <el-form
          ref="addFormRef"
          :model="roleInfo"
          label-width="80px"
          hide-required-asterisk
          :rules="rules"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="roleInfo.roleName" clearable></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="roleInfo.roleDesc" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addNewRole">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加角色dialog结束 -->

      <!-- 编辑角色信息dialog开始 -->
      <el-dialog
        title="更改角色信息"
        :visible.sync="apdRoleDialogVisible"
        width="40%"
        @close="dialogClose"
      >
        <el-form
          ref="addFormRef"
          :model="updRoleInfo"
          label-width="80px"
          hide-required-asterisk
          :rules="rules"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="updRoleInfo.roleName" clearable></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="updRoleInfo.roleDesc" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="apdRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateRole">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑角色信息dialog结束 -->

      <!-- 分配权限dialog开始 -->
      <el-dialog title="权限分配" :visible.sync="rightsDialogVisible" @close="rightsDialogClose">
        <el-tree
          :data="roleRights"
          show-checkbox
          node-key="id"
          :props="rightsDefaultProps"
          default-expand-all
          :default-checked-keys="rightsdefKeys"
          ref="rightsTreeRef"
        ></el-tree>
        <span slot="footer">
          <el-button @click="rightsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="rightsTreeClick()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限dialog结束 -->
    </el-card>
    <!-- 卡片结束 -->
  </div>
</template>

<script>
import Breadcrumb from "components/common/Breadcrumb";
import { request, getRolesList } from "assets/content";
import {
  roleRightsDelete,
  rightsListRequest,
  roleRidUpdateRequest,
  roleDelRequest,
  roleAddRequest,
  getRoleByIdRequest,
  updRoleRequest,
} from "network/powerRequest";
export default {
  data() {
    return {
      rolesList: [],
      // 是否打开权限列表窗口
      rightsDialogVisible: false,
      rightsDefaultProps: {
        label: "authName",
        children: "children",
      },
      // 树形权限列表
      roleRights: [],
      // 权限列表默认选中选项id数组
      rightsdefKeys: [],
      roleId: "",
      // 是否打开添加角色窗口
      addRoleDialogVisible: false,
      // 角色信息
      roleInfo: {
        roleName: "",
        roleDesc: "",
      },
      // 修改角色信息窗口是否打开
      apdRoleDialogVisible: false,
      updRoleInfo: {},
      // 表单验证规则
      rules: {
        roleName: [
          { required: true, message: "请填写角色名称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    getRoles() {
      getRolesList((data) => {
        this.rolesList = data;
      });
    },
    deleteRoleRights(role, id) {
      this.messageBox
        .confirm("此操作将永久删除该权限，是否继续？", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          deleteReq({ id, successMsg: true });
        });

      let deleteReq = ({ id, successMsg = false }) => {
        request({
          request: roleRightsDelete,
          params: { role, rightsId: id },
          success: (data) => {
            role.children = data;
            // 使用递归找到没有三级权限的二级权限
            // 和 没有二级权限的一级权限并删除掉
            (function test(node) {
              if (node.children.length === 0) {
                return deleteReq({ id: node.id });
              }
              node.children.forEach((item) => {
                if (item.children) {
                  test(item);
                }
              });
            })(role);
          },
          successMsg,
        });
      };
    },
    // 展示分配权限树形列表
    roleRightsAdmin(role) {
      this.roleId = role.id;
      this.getRightsList();
      // 通过递归拿到三级权限的id，并压入数组内
      this.getRightsdefKeys(role, this.rightsdefKeys);
      this.rightsDialogVisible = true;
    },
    // 通过遍历获取权限id数组
    getRightsdefKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getRightsdefKeys(item, arr);
      });
    },
    // 获取权限列表
    getRightsList() {
      request({
        request: rightsListRequest,
        params: "tree",
        success: (data) => {
          this.roleRights = data;
        },
        successMsg: false,
      });
    },
    // 关闭树形权限列表时清空被选中的权限id列表
    rightsDialogClose() {
      this.rightsdefKeys = [];
    },
    // 分配权限
    rightsTreeClick() {
      const keys = [
        ...this.$refs.rightsTreeRef.getCheckedKeys(),
        ...this.$refs.rightsTreeRef.getHalfCheckedKeys(),
      ];
      request({
        request: roleRidUpdateRequest,
        params: {
          roleId: this.roleId,
          rids: keys.join(","),
        },
        success: () => {
          this.getRoles();
          this.rightsDialogVisible = false;
        },
      });
    },
    // 删除角色
    roleDelete(id) {
      this.messageBox
        .confirm("此操作将永久删除该角色, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          request({
            request: roleDelRequest,
            params: id,
            success: () => {
              this.getRoles();
            },
          });
        })
        .catch(() => {});
    },
    // 增加角色
    addNewRole() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        request({
          request: roleAddRequest,
          params: this.roleInfo,
          status: 201,
          success: () => {
            this.getRoles();
            this.addRoleDialogVisible = false;
          },
        });
      });
    },
    UpdRoleDialogShow(roleId) {
      this.getRoleById(roleId);
      this.apdRoleDialogVisible = true;
    },
    updateRole() {
      request({
        request: updRoleRequest,
        params: this.updRoleInfo,
        success: () => {
          this.getRoles();
          this.apdRoleDialogVisible = false;
        },
        successMsg: "用户信息更新成功",
      });
    },
    getRoleById(id) {
      request({
        request: getRoleByIdRequest,
        params: id,
        success: (data) => {
          this.updRoleInfo = data;
        },
        successMsg: false,
      });
    },
    // 监听dialog关闭事件
    dialogClose() {
      this.$refs.addFormRef.resetFields();
    },
  },
  components: {
    Breadcrumb,
  },
  created() {
    this.getRoles();
  },
};
</script>

<style lang="less" scoped>
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