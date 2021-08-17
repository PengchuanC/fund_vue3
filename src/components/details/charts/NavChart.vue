<template>
  <div>
    <div class="selection-area">
      <ElSelect size="mini" v-model="state.styleSelected" placeholder="选择基金风格指数" class="selection" @change="onChange">
        <ElOption
            v-for="row in state.styleOptions" :key="row['secucode']" :label="row['chiname']" :value="row['secucode']">
        </ElOption>
      </ElSelect>
      <ElSelect size="mini" v-model="state.benchmarkSelected" placeholder="选择宽基指数" class="selection" @change="onChange">
        <ElOption v-for="row in state.benchmarkOptions"
                  :key="row['secucode']" :label="row['chiname']" :value="row['secucode']"></ElOption>
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
import * as echarts from 'echarts';
import {styleAndBenchmarkIndices, netValueSeries, yearlyPerformance, recentPerformance} from "../../../assets/js/api";


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
      styleAndBenchmarkIndices().then(r=>{
        state.styleOptions = r.style
        state.benchmarkOptions = r.benchmark
      })
    }

    const fetchAndShowChart = () => {
      netValueSeries(secucode, state.styleSelected, state.benchmarkSelected).then(r=>{
        const {names, data} = r
        drawPerformance(names, data)
      })
      recentPerformance(secucode, state.styleSelected, state.benchmarkSelected).then(r=>{
        state.tablePerformance = r
      })
      yearlyPerformance(secucode, state.styleSelected, state.benchmarkSelected).then(r=>{
        const {table, chart} = r
        state.tableYearly = table
        drawYearly(chart)
      })
    }

    const drawPerformance = (names, data) => {
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
          data: names,
          bottom: "5%"
        },
        xAxis: [
          {
            type: 'category',
            data: data.map(x=>x.date),
            axisPointer: {show: true}
          }
        ],
        yAxis: {
          axisLabel: {
            formatter: (value) => {
              return `${value.toFixed(1)}`
            }
          },
          axisPointer: {show: true},
        },
        textStyle: {
          fontFamily: ['Arial', 'kaiti']
        },
        series: [
          {
            name: names[0],
            type: 'line',
            data: data.map(x => {
              return (x['fund']).toFixed(2)
            }),
            symbol: "circle"
          },
          {
            name: names[1],
            type: 'line',
            data: data.map(x => {
              return (x['style']).toFixed(2)
            }),
            symbol: "circle"
          },
          {
            name: names[2],
            type: 'line',
            data: data.map(x => {
              return (x['benchmark']).toFixed(2)
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
            type: 'item',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: data.names,
          bottom: "5%"
        },
        xAxis: [
          {
            type: 'category',
            data: data.year,
            axisPointer: {show: true}
          }
        ],
        yAxis: {
          axisLabel: {
            formatter: (value) => {
              return `${value.toFixed(1)}`
            }
          },
          axisPointer: {show: true},
        },
        textStyle: {
          fontFamily: ['Arial', 'kaiti']
        },
        series: [
          {
            type: 'bar',
            name: data.names[0],
            data: data['fund']
          },
          {
            type: 'bar',
            name: data.names[1],
            data: data['style']
          },
          {
            type: 'bar',
            name: data.names[2],
            data: data['benchmark']
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
        align: 'center',
      },
      {
        title: `${getFullYear() - 4}(%)`,
        field: `${getFullYear() - 4}`,
        align: 'center',
      },
      {
        title: `${getFullYear() - 3}(%)`,
        field: `${getFullYear() - 3}`,
        align: 'center',
      },
      {
        title: `${getFullYear() - 2}(%)`,
        field: `${getFullYear() - 2}`,
        align: 'center',
      },
      {
        title: `${getFullYear() - 1}(%)`,
        field: `${getFullYear() - 1}`,
        align: 'center',
      },
      {
        title: "YTD(%)",
        field: `${getFullYear()}`,
        align: 'center',
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
