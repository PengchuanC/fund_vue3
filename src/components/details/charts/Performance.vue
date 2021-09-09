<template>
  <vxe-grid :data="data" :columns="columns" size="mini" stripe cell-class-name="vxe-table"/>
</template>

<script>
import {defineComponent, onMounted, ref} from "vue";
import numeral from "numeral";
import {riskPerformance} from "../../../assets/js/api";

numeral.nullFormat('N/A')
numeral.zeroFormat('-')

function format(value, digit, pct=false){
  if (digit === 2 && pct){
    return numeral(value).format('0.00%')
  } else if (digit === 2 && !pct) {
    return numeral(value).format('0.00')
  }
  return numeral(value).format('0.0000')
}

export default defineComponent({
  name: "Performance",
  props: {secucode: String},
  setup(props){
    const { secucode } = props
    const data = ref([])

    onMounted(()=>{
      riskPerformance(secucode).then(r=>{
        data.value = Object.keys(r).map(x=>r[x])
      })
    })

    const columns = [
      {
        title: "业绩区间",
        field: "period",
        showOverflow: true,
        width: 80
      },
      {
        title: "绝对收益",
        field: "absolute",
        align: 'right',
        formatter: ({cellValue})=>format(cellValue, 2, true)
      },
      {
        title: "年化收益",
        field: "annual",
        align: 'right',
        formatter: ({cellValue})=>format(cellValue, 2, true)
      },
      {
        title: "超额收益",
        field: "abnormal",
        align: 'right',
        formatter: ({cellValue})=>format(cellValue, 2, true)
      },
      {
        title: "年化波动率",
        field: "vol",
        align: 'right',
        formatter: ({cellValue})=>format(cellValue * Math.pow(250, 0.5), 2, true)
      },
      {
        title: "最大回撤",
        field: "drawback",
        align: 'right',
        formatter: ({cellValue})=>format(cellValue, 2, true)
      },
      {
        title: "Sharpe",
        field: "sharpe",
        align: 'right',
        formatter: ({cellValue})=>format(cellValue, 2)
      },
      {
        title: "Calmar",
        field: "calmar",
        align: 'right',
        formatter: ({cellValue})=>format(cellValue, 2)
      },{
        title: "择时能力",
        field: "timing",
        align: 'right',
        formatter: ({cellValue})=>format(cellValue, 2)
      },{
        title: "选股能力",
        field: "selection",
        align: 'right',
        formatter: ({cellValue})=>format(cellValue, 4)
      },
    ]

    return { data, columns }
  }
})
</script>

<style scoped>

</style>
