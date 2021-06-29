<template>
  <div>
    <div :ref="dom" class="chart-style" v-if="showChart"></div>
    <div v-else>暂无数据或基金类型不适用</div>
  </div>
</template>

<script>
import {onMounted, ref} from "vue";
import request from "../../../request";
import * as echarts from 'echarts'

export default {
  name: "Turnover",
  props: { secucode: String },
  setup(props){
    const { secucode } = props
    const refs = ref('')

    const dom = (el)=>{
      refs.value = el
    }

    const showChart = ref(true)

    const drawTurnoverChart = (data)=>{
      const ele = refs.value
      const chart = echarts.init(ele)
      const options = {
        // backgroundColor: 'rgba(128, 128, 128, 0.1)',
        color: ['#CB2420', '#80A9AE', '#00305C', '#737374', '#DE7C77', '#B1BED0'],
        grid: {
          show: false,
          top: 30,
          left: "10%",
          right: "5%",
          bottom: '10%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        xAxis: [
          {
            type: 'category',
            data: data.map(x=>x.date),
            axisPointer: {show: true}
          }
        ],
        yAxis: {
          axisLabel: {
            formatter: (value) => {
              return `${value}%`
            }
          },
          axisPointer: {show: true},
          scale: true
        },
        textStyle: {
          fontFamily: ['kaiti', 'Arial']
        },
        series: [
          {
            name: '换手率',
            type: 'line',
            data: data.map(x=>x.ratio),
            symbol: "circle"
          },
        ]
      }
      chart.setOption(options)
      window.onresize = ()=>{
        chart.resize()
      }
    }

    const getTurnover = ()=>{
      request.get('/fundinfo/turnover', {params: {secucode: secucode}}).then(r=>{
        const data = r.data
        if (data.length === 0) {
          showChart.value = false
          return
        }
        drawTurnoverChart(data)
      }).catch(()=>{
        showChart.value = false
      })
    }

    onMounted(()=>{ getTurnover() })

    return { dom, showChart }
  }
}
</script>

<style scoped>
.chart-style {
  width: 100%;
  height: 300px;
}
</style>