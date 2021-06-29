<template>
  <vxe-grid :data="data" :columns="columns" size="mini" stripe cell-class-name="vxe-table"/>
</template>

<script>
import {defineComponent, onMounted, ref} from "vue";
import api from '../../../request';
import numeral from "numeral";

numeral.nullFormat('-')

function format(value, digit){
  if (digit === 2){
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
      api.get('/fundinfo/performance', {params: {secucode}}).then(r=>{
        data.value = r
      })
    })

    const columns = [
      {
        title: "业绩区间",
        field: "index",
        showOverflow: true,
        width: 80
      },
      {
        title: "绝对收益",
        field: "absolute",
        align: 'right',
        formatter: ({cellValue})=>format(cellValue, 2)
      },
      {
        title: "年化收益",
        field: "annual",
        align: 'right',
        formatter: ({cellValue})=>format(cellValue, 2)
      },
      {
        title: "超额收益",
        field: "beyond",
        align: 'right',
        formatter: ({cellValue})=>format(cellValue, 2)
      },
      {
        title: "年化波动率",
        field: "vol",
        align: 'right',
        formatter: ({cellValue})=>format(cellValue, 2)
      },
      {
        title: "最大回撤",
        field: "drawback",
        align: 'right',
        formatter: ({cellValue})=>format(cellValue, 2)
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