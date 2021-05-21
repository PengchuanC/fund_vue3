<template>
  <div class="chart" :ref="reference"></div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import request from "../../../request";
import * as echarts from 'echarts';
import numeral from "numeral";

numeral.nullFormat('N/A')

export default defineComponent({
  name: "RiskTraceShort",
  props: { secucode: String, url: String },
  setup(props: any){

    const { secucode, url } = props

    const instance: any = ref(document.body)

    const reference: any = (el: HTMLElement)=>{
      instance.value = el
    }

    onMounted(()=>{
      request.get(url, {params: {secucode: secucode}}).then((r: any)=>{
        draw(r)
      })
    })

    const draw = (data: { value: any, legend: any}) => {
      const { value, legend} = data
      const chart = echarts.init(instance.value)
      const options = {
        tooltip: {
          show: true,
          trigger: 'item',
        },
        legend: {
          data: Object.keys(value),
          y: 'bottom'
        },
        radar: {
          indicator: legend.map((x: string)=>{
            return {name: x, max: 1}
          })
        },
        series: [
          {
            type: 'radar',
            data: Object.keys(value).map((x: string)=>{
              return {
                name: x,
                value: value[x].map((x: number)=> numeral(x).format('0.00'))
              }
            })
          }
        ]
      }
      chart.setOption(options)
    }

    return { reference }
  }
})

</script>

<style scoped>
.chart{
  width: 100%;
  height: 300px;
}
</style>