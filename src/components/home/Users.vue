<template>
  <div>
    <!-- 面包屑导航开始 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航结束 -->

    <!-- 卡片视图区开始 -->
    <el-card>
      <div class="clearfix">
        <el-input placeholder="请输入内容" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <!-- 添加用户功能开始 -->
        <el-button type="primary" @click="dialogFormVisible = true"
          >添加用户</el-button
        >
        <el-dialog
          title="添加用户"
          :visible.sync="dialogFormVisible"
          width="40%"
        >
          <el-form
            ref="addFormRef"
            :model="newUserInfo"
            label-width="80px"
            hide-required-asterisk
            :rules="loginRules"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="newUserInfo.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="newUserInfo.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="newUserInfo.email"></el-input>
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model.number="newUserInfo.mobile" type="number"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelClick">取 消</el-button>
            <el-button type="primary" @click="addNewUserClick">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 添加用户功能结束 -->
      </div>

      <!-- 用户信息表格开始 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="173">
          <template>
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
            ></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button
                size="small"
                type="warning"
                icon="el-icon-setting"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 用户信息表格结束 -->

      <!-- 分页功能开始 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 7, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 分页功能结束 -->
    </el-card>
    <!-- 卡片视图区结束 -->
  </div>
</template>

<script>
import { userListRequest, addUserRequest } from "network/userRequest";
export default {
  name: "",
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: "",
        //当前的页数
        pagenum: 1,
        // 当前显示多少条数据
        pagesize: 4,
      },
      userList: [],
      total: 0,
      dialogFormVisible: false,
      // 增加新用户的参数对象
      newUserInfo: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 表单校验规则对象
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度为 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度不能小于6位", trigger: "blur" },
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async getUserList() {
      const { data: result } = await userListRequest(this.queryInfo);
      if (result.meta.status !== 200) return alert(result.meta.msg);
      this.userList = result.data.users;
      this.total = result.data.total;
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    cancelClick() {
      this.dialogFormVisible = false;
      this.$refs.addFormRef.resetFields();
    },
    addNewUserClick() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return alert("请填写正确的信息");
        const { data: result } = await addUserRequest(this.newUserInfo);
        console.log(result);
        if (result.meta.status === 201) {
          this.cancelClick();
          alert(result.meta.msg);
        } else {
          return alert(result.meta.msg);
        }
      });
    },
  },
  created() {
    this.getUserList();
  },
};
</script>

<style lang="less" scoped>
.clearfix {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: start;
  margin-bottom: 17px;
  & > .el-button {
    margin-left: 20px;
  }
}
</style>