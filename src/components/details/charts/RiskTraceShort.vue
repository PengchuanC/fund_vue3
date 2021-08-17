<template>
  <div style="width: 100%">
    <div class="chart" :ref="reference" v-if="ok"></div>
    <div v-else>当前基金暂无此类数据</div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import * as echarts from 'echarts';
import numeral from "numeral";
import {shortRisk, longRisk} from "../../../assets/js/api";

numeral.nullFormat('N/A')

export default defineComponent({
  name: "RiskTraceShort",
  props: {secucode: String, url: String},
  setup(props: any) {

    const {secucode, url} = props

    const instance: any = ref(document.body)
    const ok = ref(true)

    const reference: any = (el: HTMLElement) => {
      instance.value = el
    }

    onMounted(() => {
      switch (url) {
        case "short":
          shortRisk(secucode).then(r => draw(r));
          break
        case "long":
          longRisk(secucode).then(r => draw(r))
      }
    })

    const draw = (data: { value: any, legend: any }) => {
      const {value, legend} = data
      const chart = echarts.init(instance.value)
      const options = {
        tooltip: {
          show: true,
          trigger: 'item',
        },
        color: ['#CB2420', '#80A9AE', '#00305C', '#737374', '#DE7C77', '#B1BED0'],
        grid: {
          bottom: 10,
          containLabel: true
        },
        legend: {
          data: Object.keys(value),
          y: 'bottom',
          bottom: -10,
          textStyle: {
            fontFamily: ['Arial', 'kaiti']
          }
        },
        radar: {
          indicator: legend.map((x: string) => {
            return {name: x, max: 1}
          }),
          axisName: {
            textStyle: {
              padding: [-12, -10],
              fontFamily: ['Arial', 'kaiti']
            }
          }
        },
        series: [
          {
            type: 'radar',
            data: Object.keys(value).map((x: string) => {
              return {
                name: x,
                value: value[x].map((x: number) => numeral(x).format('0.00'))
              }
            })
          }
        ]
      }
      chart.setOption(options)
    }

    return {reference, ok}
  }
})

</script>

<style scoped>
.chart {
  width: 100%;
  height: 300px;
}
</style>
