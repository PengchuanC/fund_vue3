<template>
  <h4>基金分类汇总</h4>
  <div class="row">
    <div class="col-12">
      <div class="tree-chart" :ref="dom"></div>
    </div>
    <div class="col-12">
      <vxe-grid
          border
          resizable
          size="small"
          :tree-config="{children: 'children'}"
          :data="state.data"
          :columns="column"
          :max-height="600"
      >
      </vxe-grid>
    </div>
  </div>
</template>

<script lang="ts">

import request from "../request";
import {onMounted, reactive, ref} from "vue";
import numeral from 'numeral';
import * as echarts from 'echarts';
import { useRouter } from "vue-router";

const column = [
  {
    field: 'branch',
    title: '分类',
    treeNode: true
  },{
  field: 'count',
    title: '数量',
    align: 'center',
    formatter: ({row}: any)=>numeral(row.count).format('0,00')
  },{
    field: 'count2',
    title: '数量(合并)',
    align: 'center',
    formatter: ({row}: any)=>numeral(row.count2).format('0,00')
  },{
    field: 'scale',
    title: '规模',
    align: 'center',
    formatter: ({row}: any)=>numeral(row.scale).format('0,00.00')
  }
]

export default {
  name: "Home",
  setup(){

    const state = reactive({data: []})
    const refs = ref('')
    const router = useRouter()

    const fetchData = ()=>{
      request.get('/summary/bc').then(resp => {
        const { branch, total } = resp
        const data = branch.map((x: any)=>{
          x.children = x.children.map((child: any)=>{
            child.branch = child.classify
            return child
          })
          return x
        })
        data.push({branch: '合计', count: total.count, count2: total.count2, scale: total.scale})
        state.data = data

        const table = branch.map((x: any) => {
          return {
            name: x.branch, value: x.count, children: x.children.map((y: any) => {
              return {name: y.classify, value: y.count}
            })
          }
        });

        showTreeChart({name: '合计', value: total.count, children: table})
      })
    }

    const dom = (el: any) => {
      refs.value = el
    }

    const showTreeChart = (data: any)=>{
      const el: any = refs.value
      const chart = echarts.init(el)
      let option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',

            data: [data],

            top: '18%',
            bottom: '14%',

            layout: 'radial',

            symbol: 'emptyCircle',

            symbolSize: 7,

            initialTreeDepth: 3,

            animationDurationUpdate: 750

          }
        ]
      }
      chart.setOption(option);
      chart.on('click', function (params: any) {
        if (!params.data.children) {
          router.push({name: 'stat', params: {'classify': params.name}})
        }
      });
    }

    onMounted(()=>{fetchData()})

    return {
      state, column, dom
    }

  }
}
</script>

<style scoped>

h4 {
  margin: 10px 0 15px 0;
}

.row {
  display: inline-flex;
  width: 100%;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
}

.col-12 {
  flex: 12;
  justify-content: center;
  padding: 0 20px;
}

.tree-chart {
  width: 100%;
  height: 600px;
}
</style>