<template>
  <div class="attribution" v-if="show">
    <div class="selectors">
      <ElDatePicker
          type="monthrange"
          align="right"
          size="mini"
          unlink-panels
          range-separator="至"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          :shortcuts="shortcuts"
          v-model="state.dateRange"
          @change="onChange"
      ></ElDatePicker>
      <ElSelect v-model="state.indexcode" size="mini" class="selectors-index" @change="onChange">
        <ElOption v-for="r in state.indexOptions" :value="r.value" :label="r.name" :key="r.name"></ElOption>
      </ElSelect>
    </div>
    <div class="attribution-chart" :ref="dom"></div>
  </div>
  <ElEmpty v-else description="基金类型不适用" class="attribution" />
</template>

<script lang="ts">
import {defineComponent, nextTick, onMounted, reactive, ref} from "vue";
import request from "../../request";
import dayjs from "dayjs";
import { ElLoading } from 'element-plus';
import * as echarts from 'echarts';


const shortcuts = [
    {
  text: '本月',
  value: [new Date(), new Date()],
}, {
  text: '今年至今',
  value: (() => {
  const end = new Date()
  const start = new Date(new Date().getFullYear(), 0)
  return [start, end]
})(),
}, {
  text: '最近六个月',
      value: (() => {
    const end = new Date()
    const start = new Date()
    start.setMonth(start.getMonth() - 6)
    return [start, end]
  })(),
}]

export default defineComponent({
  name: "Attribution",
  props: { secucode: String},
  setup(props){
    const {secucode} = props

    const state = reactive({
      start: dayjs().format('YYYY-MM-DD'),
      end: dayjs().format('YYYY-MM-DD'),
      dateRange: [Date(), Date()],
      indexOptions: [
        {name: '沪深300', value: '000300'},
        {name: '中证500', value: '000905'},
        {name: '中证800', value: '000906'},
      ],
      indexcode: '000906'
    })

    const instance = ref(null)
    const show = ref(true)

    const dom = (el) => {
      instance.value = el
    }

    const fetch = ()=>{
      const loadingInstance = ElLoading.service({fullscreen: true})
      const {start, end, indexcode} = state
      request.get("/attr/brinson", {params: {secucode, indexcode, start, end}}).then((r:any)=>{
        drawChart(r)
        nextTick(()=>{
          loadingInstance.close()
        })
      }).catch(()=>{
        show.value=false
        loadingInstance.close()
      })
    }

    const drawChart = (data: any)=>{
      let x1 = data.map(x => {
        return x.rtt ? x.rtt.toFixed(4) : 0
      });
      let max1 = Math.ceil(Math.max(...x1.map(x => {
        return Math.abs(x)
      })) * 2) / 2;
      let x2 = data.map(x => {
        return x.raa ? x.raa.toFixed(4) : 0
      });
      let max2 = Math.ceil(Math.max(...x2.map(x => {
        return Math.abs(x)
      })) * 2) / 2;
      let x3 = data.map(x => {
        return x.rss ? x.rss.toFixed(4) : 0
      });
      let max3 = Math.ceil(Math.max(...x3.map(x => {
        return Math.abs(x)
      })) * 2) / 2;
      let x4 = data.map(x => {
        return x.rin ? x.rin.toFixed(4) : 0
      });
      let max4 = Math.ceil(Math.max(...x4.map(x => {
        return Math.abs(x)
      })) * 2) / 2;
      let y = data.map(x => {
        return x.industry
      }).reverse();
      const el: any = instance.value
      const myChart = echarts.init(el);
      const option = {
        // backgroundColor: 'rgba(128, 128, 128, 0.1)',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: [
          {x: '7%', y: '15%', width: '20%', height: '70%', show: false,},
          {x: '30%', y: '15%', width: '18%', height: '70%', show: false,},
          {x: '53%', y: '15%', width: '18%', height: '70%', show: false,},
          {x: '76%', y: '15%', width: '18%', height: '70%', show: false,}
        ],
        xAxis: [
          {gridIndex: 0, min: -max1, max: max1, splitLine: {show: false}},
          {gridIndex: 1, min: -max2, max: max2, splitLine: {show: false}},
          {gridIndex: 2, min: -max3, max: max3, splitLine: {show: false}},
          {gridIndex: 3, min: -max4, max: max4, splitLine: {show: false}}
        ],
        yAxis: [
          {
            gridIndex: 0,
            name: "超额收益(%)",
            type: "category",
            data: y
          },
          {
            gridIndex: 1,
            name: "资产配置(%)",
            type: "category",
            axisLabel: {show: false},
            data: y
          },
          {
            gridIndex: 2,
            name: "个股选择(%)",
            type: "category",
            axisLabel: {show: false},
            data: y
          },
          {
            gridIndex: 3,
            name: "交互收益(%)",
            type: "category",
            axisLabel: {show: false},
            data: y
          },
        ],
        series: [
          {
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: x1.reverse()
          },
          {
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: x2.reverse()
          },
          {
            type: 'bar',
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: x3.reverse()
          },
          {
            type: 'bar',
            xAxisIndex: 3,
            yAxisIndex: 3,
            data: x4.reverse()
          },
        ]
      };
      myChart.setOption(option);
    }

    const onChange = ()=>{
      const [start, end] = state.dateRange
      state.start = dayjs(start).format('YYYY-MM-DD')
      state.end = dayjs(end).add(1, "month").add(-1, "day").format('YYYY-MM-DD')
      fetch()
    }

    onMounted(fetch)

    return {state, shortcuts, dom, onChange, show}

  }
})
</script>

<style scoped>
.attribution {
  min-height: 600px;
}

.selectors {
  text-align: left;
  width: 100%;
  padding: 5px 20px;
}

.selectors-index {
  margin-left: 10px;
}

.attribution-chart {
  width: 100%;
  height: 800px;
}
</style>
