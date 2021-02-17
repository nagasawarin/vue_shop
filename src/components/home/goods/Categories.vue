<template>
  <div id="#app">
    <breadcrumb></breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCateClick">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 树形表格开始 -->
      <table-tree
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="updCateDialog(scope.row.cat_id, scope.row.cat_name)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="delClick(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </table-tree>
      <!-- 树形表格结束 -->

      <!-- 分页功能开始 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,2,3,4,5,6]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 分页功能结束 -->
    </el-card>

    <!-- 添加分类dialog框开始 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="40%" @close="dialogClose">
      <el-form
        ref="addFormRef"
        :model="cateInfo"
        label-width="100px"
        required
        :rules="rules"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="cateInfo.cat_name" clearable></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            :options="parentCatelist"
            v-model="selectedKeys"
            expand-trigger="hover"
            placeholder="请选择"
            :props="cascaderProps"
            change-on-select
            clearable
            @change="cateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="addCategories">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加分类dialog框结束 -->

    <!-- 修改分类信息dialog框开始 -->
    <el-dialog title="修改分类" :visible.sync="updCateDialogVisible" width="40%" @close="dialogClose">
      <el-form
        ref="addFormRef"
        :model="updCateInfo"
        label-width="100px"
        required
        :rules="rules"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="updCateInfo.cat_name" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updCateDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="updCategories">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改分类信息dialog框结束 -->
  </div>
</template>

<script>
import Breadcrumb from "components/common/Breadcrumb";
import {
  getCateList,
  addCategories,
  delCategories,
  updCategories,
} from "network/goodsRequest";
import { request, getCate } from "assets/content";
export default {
  data() {
    return {
      catelist: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 2,
      },
      total: 0,
      cateInfo: {
        // 分类父 ID，添加一级分类则为0
        cat_pid: 0,
        // 分类名称
        cat_name: "",
        // `0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        cat_level: 0,
      },
      // 添加分类父级分类选中索引
      selectedKeys: [],
      addCateDialogVisible: false,
      // 父级分类信息
      parentCatelist: [],
      // 级联选择器绑定数据
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      updCateInfo: {
        id: 0,
        cat_name: "",
      },
      // 树形表格绑定数据
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "level",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
          width: "190px",
        },
      ],
      updCateDialogVisible: false,
      // 表单验证规则
      rules: {
        cat_name: [
          { required: true, message: "请填写分类名称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    getCateList() {
      // return request({
      //   request: getCateList,
      //   params: this.queryInfo,
      //   success: ,
      //   successMsg: false,
      // });
      return getCate(this.queryInfo, (data) => {
        this.catelist = data.result;
        this.total = data.total;
        return;
      });
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    addCategories() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        request({
          request: addCategories,
          params: this.cateInfo,
          status: 201,
          success: () => {
            this.getCateList();
            this.addCateDialogVisible = false;
          },
        });
      });
    },
    delClick(id) {
      this.messageBox
        .confirm("此操作将永久删除该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          request({
            request: delCategories,
            params: id,
            success: () => {
              if (this.total % this.queryInfo.pagesize === 1) {
                this.queryInfo.pagenum -= 1;
                this.getCateList();
              } else {
                this.getCateList();
              }
            },
            successMsg: false,
          });
        });
    },
    // 监听dialog关闭事件
    dialogClose() {
      this.$refs.addFormRef.resetFields();
      this.selectedKeys = [];
      this.cateInfo.cat_pid = 0;
      this.cateInfo.cat_level = 0;
    },
    getParentCatelist() {
      request({
        request: getCateList,
        params: { type: 2 },
        success: (data) => {
          this.parentCatelist = data;
        },
        successMsg: false,
      });
    },
    addCateClick() {
      this.addCateDialogVisible = true;
      this.getParentCatelist();
    },
    cateChange() {
      if (this.selectedKeys.length > 0) {
        this.cateInfo.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        this.cateInfo.cat_level = this.selectedKeys.length;
      } else {
        this.cateInfo.cat_pid = 0;
      }
    },
    updCateDialog(id, cat_name) {
      this.updCateDialogVisible = true;
      this.updCateInfo = {
        id,
        cat_name,
      };
    },
    updCategories() {
      request({
        request: updCategories,
        params: this.updCateInfo,
        success: () => {
          this.getCateList();
          this.updCateDialogVisible = false;
        },
      });
    },
  },
  components: {
    Breadcrumb,
  },
  created() {
    this.getCateList();
  },
  mounted() {
    setInterval(function () {
      document.querySelectorAll(".el-cascader-node__label").forEach((el) => {
        el.onclick = function () {
          if (this.previousElementSibling) this.previousElementSibling.click();
        };
      });
    }, 1000);
  },
};
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>