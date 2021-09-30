<template>
  <div class="allocate-his">
    <div class="chart" :ref="reference"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import {defineComponent, onMounted, ref} from "vue";
import numeral from "numeral";
import { fundHistoricalAllocate } from "../../../assets/js/api";

export default defineComponent({
  name: "AllocateHis",
  props: { secucode: String },
  setup(props){
    const { secucode } = props

    const instance = ref('')

    const reference = (el)=>{
      instance.value = el
    }

    const draw = (data)=>{
      let myChart = echarts.init(instance.value);
      let option = {
        grid: {
          show: false,
          top: 40,
          left: "5%",
          right: "5%",
          bottom: '10%'
        },
        textStyle: {
          fontFamily: ['Arial', 'kaiti'],
        },
        color: ['#CB2420', '#80A9AE', '#00305C', '#737374', '#DE7C77', '#B1BED0'],
        tooltip : {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter:function(params){
            let res = params[0].name;
            let sum = 0
            for (let i = 0; i < params.length; i++) {
              res += "<div style='text-align: left'>"+params[i].marker+params[i].seriesName+"："+ numeral(params[i].data).format('0.00%');
              sum += params[i].data
            }
            res += "<br>合计: " + numeral(sum).format('0.00%')+"</div>"
            return res;
          }
        },
        legend: {
          data:['股票','债券','基金','金属','现金','其他']
        },
        xAxis : [
          {
            type : 'category',
            boundaryGap : false,
            data : data.map(e=>e['日期'])
          }
        ],
        yAxis : [
          {
            type : 'value',
          }
        ],
        series : [
          {
            name:'股票',
            type:'line',
            stack: '占比',
            areaStyle: {},
            data: data.map(e=>e['股票']),
            symbol: "circle"
          },
          {
            name:'债券',
            type:'line',
            stack: '占比',
            areaStyle: {},
            data: data.map(e=>e['债券']),
            symbol: "circle"
          },
          {
            name:'基金',
            type:'line',
            stack: '占比',
            areaStyle: {},
            data: data.map(e=>e['基金']),
            symbol: "circle"
          },
          {
            name:'金属',
            type:'line',
            stack: '占比',
            areaStyle: {},
            data: data.map(e=>e['金属']),
            symbol: "circle"
          },
          {
            name:'现金',
            type:'line',
            stack: '占比',
            areaStyle: {},
            data: data.map(e=>e['现金']),
            symbol: "circle"
          },
          {
            name:'其他',
            type:'line',
            stack: '占比',
            areaStyle: {},
            data: data.map(e=>e['其他']),
            symbol: "circle"
          },
        ]
      };
      myChart.setOption(option)
    }

    const fetch = (secucode) => {
      fundHistoricalAllocate(secucode).then(r=>{
        draw(r.history)
      })
    }

    onMounted(()=> {fetch(secucode)})

    return { reference }
  }
})
</script>

<style scoped>
.allocate-his {
  width: 100%;
}

.chart {
  width: 100%;
  height: 300px;
}
</style>
