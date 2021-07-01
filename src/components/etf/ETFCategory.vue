<template>
  <div class="etf-category">
    <div class="etf-selections">
      <ElSelect
          class="etf-category-selector"
          size="small"
          v-model="state.category"
          @change="fetch"
      >
        <ElOption v-for="(c, idx) in state.categories" :label="c" :value="c" :key="idx"></ElOption>
      </ElSelect>
      <ElDatePicker
          size="small"
          v-model="state.date"
          @change="fetch"
      />
    </div>
    <div class="etf-category-table">
      <vxe-grid
          ref="etfTable"
          size="mini"
          border
          stripe
          show-overflow
          highlight-hover-row
          height="700"
          auto-resize
          :columns="columns"
          :data="state.data"
          :scroll-x="{enable: true}"
      />
    </div>
  </div>
</template>

<script>
import {defineComponent, nextTick, onMounted, onUnmounted, reactive, ref} from "vue";
import api from '../../request';
import dayjs from "dayjs";
import numeral from "numeral";

numeral.nullFormat('N/A')
numeral.zeroFormat('-')

const columns = [
  {
    type: 'seq',
    title: '#',
    width: 50,
    align: 'center',
    fixed: 'left'
  },
  {
    field: 'secucode',
    title: '基金代码',
    width: 90,
    align: 'center',
    sortable: true,
    fixed: 'left'
  },
  {
    field: 'chinameabbr',
    title: '基金名称',
    minWidth: 140,
    fixed: 'left'
  },
  {
    field: 'launch',
    title: '成立日期',
    minWidth: 85,
  },
  {
    field: 'listed',
    title: '上市日期',
    sortable: true,
    minWidth: 90,
  },
  // {
  //   field: 'category',
  //   title: '分类',
  //   sortable: true
  // },
  {
    field: 'detail',
    title: '详细分类',
    sortable: true,
    width: 110,
    filters: [],

  },
  {
    field: 'indexabbr',
    title: '跟踪指数',
    sortable: true,
    minWidth: 90,
  },
  {
    field: 'trace_error',
    title: '年化跟踪误差(%)',
    align: 'right',
    formatter: ({cellValue}) => numeral(cellValue).format('0.00'),
    sortable: true,
    sortBy: ({row}) => row.trace_error,
    minWidth: 130,
  },
  {
    field: 'date',
    title: '交易日期',
    minWidth: 85,
  },
  {
    field: 'nav',
    title: '单位净值',
    align: 'right',
    width: 80,
    formatter: ({cellValue})=>numeral(cellValue).format('0.0000')
  },
  {
    field: 'nvi',
    title: '总规模(亿元)',
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue).format('0,000.00'),
    sortable: true,
    sortBy: ({row}) => row.nvi,
    minWidth: 110,
  },
  {
    field: 'nv',
    title: '场内规模(亿元)',
    align: 'right',
    width: 120,
    formatter: ({cellValue})=>numeral(cellValue).format('0,000.00'),
    sortable: true,
    sortBy: ({row}) => row.nv,
  },
  {
    field: 'shares',
    title: '场内份额(亿份)',
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue/1e8).format('0,000.00'),
    sortBy: ({row}) => row.shares,
    minWidth: 110,
  },
  {
    field: 'wtd',
    title: 'WTD(%)',
    width: 90,
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue).format('0.00'),
    sortable: true
  },
  {
    field: 'pct',
    title: '场内WTD(%)',
    align: 'right',
    width: 120,
    formatter: ({cellValue})=>numeral(cellValue).format('0.00'),
    sortable: true
  },
  {
    field: 'ytd',
    title: 'YTD(%)',
    width: 85,
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue).format('0.00'),
    sortable: true
  },
  {
    field: 'day_change',
    title: '日份额变动(万份)',
    width: 140,
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue*1e4).format('0,000.00'),
    sortBy: ({row}) => row.day_change,
    sortable: true
  },
  {
    field: 'day_capital',
    title: '日净流入(万元)',
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue*1e4).format('0,000.00'),
    sortable: true,
    sortBy: ({row}) => row.day_capital,
    minWidth: 120,
  },
  {
    field: 'wtd_change',
    title: '周份额变动(万份)',
    width: 140,
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue*1e4).format('0,000.00'),
    sortBy: ({row}) => row.wtd_change,
    sortable: true
  },
  {
    field: 'wtd_capital',
    title: '周净流入(万元)',
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue*1e4).format('0,000.00'),
    sortable: true,
    sortBy: ({row}) => row.wtd_capital,
    minWidth: 120,
  },
  {
    field: 'mtd_change',
    title: '月份额变动(万份)',
    width: 140,
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue*1e4).format('0,000.00'),
    sortBy: ({row}) => row.mtd_change,
    sortable: true
  },
  {
    field: 'mtd_capital',
    title: '月净流入(万元)',
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue*1e4).format('0,000.00'),
    sortable: true,
    sortBy: ({row}) => row.mtd_capital,
    minWidth: 120,
  },
  {
    field: 'ytd_change',
    title: '年份额变动(万份)',
    width: 140,
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue*1e4).format('0,000.00'),
    sortBy: ({row}) => row.ytd_change,
    sortable: true
  },
  {
    field: 'ytd_capital',
    title: '年净流入(万元)',
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue*1e4).format('0,000.00'),
    sortable: true,
    sortBy: ({row}) => row.ytd_capital,
    minWidth: 120,
  }
]

export default defineComponent({
  name: "ETFCategory",
  setup() {
    const state = reactive({
      category: '宽基',
      categories: [],
      date: '',
      data: []
    })

    const etfTable = ref(null)

    const selections = () => {
      api.get('/etf/category').then(r => {
        const {category, last} = r
        category.push('重点关注')
        state.categories = category
        state.date = last
      })
    }

    const fetch = () => {
      const date = dayjs(state.date || new Date()).format('YYYY-MM-DD')
      const {category} = state
      api.get('/etf/wtd', {params: {category, date}}).then(r => {
        state.data = r
        const filterItemSets = new Set()
        r.forEach(x=>{filterItemSets.add(x.detail)})
        const filterItems = Array.from(filterItemSets).map(x=>{return {label: x, value: x}})
        etfTable.value.setFilter('detail', filterItems)
      })
    }

    onMounted(() => {
      selections()
      fetch()
    })

    return {state, columns, fetch, etfTable}
  }
})
</script>

<style scoped>
.etf-category {
  text-align: left;
}

.etf-category-selector {
  margin-right: 20px;
}

.etf-category-table {
  width: 100%;
  margin-top: 20px;
  max-height: 10000px;
}
</style>