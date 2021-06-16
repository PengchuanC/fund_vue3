<template>
  <div class="concentrate">
    <div class="chart" :ref="reference" v-if="show"></div>
    <div v-else>此基金没有该配置项</div>
  </div>
</template>

<script lang="ts">
import {onMounted, ref} from "vue";
import * as echarts from 'echarts';
import numeral from "numeral";

export default {
  name: "Concentrate",
  props: {data: Array},
  setup(props: any) {
    const {data}: any = props
    const instance = ref(document.getElementById(''))
    const show = ref(true)

    const reference = (el) => {
      instance.value = el
    }

    const draw = (data) => {
      const el: any = instance.value
      const myChart = echarts.init(el);
      const options = {
        tooltip : {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.map(x=>x.date)
        },
        yAxis: {
          type: 'value',
          max: 100
        },
        series: [
          {
            name: '股票集中度',
            type: 'line',
            label: {
              show: false
            },
            emphasis: {
              focus: 'series'
            },
            data: data.map(x=>numeral(x.ratio*100).format('0.00'))
          }]
      }
      myChart.setOption(options)
    }

    onMounted(() => {
      show.value = Object.keys(data).length !== 0
      if (show.value) {
        draw(data)
      }
    })

    return {reference, show}
  }
}
</script>

<style scoped>
.concentrate {
  width: 100%;
}

.chart {
  width: 100%;
  height: 300px;
}
</style>