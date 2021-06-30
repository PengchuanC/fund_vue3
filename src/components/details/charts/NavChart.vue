<template>
  <div>
    <div class="selection-area">
      <ElSelect size="mini" v-model="state.styleSelected" placeholder="选择基金风格指数" class="selection" @change="onChange">
        <ElOption v-for="row in state.styleOptions" :key="row[0]" :label="row[1]" :value="row[0]"></ElOption>
      </ElSelect>
      <ElSelect size="mini" v-model="state.benchmarkSelected" placeholder="选择宽基指数" class="selection" @change="onChange">
        <ElOption v-for="row in state.benchmarkOptions" :key="row[0]" :label="row[1]" :value="row[0]"></ElOption>
      </ElSelect>
    </div>
    <div class="chart-performance" :ref="performance"></div>
    <vxe-grid :data="state.tablePerformance" :columns="columns" size="mini" stripe cell-class-name="vxe-table"/>
    <div class="chart-performance" :ref="yearly"></div>
    <vxe-grid :data="state.tableYearly" :columns="columns2" size="mini" stripe/>
  </div>
</template>

<script>
import {defineComponent, onMounted, reactive} from "vue";
import request from "../../../request";
import * as echarts from 'echarts';


const columns = [
  {
    title: "名称",
    field: "name",
    showOverflow: true,
    width: 150
  },
  {
    title: "YTD(%)",
    field: "ytd",
    align: 'center'
  },
  {
    title: "近3月(%)",
    field: "m3",
    align: 'center'
  },
  {
    title: "近6月(%)",
    field: "m6",
    align: 'center'
  },
  {
    title: "近1年(%)",
    field: "y1",
    align: 'center'
  },
  {
    title: "近3年(%)",
    field: "y3",
    align: 'center'
  },
  {
    title: "近5年(%)",
    field: "y5",
    align: 'center'
  }
]

export default defineComponent({
  name: "NavChart",
  props: {secucode: String},
  setup(props) {
    const {secucode} = props
    const state = reactive({
      styleSelected: null,
      styleOptions: [],
      benchmarkSelected: null,
      benchmarkOptions: [],
      tablePerformance: [],
      tableYearly: []
    })

    const chartDom = reactive({
      performance: null,
      yearly: null
    })

    const performance = (el) => {
      chartDom.performance = el
    }

    const yearly = (el) => {
      chartDom.yearly = el
    }

    const fetchSelections = () => {
      request.get('/fundinfo/style&benchmark').then(r => {
        const {style, benchmark} = r
        state.styleOptions = style
        state.benchmarkOptions = benchmark
      })
    }

    const fetchAndShowChart = () => {
      request.post('/fundinfo/plotperformance/v2', {
        data: {
          secucode: secucode, style: state.styleSelected, benchmark: state.benchmarkSelected
        }
      }).then(r => {
        state.tablePerformance = r.performance;
        state.tableYearly = r.yearly
        drawPerformance(r)
        drawYearly(r)
      })
    }

    const drawPerformance = (data) => {
      const myChart = echarts.init(chartDom.performance);
      const option = {
        color: ['#CB2420', '#80A9AE', '#00305C', '#737374', '#DE7C77', '#B1BED0'],
        grid: {
          show: false,
          top: 30,
          left: "10%",
          right: "5%",
          bottom: '20%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: [data.fund, data.style, data.benchmark],
          bottom: "5%"
        },
        xAxis: [
          {
            type: 'category',
            data: data.data.date,
            axisPointer: {show: true}
          }
        ],
        yAxis: {
          axisLabel: {
            formatter: (value) => {
              return `${value}%`
            }
          },
          axisPointer: {show: true},
        },
        textStyle: {
          fontFamily: ['kaiti', 'Arial']
        },
        series: [
          {
            name: data.fund,
            type: 'line',
            data: data.data.fund.map((x) => {
              return (x * 100).toFixed(2)
            }),
            symbol: "circle"
          },
          {
            name: data.style,
            type: 'line',
            data: data.data.style.map((x) => {
              return (x * 100).toFixed(2)
            }),
            symbol: "circle"
          },
          {
            name: data.benchmark,
            type: 'line',
            data: data.data.benchmark.map((x) => {
              return (x * 100).toFixed(2)
            }),
            symbol: "circle"
          },
        ]
      };
      myChart.setOption(option)
    }

    const drawYearly = (data) => {
      const myChart = echarts.init(chartDom.yearly);
      const option = {
        color: ['#CB2420', '#80A9AE', '#00305C', '#737374', '#DE7C77', '#B1BED0'],
        grid: {
          show: false,
          top: 30,
          left: "10%",
          right: "5%",
          bottom: '20%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: [data.fund, data.benchmark, data.style],
          bottom: "5%"
        },
        xAxis: [
          {
            type: 'category',
            data: data.yearly_chart.map(x => x.year),
            axisPointer: {show: true}
          }
        ],
        yAxis: {
          axisPointer: {show: true}
        },
        textStyle: {
          fontFamily: ['kaiti', 'Arial']
        },
        series: [
          {
            type: 'bar',
            name: data.fund,
            data: data.yearly_chart.map(x => x[data.fund])
          },
          {
            type: 'bar',
            name: data.benchmark,
            data: data.yearly_chart.map(x => x[data.benchmark])
          },
          {
            type: 'bar',
            name: data.style,
            data: data.yearly_chart.map(x => x[data.style])
          }
        ]
      };
      myChart.setOption(option);
    }

    const onChange = () => {
      fetchAndShowChart()
    }

    onMounted(() => {
      fetchSelections()
      fetchAndShowChart()
    })

    const getFullYear = () => {
      const date = new Date();
      return date.getFullYear();
    }

    const columns2 = [
      {
        title: "名称",
        field: "name",
        showOverflow: true,
        minWidth: 120
      },
      {
        title: `${getFullYear() - 5}(%)`,
        field: `${getFullYear() - 5}`,
        align: 'center'
      },
      {
        title: `${getFullYear() - 4}(%)`,
        field: `${getFullYear() - 4}`,
        align: 'center'
      },
      {
        title: `${getFullYear() - 3}(%)`,
        field: `${getFullYear() - 3}`,
        align: 'center'
      },
      {
        title: `${getFullYear() - 2}(%)`,
        field: `${getFullYear() - 2}`,
        align: 'center'
      },
      {
        title: `${getFullYear() - 1}(%)`,
        field: `${getFullYear() - 1}`,
        align: 'center'
      },
      {
        title: "YTD(%)",
        field: "ytd",
        align: 'center'
      }
    ]

    return {state, performance, yearly, columns, columns2, onChange}
  }
})

</script>

<style scoped>
.selection-area {
  width: 100%;
  text-align: left;
  margin-bottom: 10px;
}

.selection {
  width: 50%;
}

.chart-performance {
  width: 100%;
  height: 300px;
}

.vxe-table {
  font-family: Arial, "Times New Roman", kaiti, sans-serif;
}

</style>