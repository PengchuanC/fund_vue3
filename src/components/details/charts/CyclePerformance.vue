<template>
  <div>
    <h4 class="desc-title">收益特征</h4>
    <div :ref="dom" class="chart-style" v-if="ok"></div>
    <div v-else>当前基金暂无此类数据</div>
  </div>
</template>

<script>
import {defineComponent, onMounted, ref} from "vue";
import * as echarts from "echarts";
import {cycle} from "../../../assets/js/api";

export default defineComponent({
  name: "CyclePerformance",
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
      cycle(secucode).then(resp=>{
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
          show: true,
          trigger: 'item',
          snap: true,
          formatter: function (param){
            return `<b>${param.name}: </b>`+ param.data.toFixed(2)+'%'
          }
        },
        grid: {
          bottom: '160'
        },
        textStyle: {
          fontFamily: ['arial', 'kaiti'],
        },
        color: ['#CB2420', '#80A9AE', '#00305C', '#737374', '#DE7C77', '#B1BED0'],
        xAxis: {
          type: 'category',
          data: data.map(x=>x.date),
          axisLabel: {
            rotate: 90
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: "{value}%"
          }
        },
        series: [{
          data: data.map(x=>x.value*100),
          type: 'bar'
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
  height: 400px;
}
</style>
