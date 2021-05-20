<template>
  <div class="performance">
    <div class="selection-area">
      <ElDatePicker
          class="selection"
          v-model="state.selectedDates"
          type="daterange"
          start-placeholder="起始日期"
          end-placeholder="截止日期"
          size="mini"
          :shortcuts="shortcuts"
          @change="onChange"
      ></ElDatePicker>
      <ElSelect size="mini" v-model="state.selectedBenchmark" placeholder="选择基金风格指数" @change="onChange"
                class="selection-style">
        <ElOption v-for="row in state.benchmarkOptions" :key="row.value" :label="row.label" :value="row.value"></ElOption>
      </ElSelect>
      <div v-if="data.length !== 0">
        <table>
          <caption><h3>评估报告</h3></caption>
          <tr>
            <th :colspan="2">投资顾问</th>
            <th :colspan="2">{{ data.company }}基金</th>
          </tr>

          <tr>
            <td :rowspan="4">基本信息</td>
            <td>评估时间</td>
            <td :colspan="2">{{ data.duration[1] }}</td>
          </tr>
          <tr class="strip">
            <td>产品名称</td>
            <td :colspan="2">{{ data.secuabbr }}</td>
          </tr>
          <tr>
            <td>产品类型</td>
            <td :colspan="2">{{ data.classify }}</td>
          </tr>
          <tr class="strip">
            <td>基金经理</td>
            <td :colspan="2">{{ data.manager }}</td>
          </tr>

          <tr>
            <td :rowspan="7" class="strip">业绩指标</td>
            <td>业绩区间</td>
            <td>{{ data.duration[0] }}至{{ data.duration[1] }}</td>
            <td>{{ state.benchmark }}</td>
          </tr>
          <tr class="strip">
            <td>累计收益</td>
            <td>{{ format(data.acc_return_yield.fund, '0.00%') }}</td>
            <td>{{ format(data.acc_return_yield.benchmark, '0.00%') }}</td>
          </tr>
          <tr>
            <td>年化收益</td>
            <td>{{ format(data.annualized_return_yield.fund, '0.00%') }}</td>
            <td>{{ format(data.annualized_return_yield.benchmark, '0.00%') }}</td>
          </tr>
          <tr class="strip">
            <td>日均收益</td>
            <td>{{ format(data.daily_change.fund.mean, '0.00%') }}</td>
            <td>{{ format(data.daily_change.benchmark.mean, '0.00%') }}</td>
          </tr>
          <tr>
            <td>胜率</td>
            <td>{{ format(data.daily_change.fund.win_ratio, '0.00%') }}</td>
            <td>{{ format(data.daily_change.benchmark.win_ratio, '0.00%') }}</td>
          </tr>
          <tr class="strip">
            <td>单日最大涨幅</td>
            <td>{{ format(data.daily_change.fund.max, '0.00%') }}</td>
            <td>{{ format(data.daily_change.benchmark.max, '0.00%') }}</td>
          </tr>
          <tr>
            <td>单日最大跌幅</td>
            <td>{{ format(data.daily_change.fund.min, '0.00%') }}</td>
            <td>{{ format(data.daily_change.benchmark.min, '0.00%') }}</td>
          </tr>

          <tr>
            <td :rowspan="3">交易日</td>
            <td class="strip">正交易日</td>
            <td class="strip">{{ data.trading_day_count.fund.win }}</td>
            <td class="strip">{{ data.trading_day_count.benchmark.win }}</td>
          </tr>
          <tr>
            <td>负交易日</td>
            <td>{{ data.trading_day_count.fund.lose }}</td>
            <td>{{ data.trading_day_count.benchmark.lose }}</td>
          </tr>
          <tr class="strip">
            <td>零交易日</td>
            <td>{{ data.trading_day_count.fund.draw }}</td>
            <td>{{ data.trading_day_count.benchmark.draw }}</td>
          </tr>

          <tr>
            <td :rowspan="4" class="strip">风险指标</td>
            <td>年化波动率</td>
            <td>{{ format(data.annualized_volatility.fund.vol, '0.00%') }}</td>
            <td>{{ format(data.annualized_volatility.benchmark.vol, '0.00%') }}</td>
          </tr>
          <tr class="strip">
            <td>下行波动率</td>
            <td>{{ format(data.annualized_volatility.fund.downside_vol, '0.00%') }}</td>
            <td>{{ format(data.annualized_volatility.benchmark.downside_vol, '0.00%') }}</td>
          </tr>
          <tr>
            <td>最大回撤</td>
            <td>{{ format(data.annualized_volatility.fund.drawback, '0.00%') }}</td>
            <td>{{ format(data.annualized_volatility.benchmark.drawback, '0.00%') }}</td>
          </tr>
          <tr class="strip">
            <td>最大回撤日期</td>
            <td>{{ data.max_drawback.fund.start }}至{{ data.max_drawback.fund.end }}</td>
            <td>{{ data.max_drawback.benchmark.start }}至{{ data.max_drawback.benchmark.end }}</td>
          </tr>

          <tr>
            <td :rowspan="3">综合指标</td>
            <td>Sharpe ratio</td>
            <td>{{ data.sharpe_ratio.fund }}</td>
            <td>{{ data.sharpe_ratio.benchmark }}</td>
          </tr>
          <tr class="strip">
            <td>Calmar ratio</td>
            <td>{{ data.calmar_ratio.fund }}</td>
            <td>{{ data.calmar_ratio.benchmark }}</td>
          </tr>
          <tr>
            <td>Sortino ratio</td>
            <td>{{ data.sortino_ratio.fund }}</td>
            <td>{{ data.sortino_ratio.benchmark }}</td>
          </tr>
        </table>
      </div>
      <div style="text-align: center" v-else>
        <h3>加载中...</h3>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from "vue";
import request from "../../request";
import dayjs from "dayjs";
import numeral from "numeral";


const shortcuts = [
  {
    text: '最近一周',
    value: (() => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    })(),
  }, {
    text: '最近一个月',
    value: (() => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    })(),
  }, {
    text: '最近三个月',
    value: (() => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    })(),
  }]

export default defineComponent({
  name: "Performance",
  props: {secucode: String},
  setup(props: any) {
    const {secucode} = props
    const data: any = ref([])

    const state: any = reactive({
      selectedDates: [],
      selectedBenchmark: null,
      benchmarkOptions: [],
    })

    const fetchBenchmarks = () => {
      request.get('/evaluate/benchmarks').then(r => {
        state.benchmarkOptions = r.data
      })
    }

    const fetchEvaluation = ()=>{
      let [start, end]: [string, string] = state.selectedDates
      if (start){
        start = dayjs(start).format('YYYY-mm-DD')
      }
      if (end){
        end = dayjs(end).format('YYYY-mm-DD')
      }
      request.post('/evaluate', {data: {secucode: secucode, start: start, end: end, benchmark: state.selectedBenchmark}}).then(resp => {
        data.value = resp
      })
    }

    onMounted(()=>{
      fetchBenchmarks()
      fetchEvaluation()
    })

    const onChange = ()=>{
      fetchEvaluation()
    }

    const format = (value: number, fmt: string) => {
      return numeral(value).format(fmt)
    }

    return { state, shortcuts, onChange, data, format }
  }
})
</script>

<style scoped>

.performance {
  min-height: 600px;
}

.selection-area {
  width: 100%;
  margin-bottom: 10px;
  text-align: left;
  padding-left: 20px;
}

.selection {
  margin-left: 30px;
  margin-right: 30px;
}

.selection-style {
  width: 250px;
  margin-left: 30px;
}

table {
  width: 75%;
  background: #ccc;
  margin: 10px auto;
  border-collapse: collapse;
}

th, td {
  height: 30px;
  line-height: 25px;
  text-align: center;
  border: 1px solid #ccc;
}

th {
  background: #eee;
  font-weight: normal;
}

tr {
  background: #fff;
}

tr:hover {
  background: #c5c8ce;
}

td a {
  color: #06f;
  text-decoration: none;
}

td a:hover {
  color: #06f;
  text-decoration: underline;
}

.strip {
  background: #F7F7F7
}
</style>