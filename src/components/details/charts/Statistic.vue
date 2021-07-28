<template>
  <div>
    <ElDescriptions :column="2" :title="`${state.info.sec_name}(${secucode})`" border>
      <ElDescriptionsItem label="单位净值">
        {{numeral(state.info.nav).format('1.0000')}} ({{state.info.update_date}})
      </ElDescriptionsItem>
      <ElDescriptionsItem label="累计净值">
        {{numeral(state.info.nav_acc).format('1.0000')}} ({{state.info.update_date}})
      </ElDescriptionsItem>
    </ElDescriptions>
    <br>
    <ElDescriptions :column="3" title="业绩表现" border>
      <ElDescriptionsItem label="近1周:">
        {{numeral(state.info.return_1w/100).format('0.00%')}}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="近1月:">
        {{numeral(state.info.return_1m/100).format('0.00%')}}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="近3月:">
        {{numeral(state.info.return_3m/100).format('0.00%')}}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="近6月:">
        {{numeral(state.info.return_6m/100).format('0.00%')}}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="近1年:">
        {{numeral(state.info.return_1y/100).format('0.00%')}}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="近3年:">
        {{numeral(state.info.return_3y/100).format('0.00%')}}
      </ElDescriptionsItem>
    </ElDescriptions>
    <br>
    <ElDescriptions :column="3" title="基金摘要" border>
      <ElDescriptionsItem label="基金类型">
        {{state.manager.classify}}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="基金规模">
        {{state.manager.scale}}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="基金经理">
        {{state.manager.manager}}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="成立日期">
        {{state.manager.setup}}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="任职日期">
        {{state.manager.start}}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="管理规模">
        {{numeral(state.manager.managed_scale).format('0,000.0')}}(亿元)
      </ElDescriptionsItem>
    </ElDescriptions>
    <br>
    <ElDescriptions :column="3" title="基金标签" border>
      <ElDescriptionsItem label="股票仓位">
        {{numeral(state.manager.stock).format('0.00%')}}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="风格属性">
        {{state.manager.style}}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="规模属性">
        {{state.manager.scale_type}}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="行业风格">
        {{state.manager.industry_style}}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="行业主题">
        {{state.manager.industry}}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="">
      </ElDescriptionsItem>
    </ElDescriptions>
  </div>
</template>

<script lang="ts">
import numeral from "numeral";
import request from "../../../request";
import {onMounted, reactive} from "vue";
import {latestPerformance} from "../../../assets/js/api";

export default {
  name: "Statistic",
  props: { secucode: String },
  setup(props: any){
    const { secucode } = props

    const state: any = reactive({
      info: {},
      manager: {}
    })

    const fetchPerformance = ()=>{
      latestPerformance(secucode).then(r=>{
        state.info = r
      })
    }

    const fetchManager = ()=>{
      request.get('/manager', {params: {secucode}}).then(r=>{
        state.manager = r
      })
    }

    onMounted(()=>{
      fetchPerformance()
      fetchManager()
    })

    return { state, secucode, numeral }
  }
}
</script>

<style scoped>

</style>
