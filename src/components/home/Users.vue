<template>
  <div>
    <!-- 面包屑导航开始 -->
    <breadcrumb></breadcrumb>
    <!-- 面包屑导航结束 -->

    <!-- 卡片视图区开始 -->
    <el-card>
      <div class="clearfix">
        <!-- 查找框开始 -->
        <el-input
          placeholder="请输入内容"
          class="input-with-select"
          v-model="queryInfo.query"
          clearable
          @clear="getUserList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getUserList"
          ></el-button>
        </el-input>
        <!-- 查找框结束 -->
        <el-button type="primary" @click="addUserDialogVisible = true"
          >添加用户</el-button
        >
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
            <el-switch
              v-model="scope.row.mg_state"
              @change="stateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="173">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              @click="updateDialog(scope.row.id)"
            ></el-button>
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              @click="userDelete(scope.row.id)"
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
        :page-sizes="[2, 4, 5, 6, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 分页功能结束 -->
    </el-card>
    <!-- 卡片视图区结束 -->

    <!-- 添加用户dialog框开始 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="40%"
      @close="dialogClose"
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
          <el-input
            v-model="newUserInfo.password"
            type="text"
            onfocus="this.type='password'"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="newUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model.number="newUserInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加用户dialog框结束 -->

    <!-- 修改用户dialog框开始 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="updateDialogVisible"
      @close="dialogClose"
    >
      <el-form
        :model="updateUserInfo"
        label-width="60px"
        ref="addFormRef"
        hide-required-asterisk
        :rules="loginRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="updateUserInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model.number="updateUserInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="userInfoUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户dialog框结束 -->
  </div>
</template>

<script>
import {
  userListRequest,
  addUserRequest,
  stateUpdateRequest,
  userDeleteRequest,
  userUpdateRequest,
  getUserInfoById,
} from "network/userRequest";
import request from "assets/content";
import Breadcrumb from "components/common/Breadcrumb";
export default {
  data() {
    let emailRule = (rule, value, callback) => {
      if (!value) return callback();
      let emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (!emailReg.test(value)) {
        return callback(new Error("请输入正确的邮箱地址"));
      }
      callback();
    };
    let mobileRule = (rule, value, callback) => {
      if (!value) return callback();
      let mobileReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
      if (!mobileReg.test(value)) {
        return callback(new Error("请输入正确的手机号码"));
      }
      callback();
    };
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
      // 增加用户dialog控件是否打开
      addUserDialogVisible: false,
      // 修改用户信息dialog控件是否打开
      updateDialogVisible: false,
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
        email: [{ required: false, validator: emailRule, trigger: "blur" }],
        mobile: [{ validator: mobileRule, trigger: "blur" }],
      },
      // 修改用户绑定参数
      updateUserInfo: {
        username: "",
        email: "",
        mobile: "",
      },
    };
  },
  methods: {
    // 获取用户列表
    getUserList() {
      return request({
        request: userListRequest,
        params: this.queryInfo,
        success: (result) => {
          this.userList = result.users;
          this.total = result.total;
          return;
        },
        successMsg: false,
      });
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
    // 监听增加用户dialog关闭事件
    dialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 增加新用户按钮点击事件
    addNewUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        request({
          request: addUserRequest,
          params: this.newUserInfo,
          status: 201,
          success: () => {
            this.getUserList();
            this.addUserDialogVisible = false;
          },
        });
      });
    },
    // 用户状态改变点击事件
    stateChange(userInfo) {
      request({
        request: stateUpdateRequest,
        params: userInfo,
        error: () => {
          userInfo.mg_state = !userInfo.mg_state;
        },
      });
    },
    //删除用户
    userDelete(userId) {
      this.messageBox
        .confirm("此操作将永久删除该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          request({
            request: userDeleteRequest,
            params: userId,
            success: () => {
              this.getUserList().then((value) => {
                if (this.total % this.queryInfo.pagesize == 0) {
                  this.queryInfo.pagenum -= 1;
                  this.getUserList();
                }
              });
            },
          });
        })
        .catch(() => {});
    },
    updateDialog(userId) {
      this.updateDialogVisible = true;
      request({
        request: getUserInfoById,
        params: userId,
        success: ({ id, username, email, mobile }) => {
          this.updateUserInfo = { id, username, email, mobile };
        },
        successMsg: false,
      });
    },
    userInfoUpdate() {
      this.updateDialogVisible = false;
      request({
        request: userUpdateRequest,
        params: this.updateUserInfo,
        success: () => {
          this.getUserList();
        },
      });
    },
  },
  components: {
    Breadcrumb,
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