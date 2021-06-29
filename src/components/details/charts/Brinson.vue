<template>
  <div :ref="dom" class="chart-style"></div>
</template>

<script>
import {onMounted, ref} from "vue";
import request from "../../../request";
import * as echarts from 'echarts';

export default {
  name: "Brinson",
  props: { secucode: String},
  setup(props){

    const { secucode } = props

    const refs = ref('')

    const dom = (el)=>{
      refs.value = el
    }

    const getAttribution = () => {
      request.get('/fundinfo/attr', {params: {secucode: secucode}}).then(r=>{
        const { data, type } = r
        if (type === 'equity'){ drawBrinson(data) }
        else if (type === 'fixincome'){ drawCampisi(data) }
      })
    }

    const drawCampisi = (data) => {
      const ele = refs.value
      const chart = echarts.init(ele);
      const options = {
        // backgroundColor: 'rgba(128, 128, 128, 0.1)',
        textStyle: {
          fontFamily: ['Arial', 'kaiti'],
        },
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
          },
          formatter:function(params){
            let res = params[0].name;
            for (let i = 0; i < params.length; i++) {
              res += "<div style='text-align: left'>"+params[i].marker+params[i].seriesName+"："+ params[i].data.toFixed(4);
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
            data: data.map(x=>x.cycle),
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
            name: '国债效应',
            type: 'bar',
            data: data.map(x=>x.duration)
          },
          {
            name: '息差效应',
            type: 'bar',
            data: data.map(x=>x.spread)
          },
          {
            name: '票息效应',
            type: 'bar',
            data: data.map(x=>x.coupon)
          },
          {
            name: '总收益',
            type: 'bar',
            data: data.map(x=>x.total)
          },
        ]
      }
      chart.setOption(options)
    }

    const drawBrinson = (data) => {
      let x1 = data.map(x => {
        return x.raa ? x.raa.toFixed(4) : 0
      });
      let max1 = Math.ceil(Math.max(...x1.map(x => {
        return Math.abs(x)
      })) * 20) / 20;
      let x2 = data.map(x => {
        return x.rss ? x.rss.toFixed(4) : 0
      });
      let max2 = Math.ceil(Math.max(...x2.map(x => {
        return Math.abs(x)
      })) * 20) / 20;
      let x3 = data.map(x => {
        return x.rin ? x.rin.toFixed(4) : 0
      });
      let max3 = Math.ceil(Math.max(...x3.map(x => {
        return Math.abs(x)
      })) * 20) / 20;
      let x4 = data.map(x => {
        return x.rtt ? x.rtt.toFixed(4) : 0
      });
      let max4 = Math.ceil(Math.max(...x4.map(x => {
        return Math.abs(x)
      })) * 20) / 20;
      let y = data.map(x => {
        return x.industry
      }).reverse()
      const ele = refs.value
      const myChart = echarts.init(ele)
      const option = {
        // backgroundColor: 'rgba(128, 128, 128, 0.1)',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        textStyle: {
          fontFamily: ['Arial', 'kaiti'],
        },
        color: ['#CB2420', '#80A9AE', '#00305C', '#737374', '#DE7C77', '#B1BED0'],
        grid: [
          {x: '7%', y: '15%', width: '20%', height: '70%', show: false,},
          {x: '30%', y: '15%', width: '18%', height: '70%', show: false,},
          {x: '53%', y: '15%', width: '18%', height: '70%', show: false,},
          {x: '76%', y: '15%', width: '18%', height: '70%', show: false,}
        ],
        xAxis: [
          {gridIndex: 0, min: -max1, max: max1, splitLine: {show: false}},
          {gridIndex: 1, min: -max2, max: max2, splitLine: {show: false}},
          {gridIndex: 2, min: -max3, max: max3, splitLine: {show: false}},
          {gridIndex: 3, min: -max4, max: max4, splitLine: {show: false}}
        ],
        yAxis: [
          {
            gridIndex: 0,
            name: "超额收益(%)",
            type: "category",
            data: y
          },
          {
            gridIndex: 1,
            name: "资产配置(%)",
            type: "category",
            axisLabel: {show: false},
            data: y
          },
          {
            gridIndex: 2,
            name: "个股选择(%)",
            type: "category",
            axisLabel: {show: false},
            data: y
          },
          {
            gridIndex: 3,
            name: "交互收益(%)",
            type: "category",
            axisLabel: {show: false},
            data: y
          },
        ],
        series: [
          {
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: x4.reverse()
          },
          {
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: x1.reverse()
          },
          {
            type: 'bar',
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: x2.reverse()
          },
          {
            type: 'bar',
            xAxisIndex: 3,
            yAxisIndex: 3,
            data: x3.reverse()
          },
        ]
      }
      myChart.setOption(option)
    }

    onMounted( () => { getAttribution() })

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