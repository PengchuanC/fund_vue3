<template>
  <div>
    <div :ref="dom" class="chart-style" v-if="showChart"></div>
    <div v-else>基金类型不适用</div>
  </div>
</template>

<script>
import {onMounted, ref} from "vue";
import * as echarts from 'echarts';
import {rbsaStyle} from "../../../assets/js/api";

export default {
  name: "Style",
  props: { secucode: String},
  setup(props){

    const { secucode } = props

    const refs = ref('')
    const showChart = ref(true)

    const dom = (el)=>{
      refs.value = el
    }

    const fetchData = () => {
      rbsaStyle(secucode).then(r=>{
        if (r.length === 0){
          showChart.value = false
          return
        }
        const ret = {date: [], sv: [], sg: [], mv: [], mg: [], lv: [], lg: [], bd: []};
        for (const i in r) {
          if (!r.hasOwnProperty(i)){
            continue
          }
          const row = r[i];
          ret.date.push(row["date"]);
          ret.sv.push((row["small_value"] * 100).toFixed(2));
          ret.sg.push((row["small_growth"] * 100).toFixed(2));
          ret.mv.push((row["mid_value"] * 100).toFixed(2));
          ret.mg.push((row["mid_growth"] * 100).toFixed(2));
          ret.lv.push((row["large_value"] * 100).toFixed(2));
          ret.lg.push((row["large_growth"] * 100).toFixed(2));
          ret.bd.push((row["bond"] * 100).toFixed(2));
        }
        show(ret)
      })
    }

    const show = (data) => {
      const myChart = echarts.init(refs.value);
      const option = {
        // backgroundColor: 'rgba(128, 128, 128, 0.1)',
        grid: {
          show: false,
          top: 40,
          left: "5%",
          right: "5%",
          bottom: '10%'
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
        color: ['#7BD9A5', '#F2B3C9', '#22c3AA', '#F58DB2', '#4EA397', '#D0648A', '#e5cf0d'],
        legend: {
          data: ['小盘价值', '小盘成长', '中盘价值', '中盘成长', '大盘价值', '大盘成长', '中证全债']
        },
        textStyle: {
          fontFamily: ['Arial', 'kaiti']
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: data.date
          }
        ],
        yAxis: [
          {
            type: 'value',
            max: 100
          }
        ],
        series: [
          {
            name: '小盘价值',
            type: 'line',
            stack: '占比',
            areaStyle: {},
            data: data.sv,
            symbol: "circle"
          },
          {
            name: '小盘成长',
            type: 'line',
            stack: '占比',
            areaStyle: {},
            data: data.sg,
            symbol: "circle"
          },
          {
            name: '中盘价值',
            type: 'line',
            stack: '占比',
            areaStyle: {},
            data: data.mv,
            symbol: "circle"
          },
          {
            name: '中盘成长',
            type: 'line',
            stack: '占比',
            areaStyle: {},
            data: data.mg,
            symbol: "circle"
          },
          {
            name: '大盘价值',
            type: 'line',
            stack: '占比',
            areaStyle: {},
            data: data.lv,
            symbol: "circle"
          },
          {
            name: '大盘成长',
            type: 'line',
            stack: '占比',
            areaStyle: {},
            data: data.lg,
            symbol: "circle"
          },
          {
            name: '中证全债',
            type: 'line',
            stack: '占比',
            areaStyle: {},
            data: data.bd,
            symbol: "circle"
          },
        ]
      };
      myChart.setOption(option);
    }

    onMounted(()=>{
      fetchData()
    })

    return { dom, showChart }

  }
}
</script>

<style scoped>
.chart-style {
  width: 100%;
  height: 300px;
}
</style>
