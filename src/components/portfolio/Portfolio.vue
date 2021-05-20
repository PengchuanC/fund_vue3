<template>
  <div class="portfolio">
    <ElSelect placeholder="选择组合" size="mini" v-model="state.portfolio" @change="onChange">
      <ElOption :label="row.label" :value="row.value" :key="row.value" v-for="row in state.portfolioOptions"></ElOption>
    </ElSelect>
    <ElRadioGroup v-model="state.portType" class="port-type" @change="onChange">
      <ElRadio :label="1">观察池</ElRadio>
      <ElRadio :label="2">核心池</ElRadio>
    </ElRadioGroup>
    <ElSelect placeholder="最新一期" size="mini" v-model="state.date" @change="onChange">
      <ElOption :label="row" :value="row" :key="row" v-for="row in state.dateOptions"></ElOption>
    </ElSelect>
    <vxe-grid
        size="mini" border highlight-hover-row stripe
        class="vxe-table" show-overflow
        :columns="columns" :data="state.data"
        :max-height="100000"
    />
  </div>
</template>

<script lang="tsx">
import {defineComponent, nextTick, onMounted, reactive} from "vue";
import {useRouter} from "vue-router";
import request from "../../request";
import numeral from "numeral";
import {ElLoading} from "element-plus";

export default defineComponent({
  name: "Portfolio",
  setup(){
    const state: any = reactive({
      portfolio: 1,
      portType: 1,
      portfolioOptions: [],
      date: null,
      dateOptions: [],
      data: []
    })

    const fetchPortfolio = ()=>{
      request.get('/portfolio/new').then((r: any) => {
        state.portfolioOptions = r
      })
    }

    const fetchDateOptions = ()=>{
      request.get('/portfolio/new/date', {params: {
        port_id: state.portfolio, port_type: state.portType
        }}).then((r: any)=>{
        state.dateOptions = r.data
      })
    }

    onMounted(()=>{
      fetchPortfolio()
      fetchDateOptions()
      onChange()
    })

    const onChange = ()=>{
      const instance = ElLoading.service({fullscreen: true})
      state.data = []
      fetchDateOptions()
      request.post('/portfolio/new',{data:{
        port_id: state.portfolio, port_type: state.portType
        }}).then((r: any)=>{
        state.data = r
        nextTick(()=>{})
        instance.close()
      })
    }

    const router = useRouter()

    const columns = [
      {
        type: "checkbox",
        align: "center",
        width: 40
      },
      {
        type: "seq",
        title: '#',
        align: "center",
        width: 60
      },
      {
        title: "基金代码",
        field: "secucode",
        align: "left",
        sortable: true,
        slots: {
          default: ({row}: any) => {
            const {secucode} = row
            return <div class="secucode" onClick={() => router.push({name: 'info', params: {secucode}})}>{secucode}</div>
          }
        }
      },
      {
        title: "基金简称",
        field: "secuabbr",
        align: "left",
        sortable: true
      },
      {
        title: "成立日期",
        field: "launch_date",
        align: "center",
        sortable: true
      },
      {
        title: "基金经理",
        field: "manager",
        align: "left",
        showOverflow: true
      },
      {
        title: "规模(亿元)",
        field: "scale",
        align: "right",
        sortable: true,
        formatter: ({row}: any) => numeral(row.scale).format('0,00.0')
      },
      {
        title: "净值日期",
        field: "date",
        align: "center",
        sortable: true
      },
      {
        title: "净值",
        field: "unitnv",
        align: "right",
        formatter: ({row}: any)=> numeral(row.unitnv).format('0.0000')
      },
      {
        title: "日涨跌",
        field: "daily",
        align: "right",
        sortable: true,
        formatter: ({row}: any)=> numeral(row.daily).format('0.00')
      },
      {
        title: "近1周",
        field: "week",
        align: "right",
        sortable: true,
        formatter: ({row}: any)=> numeral(row.week).format('0.00')
      },
      {
        title: "近1月",
        field: "month",
        align: "right",
        sortable: true,
        formatter: ({row}: any)=> numeral(row.month).format('0.00')
      },
      {
        title: "近3月",
        field: "month3",
        align: "right",
        sortable: true,
        formatter: ({row}: any)=> numeral(row.month3).format('0.00')
      },
      {
        title: "近6月",
        field: "month6",
        align: "right",
        sortable: true,
        formatter: ({row}: any)=> numeral(row.month6).format('0.00')
      },
      {
        title: "近1年",
        field: "year",
        align: "right",
        sortable: true,
        formatter: ({row}: any)=> numeral(row.year).format('0.00')
      },
      {
        title: "近3年",
        field: "year3",
        align: "right",
        sortable: true,
        formatter: ({row}: any)=> numeral(row.year3).format('0.00')
      },
      {
        title: "成立年化",
        field: "ftd_annual",
        align: "right",
        sortable: true,
        formatter: ({row}: any)=> numeral(row.ftd_annual).format('0.00')
      },
      {
        title: "状态",
        field: "status",
        align: "center",
        sortable: true,
        filters: [{label: '新增', value: '新增'}, {label: '保持', value: '保持'}, {label: '回归', value: '回归'}, {label: '删除', value: '删除'}],
        filterMultiple: true,
      }
    ]

    return { state, onChange, columns }
  }
})

</script>

<style scoped>
.portfolio {
  text-align: left;
  padding-left: 50px;
  padding-right: 50px;
  height: 100%;
}

.port-type {
  width: 200px;
  margin-left: 50px;
  margin-right: 50px;
}

.vxe-table {
  height: 100%;
  width: 100%;
  margin: 20px auto;
}

.secucode {
  cursor: pointer;
  width: 100%;
}
</style>