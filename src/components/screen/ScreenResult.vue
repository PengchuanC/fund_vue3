<template>
  <vxe-grid
      border
      show-overflow
      highlight-hover-row
      size="mini" stripe highlight-hover-column
      auto-resize
      class="table"
      :height="windowHeight"
      :columns="columns"
      :column-config="{minWidth: 70}"
      :data="data"
      :toolbar-config="tableToolbar"
      :print-config="{}"
      :import-config="{}"
      :export-config="{}"
  >
  </vxe-grid>

</template>

<script>
import {defineComponent, onMounted, ref} from "vue"
import numeral from "numeral";

const tableToolbar = {
  import: true,
  export: true,
  print: true,
  zoom: true,
  custom: true
}

const columns = [
  {
    type: 'seq',
    width: 60,
    align: 'center',
    fixed: 'left'
  },
  {
    field: 'secucode',
    title: '基金代码',
    width: 90,
    sortable: true,
    fixed: 'left'
  },
  {
    field: 'secuabbr',
    title: '基金简称',
    width: 120,
    overflow: true
  },
  {
    field: 'name',
    title: '基金经理',
    width: 90,
    overflow: true,
    sortable: true
  },
  {
    field: 'quarterly_nv',
    title: '规模(亿元)',
    width: 95,
    align: 'right',
    overflow: true,
    sortable: true,
    formatter: ({cellValue})=>numeral(cellValue).format('0,00.0')
  },
  {
    field: 'quarterly_sum',
    title: '合并规模',
    width: 90,
    align: 'right',
    overflow: true,
    sortable: true,
    formatter: ({cellValue})=>numeral(cellValue).format('0,000.0')
  },
  {
    field: 'launch_date',
    title: '成立日',
    width: 90,
    overflow: true,
    align: 'center'
  },
  {
    field: 'value_date',
    title: '净值日',
    width: 90,
    align: 'center'
  },
  {
    field: 'experience',
    title: '从业年限',
    width: 70,
    align: 'center'
  },
  {
    field: 'managementtime',
    title: '任职天数',
    width: 80,
    align: 'right',
    overflow: true,
    formatter: ({cellValue})=>numeral(cellValue).format('0,000')
  },
  {
    field: 'year1',
    title: '1年回报',
    width: 85,
    align: 'right',
    sortable: true,
    formatter: ({cellValue})=>numeral(cellValue).format('0.00')
  },
  {
    field: 'year2',
    title: '2年回报',
    width: 85,
    align: 'right',
    sortable: true,
    formatter: ({cellValue})=>numeral(cellValue).format('0.00')
  },
  {
    field: 'year3',
    title: '3年回报',
    width: 85,
    align: 'right',
    sortable: true,
    formatter: ({cellValue})=>numeral(cellValue).format('0.00')
  },
  {
    field: 'drawback1',
    title: '最大回撤1',
    width: 80,
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue).format('0.00%')
  },
  {
    field: 'drawback2',
    title: '最大回撤2',
    width: 80,
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue).format('0.00%')
  },
  {
    field: 'drawback3',
    title: '最大回撤3',
    width: 80,
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue).format('0.00%')
  },
  {
    field: 'vol1',
    title: '年化波动1',
    width: 80,
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue).format('0.00%')
  },
  {
    field: 'vol2',
    title: '年化波动2',
    width: 80,
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue).format('0.00%')
  },
  {
    field: 'vol3',
    title: '年化波动3',
    width: 80,
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue).format('0.00%')
  },
  {
    field: 'benchmark1',
    title: '基准1',
    width: 80,
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue).format('0.00')
  },
  {
    field: 'benchmark2',
    title: '基准2',
    width: 80,
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue).format('0.00')
  },
  {
    field: 'benchmark3',
    title: '基准3',
    width: 80,
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue).format('0.00')
  },
  {
    field: 'index_code',
    title: '指数代码',
    width: 80,
    align: 'center'
  },
  {
    field: 'index_ret',
    title: '指数回报',
    width: 80,
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue).format('0.00')
  },
  {
    field: 'share_holding',
    title: '单一持有',
    width: 80,
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue).format('0.00')
  },
  {
    field: 'annual_performance',
    title: '任职年化',
    width: 80,
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue).format('0.00')
  },
  {
    field: 'ret',
    title: '从业年化',
    width: 80,
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue).format('0.00')
  }
]

export default defineComponent({
  name: "ScreenResult",
  props: {data: Array},
  setup(props){
    const windowHeight = ref(800)

    const { data } = props

    onMounted(()=>{
      windowHeight.value = window.innerHeight - 100
    })

    return { data, tableToolbar, columns, windowHeight }
  }
})

</script>

<style scoped>

</style>