<template>
  <el-container class="container">
    <!-- 头部信息开始 -->
    <el-header>
      <div>
        <img src="~assets/images/Logo.png" alt="logo" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" round @click="logOutClick">退出</el-button>
    </el-header>
    <!-- 头部信息结束 -->

    <!-- 主页面部分开始 -->
    <el-container class="main">
      <!-- 侧边栏开始 -->
      <el-aside :width="isCollapse ? '60px' : '200px'">
        <!-- 菜单列表 -->
        <el-menu
          background-color="#353535"
          text-color="#fff"
          active-text-color="#4091FF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <!-- 一级菜单开始 -->
          <el-submenu :index="item.id.toString()" v-for="(item, index) in menuList" :key="item.id">
            <template slot="title">
              <i class="iconfont" :class="menuIcon[index]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单开始 -->
            <el-menu-item
              :index="'/home/' + childItem.path"
              v-for="childItem in item.children"
              :key="childItem.id"
              @click="pageChange(item.authName, childItem.authName)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ childItem.authName }}</span>
              </template>
            </el-menu-item>
            <!-- 二级菜单结束 -->
          </el-submenu>
          <!-- 一级菜单结束 -->
        </el-menu>
        <!-- 菜单列表结束 -->

        <!-- 菜单收缩按钮开始 -->
        <div class="toggle-button" @click="toggleCollapse">
          <i
            class="iconfont"
            :class="
              isCollapse ? 'icon-zhediehengxiang' : 'icon-zhankaihengxiang'
            "
          ></i>
        </div>
        <!-- 菜单收缩按钮结束 -->
      </el-aside>
      <!-- 侧边栏结束 -->

      <!-- 主体部分开始 -->
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- 主体部分结束 -->
    </el-container>
    <!-- 主页面部分结束 -->
  </el-container>
</template>

<script>
import { asideMenusRequest } from "network/leftAsideRequest";
import { request } from "assets/content";
export default {
  name: "home",
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      menuIcon: [
        "icon-weibiaoti2",
        "icon-chanpinguanli",
        "icon-shangpin",
        "icon-dingdan",
        "icon-tongji",
      ],
      // 是否折叠左侧菜单
      isCollapse: true,
    };
  },
  methods: {
    pageChange(submenuName, menuitemName) {
      this.$store.commit("menuNameChange", { submenuName, menuitemName });
    },
    logOutClick() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    getMenuList() {
      request({
        request: asideMenusRequest,
        success: (data) => {
          this.menuList = data;
        },
        successMsg: false,
      });
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
  created() {
    this.getMenuList();
  },
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
}
.main{
  height:100%-60px;
}
.el-header {
  background-color: #1e1e1e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  padding-left: 5px;
  img {
    vertical-align: middle;
  }
  span {
    margin-left: 10px;
  }
}
.el-aside {
  background-color: #353535;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .el-menu {
    border: 0;
    .iconfont {
      margin-right: 10px;
    }
  }
}
.el-main {
  background-color: #dee1e6;
}

.toggle-button {
  background-color: #535353;
  width: 100%;
  display: flex;
  justify-content: center;
  cursor: pointer;
  .iconfont {
    font-size: 20px;
    padding: 5px;
    color: white;
  }
}
</style>