<template>
 <div class="scale-change-chart" :ref="dom">
   规模变化
 </div>
</template>

<script>
import {defineComponent, onMounted, ref} from "vue";
import * as echarts from 'echarts';
import numeral from "numeral";
import {scaleChange} from "../../../assets/js/api";

export default defineComponent({
  name: "ScaleChange",
  props: { secucode: String },
  setup(props){
    const { secucode } = props

    const refs = ref('')

    const dom = (el)=>{
      refs.value = el
    }

    const drawTurnoverChart = (data) => {
      const ele = refs.value
      const chart = echarts.init(ele)
      const options = {
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
          snap: true
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
              return numeral(value).format('0,00')
            }
          },
          axisPointer: {show: true},
          scale: true
        },
        textStyle: {
          fontFamily: ['Arial', 'kaiti']
        },
        series: [
          {
            name: '规模',
            type: 'line',
            data: data.map(x=>(x.comb_nvi/1e8).toFixed(2)),
            symbol: "circle"
          },
        ]
      }
      chart.setOption(options)
    }

    const getScaleChange = () => {
      scaleChange(secucode).then(r=>{
        drawTurnoverChart(r)
      })
    }

    onMounted(getScaleChange)

    return { dom }
  }

})

</script>

<style scoped>
.scale-change-chart {
  height: 300px;
  width: 100%;
}
</style>
