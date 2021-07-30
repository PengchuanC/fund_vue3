<template>
  <div>
    <h4 class="desc-title">风格分类</h4>
    <div :ref="dom" class="chart-style" v-if="ok"></div>
    <div v-else>当前基金暂无此类数据</div>
  </div>
</template>

<script>
import {defineComponent, onMounted, ref} from "vue";
import * as echarts from "echarts";
import dayjs from "dayjs";
import { historyStyle } from "../../../assets/js/api";

export default defineComponent({
  name: "HistoryStyle",
  props: {
    secucode: String
  },
  setup(props){
    const { secucode } = props
    const refs = ref('')
    const ok = ref(true)

    const dom = (el)=>{
      refs.value = el
    }

    onMounted(()=>{
      historyStyle(secucode).then(resp=>{
        if (!!!resp) {
          ok.value = false
          return
        }
        show(resp)
      })
    })

    const show = (data)=>{
      const chart = echarts.init(refs.value)
      const options = {
        tooltip: {
          show: false,
        },
        grid: {
          top: '10',
          bottom: '50'
        },
        textStyle: {
          fontFamily: ['arial', 'kaiti'],
        },
        color: ['#CB2420', '#80A9AE', '#00305C', '#737374', '#DE7C77', '#B1BED0'],
        xAxis: {
          type: 'category',
          data: data.map(x=>dayjs(x.date).format('YYYYMM')),
          axisLabel: {
            rotate: 90,
          },
          axisTick: {
            //x轴刻度相关设置
            alignWithLabel: true,
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: function (value) {
              switch (value) {
                case 0:
                  return '沪深300'
                case 1:
                  return '中证500'
                case 2:
                  return '中证1000'
                case 3:
                  return '创业板综'
              }
            }
          }
        },
        series: [{
          data: data.map(x=>x.value),
          type: 'line',
          symbol: "none",
          step: '1'
        }]
      }
      chart.setOption(options)
    }

    return {dom, ok}
  }
})
</script>

<style scoped>
.desc-title {
  text-align: left;
  margin-bottom: 10px;
}

.chart-style {
  width: 100%;
  height: 300px;
}
</style>
