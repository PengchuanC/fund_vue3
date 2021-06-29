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
          size="mini"
          border
          stripe
          show-overflow
          highlight-hover-row
          height="700"
          auto-resize
          :columns="columns"
          :data="state.data"
      />
    </div>
  </div>
</template>

<script>
import {defineComponent, onMounted, onUnmounted, reactive} from "vue";
import api from '../../request';
import dayjs from "dayjs";
import numeral from "numeral";

const columns = [
  {
    type: 'seq',
    title: '#',
    width: 50,
    align: 'center'
  },
  {
    field: 'secucode',
    title: '基金代码',
    width: 90,
    align: 'center',
    sortable: true
  },
  {
    field: 'chinameabbr',
    title: '基金名称',
    minWidth: 80
  },
  {
    field: 'launch',
    title: '成立日期'
  },
  {
    field: 'listed',
    title: '上市日期',
    sortable: true
  },
  // {
  //   field: 'category',
  //   title: '分类',
  //   sortable: true
  // },
  {
    field: 'detail',
    title: '详细分类',
    sortable: true
  },
  {
    field: 'indexabbr',
    title: '跟踪指数',
    sortable: true
  },
  {
    field: 'date',
    title: '交易日期'
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
    formatter: ({cellValue})=>numeral(cellValue).format(',000.00'),
    sortable: true
  },
  {
    field: 'nvi',
    title: '场内规模(亿元)',
    align: 'right',
    width: 120,
    formatter: ({cellValue})=>numeral(cellValue).format(',000.00'),
    sortable: true
  },
  {
    field: 'shares',
    title: '场内份额(亿份)',
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue/1e8).format(',000.00')
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
    field: 'change',
    title: '份额变动(万份)',
    width: 120,
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue*1e4).format(',000.00'),
    sortable: true
  },
  {
    field: 'capital',
    title: '净流入(万元)',
    align: 'right',
    formatter: ({cellValue})=>numeral(cellValue*1e4).format(',000.00'),
    sortable: true
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
      })
    }

    onMounted(() => {
      selections()
      fetch()
    })

    return {state, columns, fetch}
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
  margin-top: 20px;
  max-height: 10000px;
}
</style>