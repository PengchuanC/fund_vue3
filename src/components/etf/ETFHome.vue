<template>
  <div class="etf-home">
    <div class="date-picker">
      <ElDatePicker
          size="small"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :shortcuts="state.shortcuts"
          v-model="state.selected"
          @change="fetch"
      />
      <ElRadioGroup v-model="state.freq" @change="fetch" class="freq-selector">
        <ElRadio :label="1">日频</ElRadio>
        <ElRadio :label="2">周频</ElRadio>
        <ElRadio :label="3">月频</ElRadio>
      </ElRadioGroup>
    </div>
    <ElRow>
      <ElCol :span="12">
        <vxe-grid
            border
            size="mini"
            stripe
            show-overflow
            highlight-hover-row
            show-footer
            :footer-method="footer"
            :columns="state.columns"
            :data="state.data"
        ></vxe-grid>
      </ElCol>
      <ElCol :span="12">
        <div id="etf-bar-chart"></div>
        <div id="etf-line-chart"></div>
      </ElCol>
    </ElRow>
  </div>
</template>

<script>
import {defineComponent, onMounted, reactive} from "vue";
import dayjs from "dayjs";
import api from '../../request';
import numeral from "numeral";
import * as echarts from 'echarts';

const shortcuts = [
  {
    text: '最近一周',
    value: (() => {
      const end = dayjs().subtract(1, 'day')
      const start = end.subtract(6, 'day')
      return [start, end]
    })(),
  },
  {
    text: '最近一个月',
    value: (() => {
      const end = dayjs().subtract(1, 'day')
      const start = end.subtract(1, 'month').add(1, 'day')
      return [start, end]
    })(),
  },
  {
    text: '最近三个月',
    value: (() => {
      const end = dayjs().subtract(1, 'day')
      const start = end.subtract(3, 'month').add(1, 'day')
      return [start, end]
    })(),
  }
]

const columns = [
  {
    field: 'date',
    title: '日期',
    sortable: true
  },
  {
    field: '宽基',
    title: '宽基',
    formatter: ({cellValue})=> numeral(cellValue).format('0.00'),
    sortable: true,
    align: 'right'
  },
  {
    field: '行业主题',
    title: '行业主题',
    formatter: ({cellValue})=> numeral(cellValue).format('0.00'),
    sortable: true,
    align: 'right'
  },
  {
    field: '风格',
    title: '风格',
    formatter: ({cellValue})=> numeral(cellValue).format('0.00'),
    sortable: true,
    align: 'right'
  },
  {
    title: '跨境',
    field: '跨境',
    formatter: ({cellValue})=> numeral(cellValue).format('0.00'),
    sortable: true,
    align: 'right'
  },
  {
    field: '货币',
    title: '货币',
    formatter: ({cellValue})=> numeral(cellValue).format('0.00'),
    sortable: true,
    align: 'right'
  },
  {
    field: '债券',
    title: '债券',
    formatter: ({cellValue})=> numeral(cellValue).format('0.00'),
    sortable: true,
    align: 'right'
  },
  {
    field: '另类',
    title: '另类',
    formatter: ({cellValue})=> numeral(cellValue).format('0.00'),
    sortable: true,
    align: 'right'
  },
  {
    field: '合计',
    title: '合计',
    formatter: ({cellValue})=> numeral(cellValue).format('0.00'),
    sortable: true,
    align: 'right'
  }
]

const drawBar = (data)=>{
  const chart = echarts.init(document.getElementById('etf-bar-chart'))
  const options = {
    color: ['#CB2420', '#80A9AE', '#00305C', '#737374', '#DE7C77', '#B1BED0'],
    tooltip: {
      trigger: 'item',
    },
    grid: {
      show: false,
      top: 10,
      left: "10%",
      right: "5%",
      bottom: '10%'
    },
    xAxis: {
      type: 'category',
      data: Object.keys(data)
    },
    yAxis: {
      type: 'value',
    },
    series: [{
      data: Object.keys(data).map(x=>numeral(data[x]).format('0.00')),
      type: 'bar',
      label: {
        show: true,
        position: 'top'
      }
    }]
  }
  chart.setOption(options)
  window.onresize = ()=>{chart.resize()}
}

const drawLine = (data)=>{
  const chart = echarts.init(document.getElementById('etf-line-chart'))
  const options = {
    color: ['#CB2420', '#80A9AE', '#00305C', '#737374', '#DE7C77', '#B1BED0'],
    tooltip: {
      trigger: 'item',
    },
    grid: {
      show: false,
      top: 30,
      left: "10%",
      right: "5%",
      bottom: '10%'
    },
    legend: {
      data: ['宽基', '行业主题', '中证全指']
    },
    xAxis: {
      type: 'category',
      data: data.map(x=>x.date),
      axisPointer: {
        type: 'shadow'
      }
    },
    yAxis: [
      {
        type: 'value',
        name: 'ETF净流入'
      },
      {
        type: 'value',
        name: '收盘价',
        scale: true
      }
    ],
    series: [
      {
        name: '宽基',
        type: 'bar',
        data: data.map(x=>x['宽基']),
        stack: 'capital'
      },
      {
        name: '行业主题',
        type: 'bar',
        data: data.map(x=>x['行业主题']),
        stack: 'capital'
      },
      {
        name: '中证全指',
        type: 'line',
        data: data.map(x=>x['closeprice']),
        yAxisIndex: 1
      }
    ]
  }
  chart.setOption(options)
  window.onresize = ()=>{chart.resize()}
}

export default defineComponent({
  name: "ETFHome",
  setup() {
    const state = reactive({
      last: dayjs(),
      shortcuts: shortcuts,
      selected: [null, null],
      columns: columns,
      data: [],
      freq: 1
    })

    const getLatestDate = () => {
      api.get('/etf/category').then(r => {
        const {last} = r
        state.last = dayjs(last)
        state.selected = [dayjs(last).subtract(3, 'week'), dayjs(last)]
        fetch()
      })
    }

    const fetch = () => {
      let [start, end] = state.selected
      start = dayjs(start).format('YYYY-MM-DD')
      end = dayjs(end).format('YYYY-MM-DD')
      const { freq } = state
      api.get('/etf/outlook', {params: {start, end, freq}}).then(r => {
        const {data, total} = r
        state.data = data
        drawBar(total)
      })
    }

    const weekly = () => {
      api.get('/etf/weekly').then(r=>{
        drawLine(r)
      })
    }

    const footer = ({columns, data})=>{
      const sum = (list, field)=>{
        let count = 0
        list.forEach(item => {
          count += Number(item[field])
        })
        return numeral(count).format('0.00')
      }

      return [columns.map((column, columnIndex)=>{
        if (columnIndex === 0){return '汇总'}
        return sum(data, column.property)
      })]
    }

    onMounted(()=>{
      getLatestDate()
      weekly()
    })

    return {state, fetch, footer}
  }
})
</script>

<style scoped>

.etf-home {
  text-align: left;
}

.date-picker {
  margin-bottom: 20px;
}

.freq-selector {
  margin-left: 20px;
}

#etf-bar-chart {
  width: 100%;
  height: 300px;
}

#etf-line-chart {
  width: 100%;
  height: 300px;
  margin-top: 30px;
}
</style>