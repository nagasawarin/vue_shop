<template>
  <div id="#app">
    <breadcrumb></breadcrumb>

    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数!" type="warning" :closable="false" v-show="isMessageShow" show-icon></el-alert>
      <!-- 选择商品分类开始 -->
      <p>
        请选择商品分类：
        <el-cascader
          v-model="selectValue"
          :options="cateList"
          :props="cascaderProps"
          @change="cateChange"
        ></el-cascader>
      </p>
      <!-- 选择商品分类结束 -->

      <!-- 显示商品参数信息开始 -->
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <!-- 动态参数开始 -->
        <el-tab-pane label="动态参数" name="many">
          <div class="buttonBox">
            <el-button
              type="primary"
              size="small"
              :disabled="isAdd"
              @click="addAttrDialog=true"
            >添加参数</el-button>
          </div>

          <el-table border :data="cateAttrList">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="item+index"
                  closable
                  @close="tagClose(scope.row,item)"
                >{{item}}</el-tag>
                <el-input
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.newAttrVals"
                  size="small"
                  class="input-new-tag"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ 添加参数</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-edit"
                  size="small"
                  type="primary"
                  @click="openEditDialog(scope.row.attr_id)"
                >修改</el-button>
                <el-button
                  icon="el-icon-delete"
                  size="small"
                  type="danger"
                  @click="delAttrClick(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 动态参数结束 -->

        <!-- 静态属性开始 -->
        <el-tab-pane label="静态属性" name="only">
          <div class="buttonBox">
            <el-button
              type="primary"
              size="small"
              :disabled="isAdd"
              @click="addAttrDialog=true"
            >添加属性</el-button>
          </div>

          <el-table border :data="cateAttrList">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="item+index"
                  closable
                  @close="tagClose(scope.row,item)"
                >{{item}}</el-tag>
                <el-input
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.newAttrVals"
                  size="small"
                  class="input-new-tag"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ 添加参数</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-edit"
                  size="small"
                  type="primary"
                  @click="openEditDialog(scope.row.attr_id)"
                >修改</el-button>
                <el-button
                  icon="el-icon-delete"
                  size="small"
                  type="danger"
                  @click="delAttrClick(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性结束 -->
      </el-tabs>
      <!-- 显示商品参数信息结束 -->
    </el-card>

    <!-- 添加参数dialog开始 -->
    <el-dialog
      :visible.sync="addAttrDialog"
      width="40%"
      @close="dialogClose"
      :title="'添加'+getDialogTitle"
    >
      <el-form ref="addFormRef" :model="newAttr" label-width="80px" required :rules="rules">
        <el-form-item :label="getDialogTitle" prop="attr_name">
          <el-input v-model="newAttr.attr_name" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAttrDialog=false">取 消</el-button>
        <el-button type="primary" @click="addAttrClick">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加参数dialog结束 -->

    <!-- 修改参数dialog开始 -->
    <el-dialog
      :visible.sync="editAttrDialog"
      width="40%"
      @close="dialogClose"
      :title="'修改'+getDialogTitle"
    >
      <el-form ref="addFormRef" :model="editAttr" label-width="80px" required :rules="rules">
        <el-form-item :label="getDialogTitle" prop="attr_name">
          <el-input v-model="editAttr.attr_name" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editAttrDialog=false">取 消</el-button>
        <el-button type="primary" @click="editAttrClick">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改参数dialog结束 -->
  </div>
</template>

<script>
import { request, getCate } from "assets/content";
import {
  getCateAttrList,
  updCateAttr,
  addAttr,
  getAttrById,
  delAttr,
} from "network/goodsRequest";
export default {
  data() {
    return {
      // 当前选中商品
      selectValue: [],
      // 商品分类列表
      cateList: [],
      // 级联选择框关联选项
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      // 是否显示提示框
      isMessageShow: false,
      // 选中选项卡的name
      activeName: "many",
      /* 分类参数部分 */
      // 分类参数列表
      cateAttrList: [],
      isAdd: true,

      /* 添加参数dialog */
      addAttrDialog: false,
      newAttr: {
        attr_name: "",
      },

      /* 修改参数dialog */
      editAttrDialog: false,
      editAttr: {},
      rules: {
        attr_name: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 获取商品参数列表
    getCatelist() {
      getCate({ type: 3 }, (data) => {
        this.cateList = data;
      });
    },
    // 监听商品参数切换
    cateChange() {
      if (this.selectValue.length < 3) {
        this.selectValue = [];
        this.isMessageShow = true;
        this.cateAttrList = [];
        this.isAdd = true;
        return;
      }
      this.isMessageShow = false;
      this.selectValue = this.selectValue[this.selectValue.length - 1];
      this.isAdd = false;
      this.getCateAttrList();
    },
    // 标签页切换
    tabClick() {
      if (this.selectValue.length === 0) return;
      this.getCateAttrList();
    },
    // 获取分类参数列表
    getCateAttrList() {
      request({
        request: getCateAttrList,
        params: {
          id: this.selectValue,
          sel: this.activeName,
        },
        success: (data) => {
          console.log(data);
          data.forEach((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
            item.inputVisible = false;
            item.newAttrVals = "";
          });
          this.cateAttrList = data;
        },
        successMsg: false,
      });
    },
    tagClose(row, tag) {
      this.messageBox
        .confirm("此操作将永久删除该参数，是否继续？", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          row.attr_vals.splice(row.attr_vals.indexOf(tag), 1);
          request({
            request: updCateAttr,
            params: row,
          });
        });
    },
    showInput(row) {
      row.inputVisible = true;
    },
    handleInputConfirm(row) {
      if (row.newAttrVals) {
        row.attr_vals.push(row.newAttrVals);
        request({
          request: updCateAttr,
          params: row,
        });
      }
      row.inputVisible = false;
      row.newAttrVals = "";
    },
    dialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    addAttrClick() {
      console.log(this.selectValue);
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return;
        request({
          request: addAttr,
          params: {
            id: this.selectValue,
            attr_name: this.newAttr.attr_name,
            attr_sel: this.activeName,
          },
          status: 201,
          success: () => {
            this.addAttrDialog = false;
            this.getCateAttrList();
          },
        });
      });
    },
    openEditDialog(attrId) {
      this.editAttrDialog = true;
      request({
        request: getAttrById,
        params: { id: this.selectValue, attrId, attr_sel: this.activeName },
        success: (data) => {
          this.editAttr = data;
        },
        successMsg: false,
      });
    },
    editAttrClick() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return;
        request({
          request: updCateAttr,
          params: this.editAttr,
          success: () => {
            this.getCateAttrList();
            this.editAttrDialog = false;
          },
        });
      });
    },
    delAttrClick(attrid) {
      this.messageBox
        .confirm("此操作将永久删除该参数，是否继续？", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          request({
            request: delAttr,
            params: {
              id: this.selectValue,
              attrid,
            },
            success: () => {
              this.getCateAttrList();
            },
          });
        });
    },
  },
  computed: {
    getDialogTitle() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
  created() {
    this.getCatelist();
  }
};
</script>

<style scoped>
</style>