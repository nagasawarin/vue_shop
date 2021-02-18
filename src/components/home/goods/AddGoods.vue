<template>
  <div id="#app">
    <breadcrumb></breadcrumb>
    <el-card>
      <el-alert title="商品信息" type="info" :closable="false" center show-icon></el-alert>
      <!-- 步骤条开始 -->
      <el-steps :active="active-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 步骤条结束 -->

      <!-- 标签页开始 -->
      <el-form :model="addFormData" ref="addFormRef" :rules="rules" tab-position="top">
        <el-tabs
          tab-position="left"
          v-model="active"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addFormData.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addFormData.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addFormData.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addFormData.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <br />
              <el-cascader
                v-model="addFormData.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <br />
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(item2, index) in item.attr_vals"
                  :key="index"
                  :label="item2"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addFormData.goods_introduce"></quill-editor>
            <el-button type="primary" class="addGoodsBtn" @click="requestClick">{{pageName}}</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 标签页结束 -->
    </el-card>
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import {
  getCateAttrList,
  addGoods,
  getGoodsById,
  editGoods,
} from "network/goodsRequest";
import { request, getCate } from "assets/content";
export default {
  data() {
    return {
      active: 0, // 当前进度
      addFormData: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: [],
      }, // 添加商品的表单数据对象
      cateList: [],
      // 级联选择框关联选项
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      manyTableData: [], //动态参数列表数据
      onlyTableData: [], //静态属性列表数据
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewPath: "",
      previewVisible: false,
      pageName: "",
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
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
    // 监听级联选择器选项更改
    handleChange() {
      if (this.addFormData.goods_cat.length < 3) {
        this.addFormData.goods_cat = [];
        return;
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if(typeof this.addFormData.goods_cat === 'string'){
        this.addFormData.goods_cat = this.addFormData.goods_cat.split(',');
      }
      if (oldActiveName === "0" && this.addFormData.goods_cat.length != 3) {
        alert("请选择商品分类");
        return false;
      }
    },
    tabClicked() {
      if (this.pageName === "修改商品") {
        if (this.active === "1") {
          this.manyTableData = [];
          this.addFormData.attrs.forEach((item) => {
            if (item.attr_sel === "many") {
              item.attr_vals = item.attr_value
                ? item.attr_value.split(",")
                : [];
              this.manyTableData.push(item);
            }
          });
        }
        if (this.active === "2") {
          this.onlyTableData = [];
          this.addFormData.attrs.forEach((item) => {
            if (item.attr_sel === "only") {
              this.onlyTableData.push(item);
            }
          });
        }
      } else {
        if (this.active === "1") {
          request({
            request: getCateAttrList,
            params: {
              id: this.cateId,
              sel: "many",
            },
            success: (data) => {
              data.forEach((item) => {
                item.attr_vals = item.attr_vals.length
                  ? item.attr_vals.split(",")
                  : [];
              });
              this.manyTableData = data;
            },
            successMsg: false,
          });
        }
        if (this.active === "2") {
          request({
            request: getCateAttrList,
            params: {
              id: this.cateId,
              sel: "only",
            },
            success: (data) => {
              this.onlyTableData = data;
            },
            successMsg: false,
          });
        }
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    // 处理移除图片处理
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const i = this.addFormData.pics.findIndex((x) => {
        x.pic === filePath;
      });
      this.addFormData.pics.splice(i, 1);
    },
    handleSuccess(response) {
      this.addFormData.pics.push({ pic: response.data.tmp_path });
    },
    requestClick() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return alert("请填写必要的表单项");
        this.addFormData.attrs = [];
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(","),
          };
          this.addFormData.attrs.push(newInfo);
        });
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addFormData.attrs.push(newInfo);
        });
        if (this.$route.query.goods_id) {
          request({
            request: editGoods,
            params: this.addFormData,
            success: () => {
              this.$router.push("/home/goods");
            },
          });
        } else {
          request({
            request: addGoods,
            params: this.addFormData,
            status: 201,
            success: () => {
              this.$router.push("/home/goods");
            },
          });
        }
      });
    },
    getGoodsById(goods_id) {
      request({
        request: getGoodsById,
        params: goods_id,
        success: (data) => {
          data.goods_cat = data.goods_cat.split(",");
          data.goods_cat = data.goods_cat.map((item) => {
            return parseInt(item);
          });
          this.addFormData = data;
        },
        successMsg: false,
      });
    },
  },
  computed: {
    cateId() {
      if (this.addFormData.goods_cat.length === 3) {
        return this.addFormData.goods_cat[2];
      }
      return null;
    },
  },
  created() {
    if (this.$route.query.goods_id) {
      this.pageName = "修改商品";
      this.getGoodsById(this.$route.query.goods_id);
    } else {
      this.pageName = "添加商品";
    }
    this.getCatelist();
    this.$store.commit("menuNameChange", {
      submenuName: "商品管理",
      menuitemName: this.pageName,
    });
  },
};
</script>

<style scoped>
.el-steps {
  margin: 15px 0;
}
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.addGoodsBtn {
  margin-top: 10px;
}
</style>