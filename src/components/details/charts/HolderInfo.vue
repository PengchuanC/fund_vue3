<template>
  <div :ref="dom" class="chart-style"></div>
</template>

<script>
import {onMounted, ref} from "vue";
import request from "../../../request";
import * as echarts from 'echarts';
import numeral from "numeral";

export default {
  name: "HolderInfo",
  props: { secucode: String },
  setup(props){
    const { secucode } = props
    const refs = ref('')

    const dom = (el)=>{
      refs.value = el
    }

    const show = (data)=>{
      const ele = refs.value
      const chart = echarts.init(ele)
      const options = {
        // backgroundColor: 'rgba(128, 128, 128, 0.1)',
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
          },
          formatter:function(params){
            let res = params[0].name;
            for (let i = 0; i < params.length; i++) {
              res += "<div style='text-align: left'>"+params[i].marker+params[i].seriesName+"："+ params[i].data;
            }
            res += "</div>"
            return res;
          }
        },
        legend: {
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
        series: [
          {
            name: '个人投资者',
            type: 'bar',
            stack: 'total',
            label: {
              show: false
            },
            emphasis: {
              focus: 'series'
            },
            data: data.map(x=>numeral(x.individual).format('0.00'))
          },
          {
            name: '机构投资者',
            type: 'bar',
            stack: 'total',
            label: {
              show: false
            },
            emphasis: {
              focus: 'series'
            },
            data: data.map(x=>numeral(x.institution).format('0.00'))
          },
          {
            name: '未明确投资者',
            type: 'bar',
            stack: 'total',
            label: {
              show: false
            },
            emphasis: {
              focus: 'series'
            },
            data: data.map(x=>numeral(x.undefined).format('0.00'))
          }
        ]
      }
      chart.setOption(options)
      window.onresize = ()=>{
        chart.resize()
      }
    }

    const getHolder = ()=>{
      request.get('/fundinfo/holder', {params: {secucode: secucode}}).then(r=>{
        const data = r.data
        show(data)
      })
    }

    onMounted(()=>{ getHolder() })

    return { dom }
  }
}
</script>

<style scoped>
.chart-style {
  width: 100%;
  height: 300px;
}
</style>