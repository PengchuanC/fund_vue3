<template>
  <div class="industry-sw">
    <div class="chart" :ref="reference" v-if="show"></div>
    <div v-else>此基金没有该配置项</div>
  </div>
</template>

<script>
import {onMounted, ref} from "vue";
import numeral from "numeral";
import * as echarts from 'echarts';
import { fundIndustryStyle } from "../../../assets/js/api";

export default {
  name: "IndustrySw",
  props: { secucode: String },
  setup(props){
    const { secucode } = props
    const instance = ref(document.body)
    const show = ref(true)

    const reference = (el)=>{
      instance.value = el
    }

    const draw = (data)=>{
      const myChart = echarts.init(instance.value);
      const options = {
        tooltip : {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter:function(params){
            console.log(params[0])
            let res = params[0].name;
            for (let i = 0; i < params.length; i++) {
              res += "<div style='text-align: left'>"+params[i].marker+params[i].seriesName+"："+ params[i].data;
            }
            res += "</div>"
            return res;
          }
        },
        textStyle: {
          fontFamily: ['Arial', 'kaiti'],
        },
        color: ['#CB2420', '#80A9AE', '#00305C', '#737374', '#DE7C77', "#CADBF6"],
        legend: {
          data: data.names
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.data.map(x=>x.date)
        },
        yAxis: {
          type: 'value',
          max: 100
        },
        series: data.names.map((e)=>{
          return {
            name: e,
            type: 'bar',
            stack: 'total',
            label: {
              show: false
            },
            emphasis: {
              focus: 'series'
            },
            data: data.data.map(x=>numeral(x[e]*100).format('0.00'))
          }
        })
      }
      myChart.setOption(options)
    }

    onMounted( ()=> {
      show.value = true
      fundIndustryStyle(secucode).then(r=>{
        if (!!r) {
          draw(r)
        } else {
          show.value = false
        }
      })
    })

    return { reference, show }
  }
}
</script>

<style scoped>
.industry-sw {
  width: 100%;
}

.chart {
  width: 100%;
  height: 300px;
}
</style>
