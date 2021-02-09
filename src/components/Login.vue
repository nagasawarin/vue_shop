<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="~assets/images/avatar.jpg" alt="默认头像" />
      </div>

      <el-form class="login_form" :model="loginForm" :rules="loginRules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-yonghu" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="iconfont icon-mima" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item class="login_btns">
          <el-button type="primary" @click="loginClick">登陆</el-button>
          <el-button type="info" @click="resetClick">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { request } from "assets/content";
import { userInfoRequest } from "network/userRequest";
export default {
  name: "login",
  data() {
    return {
      // 用户登陆信息对象
      loginForm: {
        username: "",
        password: "",
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
      },
    };
  },
  methods: {
    resetClick() {
      // element-UI的表单重置方法
      this.$refs.loginFormRef.resetFields();
    },
    loginClick() {
      // element-UI的对整个表单进行校验的方法
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        try {
          request({
            request: userInfoRequest,
            params: this.loginForm,
            success: (data) => {
              /* 
                登陆成功后服务器会返回一个token，将此token保存到sessionStorage中
                客户退出登陆或者结束此次会话时，token会被删除
                访问其他页面时带有token则放行，否则提示让用户登陆
                有token = 已登陆；  没有token = 未登陆
              */
              window.sessionStorage.setItem("token", data.token);
              this.$router.push("/home");
            },
            successMsg: false,
          });
        } catch (e) {
          alert("错误" + e);
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.login_container {
  background-color: #70b0e4f1;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  background-color: rgb(214, 211, 211);
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid rgba(241, 241, 241, 0.575);
    border-radius: 50%;
    padding: 7px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(238, 238, 238, 0.37);
    img {
      width: 100%;
      height: 100%;
      background-color: #eee;
      border-radius: 50%;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;

  .login_btns {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>