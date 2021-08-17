<template>
  <div class="top-holding">
    <h4 class="text-left">任职以来持仓前20位</h4>
    <vxe-grid
        class="table"
        border auto-resize stripe highlight-hover-row size="mini"
        :toolbar-config="tableToolbar"
        :export-config="{}"
        :columns="columns"
        :data="tableData"
    ></vxe-grid>
  </div>
</template>

<script>
import {defineComponent, onMounted, ref} from "vue";
import { holdingTop20 } from "../../../assets/js/api";
import numeral from "numeral";


const columns = [
  {
    type: 'seq',
    width: 50,
    align: 'center'
  },
  {
    title: '股票代码',
    field: 'stockcode',
    align: 'center',
  },
  {
    title: '股票简称',
    field: 'stockabbr',
    align: 'left',
    showOverflow: true,
  },
  {
    title: '申万行业',
    field: 'industry',
    align: 'left',
    showOverflow: true,
  },
  {
    title: '最早出现',
    field: 'earliest',
    align: 'center'
  },
  {
    title: '最晚出现',
    field: 'latest',
    align: 'center',
  },
  {
    title: '持有期数',
    field: 'count',
    align: 'center',
    width: 80
  },
  {
    title: '持有期平均市值占净值比',
    field: 'avg_mkt_cap_ratio',
    align: 'right',
    width: 160,
    formatter: (row) => numeral(row.cellValue).format('0.00%'),
  },
  {
    title: '区间收益',
    field: 'period_return',
    align: 'right',
    width: 85,
    formatter: (row) => numeral(row.cellValue).format('0.00%'),
  },
  {
    title: '区间年化',
    field: 'period_annual_return',
    align: 'right',
    width: 85,
    formatter: (row) => numeral(row.cellValue).format('0.00%'),
  },
  {
    title: '同期沪深300收益',
    field: 'period_index_return',
    align: 'right',
    width: 120,
    formatter: (row) => numeral(row.cellValue).format('0.00%'),
  },
  {
    title: '同期行业指数收益',
    field: 'industry_return',
    align: 'right',
    width: 120,
    formatter: (row) => numeral(row.cellValue).format('0.00%'),
  },
  {
    title: '超额收益-沪深300',
    align: 'right',
    width: 140,
    formatter: (row) => numeral(row.row.period_return - row.row.period_index_return).format("0.00%"),
  },
  {
    title: '超额收益-行业指数',
    align: 'right',
    width: 140,
    formatter: (row) => numeral(row.row.period_return - row.row.industry_return).format("0.00%"),
  },
  {
    title: '当前流通市值',
    field: 'negotiable_mv',
    align: 'right',
    width: 120,
    formatter: (row) => numeral(row.cellValue/1e8).format('0,000'),
  },
  {
    title: "PE",
    field: "pe_ttm",
    align: "right",
    formatter: (row) => numeral(row.cellValue).format('0.0'),
  },
  {
    title: "PB",
    field: "pb",
    align: "right",
    formatter: (row) => numeral(row.cellValue).format('0.0'),
  }
]

const tableToolbar = {
  export: true,
  print: true,
  zoom: true,
  custom: true
}

export default defineComponent({
  name: "TopHolding",
  props: {secucode: String},
  setup(props){
    const {secucode} = props

    const tableData = ref([])

    const fetchData = ()=>{
      holdingTop20(secucode).then(r=>{
        tableData.value = r
      })
    }

    onMounted(()=>{
      fetchData()
    })

    return {columns, tableData, tableToolbar}
  }
})
</script>

<style scoped>

.top-holding {
  width: 100%;
  margin-top: 10px;
}

.text-left {
  text-align: left;
  margin-left: 10px;
}

.table {
  margin-top: 10px;
  padding: 0 2px;
}

</style>
