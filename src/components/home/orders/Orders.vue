<template>
  <div>
    <breadcrumb></breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div class="clearfix">
        <!-- 查找框开始 -->
        <el-input
          placeholder="请输入内容"
          class="input-with-select"
          v-model="queryInfo.query"
          clearable
          @clear="getOrdersList"
        >
          <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
        </el-input>
      </div>

      <!-- 订单表格 -->
      <el-table :data="ordersList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100%"></el-table-column>
        <el-table-column label="是否付款" width="100%">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80%"></el-table-column>
        <el-table-column label="下单时间" width="180%">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130%">
          <template>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editDialogVisible=true"
            ></el-button>
            <el-button size="mini" type="success" icon="el-icon-setting"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 5, 6, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 修改地址dialog -->
    <el-dialog :visible.sync="editDialogVisible" width="40%" @close="dialogClost">
      <el-form :model="address" :rules="rules" ref="editFormRef" label-width="80px">
        <el-form-item label="省市区/县" prop="city">
          <el-cascader :options="cityData" v-model="address.city"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="fullAddress">
          <el-input v-model="address.fullAddress"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getOrders } from "network/ordersRequest";
import { request } from "assets/content";
import cityData from "./citydata";
export default {
  data() {
    return {
      // 查询信息
      queryInfo: {
        query: "", // 查询参数
        pagenum: 1, // 当前页码
        pagesize: 6, // 当前显示条数
        user_id: "", // 用户ID
        pay_status: "", // 支付状态
        is_send: "", // 是否发货
        order_fapiao_title: "", // 个人 或 公司
        order_fapiao_company: "", // 公司名称
        order_fapiao_content: "", // 发票内容
        consignee_addr: "", // 发货地址
      },
      ordersList: [],
      total: 0,

      cityData, // 城市列表
      editDialogVisible: false,
      address: {
        city: "",
        fullAddress: "",
      },
      rules: {
        city: [],
        fullAddress: [],
      },
    };
  },
  methods: {
    getOrdersList() {
      request({
        request: getOrders,
        params: this.queryInfo,
        success: (data) => {
          this.ordersList = data.goods;
          this.total = data.total;
        },
        successMsg: false,
      });
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrdersList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrdersList();
    },
    dialogClost() {
      this.$refs.editFormRef.resetFields();
    },
  },
  created() {
    this.getOrdersList();
  },
};
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>