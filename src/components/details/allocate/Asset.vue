<template>
    <div class="asset">
      <div class="chart" :ref="instance"></div>
      <div class="table">
        <vxe-table
            size="mini"
            highlight-hover-row stripe highlight-hover-column
            auto-resize border
            style="width: 100%"
            :data="data.table"
        >
          <vxe-column field="asset" title="资产"></vxe-column>
          <vxe-column field="current" title="占净值比(%)" align="center" :formatter="formatPercent"></vxe-column>
          <vxe-column field="change" title="较上期变动(%)" align="center" :formatter="formatFloat"></vxe-column>
        </vxe-table>
      </div>
    </div>
  <div class="update-date">更新日期: {{date}}</div>
</template>

<script>
import {onMounted, ref} from "vue";
import * as echarts from 'echarts';
import numeral from "numeral";

export default {
  name: "Asset",
  props: { data: Object, date: String },
  setup(props){
    const { data, date } = props

    const chartInstance = ref('')

    const draw = (data) => {
      const myChart = echarts.init(chartInstance.value)
      const option = {
        grid: {
          show: false,
          top: 40,
          left: "5%",
          right: "5%",
          bottom: '10%'
        },
        tooltip: {
          trigger: 'item',
          // formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        textStyle: {
          fontFamily: ['Arial', 'kaiti'],
        },
        color: ['#CB2420', '#80A9AE', '#00305C', '#737374', '#DE7C77', '#B1BED0'],
        legend: {
          orient: 'vertical',
          left: 'right',
          top: "center",
          data: data.map(x => {
            return x.name
          })
        },
        series: [
          {
            type: 'pie',
            radius: '55%',
            center: ['30%', '50%'],
            data: data.map(x => {
              return {value: x.ratio, name: x.name}
            }),
            labelLine: {
              show: false
            },
            label: {
              show: false
            }
          }
        ]
      };
      myChart.setOption(option)
    }

    onMounted( ()=>{
      draw(data.chart)
    })

    const formatPercent = ({cellValue})=>{
      return numeral(cellValue? cellValue*100: 0).format('0.00')
    }

    const formatFloat = ({cellValue})=>{
      return numeral(cellValue).format('0.00')
    }

    const instance = (el)=>{
      chartInstance.value = el
    }

    return { instance, data, date, formatPercent, formatFloat }
  }
}
</script>

<style scoped>

.asset {
  width: 100%;
  display: inline-flex;
}

.chart {
  width: 50%;
  height: 250px;
}

.table {
  width: 50%;
}

.update-date {
  text-align: left;
  font-size: smaller;
}
</style>