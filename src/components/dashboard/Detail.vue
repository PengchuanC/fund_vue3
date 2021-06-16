<template>
  <vxe-grid
      border
      show-overflow
      highlight-hover-row
      auto-resize
      size="mini"
      :data="state"
      :columns="columns"
      :loading="loading"
      style="min-height: 600px"
  >
  </vxe-grid>
</template>

<script lang="tsx">
import request from "../../request";
import {onMounted, ref, defineComponent} from "vue";
import numeral from "numeral";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "Detail",
  props: {
    params: Object
  },
  setup(props: any){
    const { params } = props

    const state: any = ref([])
    const loading: any = ref(true)
    const router = useRouter()

    onMounted(()=>{
      request.get('/dashboard/detail', {params: params}).then(r=>{
        const { data } = r
        state.value = data
        loading.value = false
      })
    })

    const columns: any[] = [
      {
        type: 'seq',
        width: 50,
        align: 'center'
      },
      {
        field: 'secucode',
        title: '证券代码',
        width: 90,
        slots: {
          default: (table: any) => {
            const {secucode} = table.row
            return <span onClick={() => router.push({name: 'info', params: {secucode}})}>{secucode}</span>
          }
        },
        sortable: true,
        align: 'center'
      },
      {
        field: 'secuabbr',
        title: '证券简称',
        width: 120,
        overflow: true
      },
      {
        field: 'manager',
        title: '基金经理',
        width: 80
      },
      {
        field: 'nvi',
        title: '规模(亿元)',
        width: 100,
        align: 'right',
        formatter: (table: any) => {
          return numeral(table.cellValue).format('0.0')
        },
        sortable: true
      },
      {
        field: 'start',
        title: '任职日期',
        width: 90,
        sortable: true
      },
      {
        field: 'nav_date',
        title: '净值日期',
        width: 80
      },
      {
        field: 'ftd',
        title: '成立至今',
        width: 80,
        align: 'right',
        formatter: (table: any) => {
          return numeral(table.cellValue).format('0.00')
        }
      },
      {
        field: 'manager_yield',
        title: '任职至今',
        width: 80,
        align: 'right',
        formatter: (table: any) => {
          return numeral(table.cellValue).format('0.00')
        },
        visible: true
      },
      {
        field: 'daily',
        title: '单日收益',
        width: 90,
        align: 'right',
        slots: {
          default: (table: any) => {
            const {row} = table
            const {daily} = row
            return (
                <span style={{color: daily > 0 ? 'red' : 'green'}}>{numeral(daily).format('0.00')}</span>
            )
          }
        },
        sortable: true
      },
      {
        field: 'ytd',
        title: 'YTD收益',
        width: 90,
        align: 'right',
        slots: {
          default: (table: any) => {
            const {row} = table
            const {ytd} = row
            return (<span style={{color: ytd > 0 ? 'red' : 'green'}}>{numeral(ytd).format('0.00')}</span>)
          }
        },
        sortable: true
      },
      {
        field: 'year',
        title: '1年收益',
        width: 90,
        align: 'right',
        slots: {
          default: (table: any) => {
            const {row} = table
            const {year} = row
            return (
                <span style={{color: year > 0 ? 'red' : 'green'}}>{numeral(year).format('0.00')}</span>
            )
          }
        },
        sortable: true
      },
      {
        field: 'year3',
        title: '3年收益',
        width: 90,
        align: 'right',
        slots: {
          default: (table: any) => {
            const {row} = table
            const {year3} = row
            return (
                <span style={{color: year3 > 0 ? 'red' : 'green'}}>{numeral(year3).format('0.00')}</span>
            )
          }
        },
        sortable: true
      },
      {
        field: 'year5',
        title: '5年收益',
        width: 90,
        align: 'right',
        slots: {
          default: (table: any) => {
            const {row} = table
            const {year5} = row
            return (
                <span style={{color: year5 > 0 ? 'red' : 'green'}}>{numeral(year5).format('0.00')}</span>
            )
          }
        },
        sortable: true
      },
      {
        field: 'stock',
        title: '股票仓位',
        width: 90,
        align: 'right',
        formatter: (row: any)=> numeral(row.cellValue).format('00.0')
      },
      {
        field: 'scale_nature',
        title: '规模属性',
        width: 100,
        align: 'right',
        sortable: true
      },
      {
        field: 'style_nature',
        title: '风格属性',
        width: 100,
        align: 'right',
        sortable: true
      },
      {
        field: 'classify_industry',
        title: '行业风格',
        width: 100,
        align: 'right',
        sortable: true
      },
      {
        field: 'apply',
        title: '申购状态',
        width: 100,
        align: 'right',
        sortable: true
      },
      {
        field: 'redeem',
        title: '赎回状态',
        width: 100,
        align: 'right',
        sortable: true
      },
      {
        field: 'limit',
        title: '大额限制',
        width: 100,
        align: 'right',
        sortable: true
      }
    ]

    return { state, columns, loading }
  }
})
</script>

<style scoped>

</style>