<template>
  <div id="#app">
    <breadcrumb></breadcrumb>

    <el-card>
      <div class="clearfix">
        <!-- 查找框开始 -->
        <el-input
          placeholder="请输入内容"
          class="input-with-select"
          v-model="queryInfo.query"
          clearable
          @clear="getGoodsList"
        >
          <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
        </el-input>
        <!-- 查找框结束 -->
        <el-button type="primary" @click="goAddGoodsPage">添加商品</el-button>
      </div>

      <!-- 商品表格开始 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100%"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80%"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140%">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120%">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              @click="goEditGoodsPage(scope.row.goods_id)"
            ></el-button>
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              @click="delGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 商品表格结束 -->

      <!-- 分页功能开始 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 5, 6, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 分页功能结束 -->
    </el-card>
  </div>
</template>

<script>
import {
  getGoods,
  delGoods,
} from "network/goodsRequest";
import { request } from "assets/content";
export default {
  data() {
    return {
      queryInfo: {
        // 查询参数
        query: "",
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 5,
      },
      // 商品列表
      goodsList: [],
      // 总条数
      total: 0,
    };
  },
  methods: {
    getGoodsList() {
      return request({
        request: getGoods,
        params: this.queryInfo,
        success: (data) => {
          this.goodsList = data.goods;
          this.total = data.total;
        },
        successMsg: false,
      });
    },
    // 监听单页显示条数改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    // 监听页码改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    // 删除商品事件
    delGoods(id) {
      this.messageBox
        .confirm("此操作将永久删除该商品, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          request({
            request: delGoods,
            params: id,
            success: () => {
              this.getGoodsList().then((value) => {
                if (
                  this.total / this.queryInfo.pagesize + 1 ==
                  this.queryInfo.pagenum
                ) {
                  this.queryInfo.pagenum -= 1;
                  this.getGoodsList();
                }
              });
            },
          });
        });
    },
    goAddGoodsPage() {
      this.$router.push("/home/addGoods");
    },
    goEditGoodsPage(goods_id) {
      this.$router.push({
        path: "/home/addGoods",
        query: {
          goods_id
        },
      });
    },
  },
  created() {
    this.getGoodsList();
  },
};
</script>

<style scoped>
</style>