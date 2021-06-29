<template>
  <div class="etf-recent">
    <ElRow>
      <ElCol :span="12"><div id="etf-total"></div></ElCol>
      <ElCol :span="12"><div id="etf-theme"></div></ElCol>
    </ElRow>
  </div>
</template>

<script>
import {defineComponent, onMounted} from "vue";
import * as echarts from 'echarts';
import api from '../../request';


const draw = (id, data) => {
  const [x, y , value, max, min] = data
  const chart = echarts.init(document.getElementById(id))
  const options = {
    tooltip: {
      position: 'top'
    },
    grid: {
      height: '75%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: x,
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: y,
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: min,
      max: max,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%'
    },
    series: [{
      name: '净流入',
      type: 'heatmap',
      data: value,
      label: {
        show: true
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
  chart.setOption(options)
  window.onresize = ()=> chart.resize()
}


export default defineComponent({
  name: "ETFRecent",
  setup(){
    onMounted(()=>{
      api.get('/etf/recent').then(r=>{
        const {category, detail} = r
        draw('etf-total', category)
        draw('etf-theme', detail)
      })
    })
  }
})
</script>

<style scoped>
.etf-recent {
  width: 100%;
}

#etf-total {
  width: 100%;
  height: 700px;
}

#etf-theme {
  width: 100%;
  height: 700px;
}
</style>