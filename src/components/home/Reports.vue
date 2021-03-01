<template>
  <div>
    <breadcrumb></breadcrumb>
    <el-card>
      <div id="main" style="width:800px;height:500px;"></div>
    </el-card>
  </div>
</template>

<script>
import { getReports } from "network/reportsRequest";
import { request } from "assets/content";
import * as echarts from "echarts";
export default {
  data() {
    return {
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  mounted() {
    var myChart = echarts.init(document.getElementById("main"));
    request({
      request: getReports,
      success: (data) => {

        // 使用递归合并两个对象
        function extend(o1, o2) {
          for (let k in o2) {
            o1[k] =
              o1[k] && o1[k].toString() === "[object Object]"
                ? extend(o1[k], o2[k])
                : (o1[k] = o2[k]);
          }
          return o1;
        }

        myChart.setOption(extend(data,this.options));
      },
    });
  },
};
</script>

<style scoped>
</style>
