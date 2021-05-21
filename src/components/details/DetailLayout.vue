<template>
  <div>
    <ElBreadcrumb>
      <ElBreadcrumbItem>基金详情</ElBreadcrumbItem>
      <ElBreadcrumbItem>{{ state.currentTab }}</ElBreadcrumbItem>
    </ElBreadcrumb>

    <ElTabs type="bordered-card" v-model="state.currentTab" class="tab-wrapper" :key="state.secucode">
      <ElTabPane label="基金概览" name="基金概览" :lazy="true">
        <Fact :secucode="state.secucode" />
      </ElTabPane>
      <ElTabPane label="业绩表现" name="业绩表现">
        <Performance :secucode="state.secucode" />
      </ElTabPane>
      <ElTabPane label="基金经理" name="基金经理">
        <Manager :secucode="state.secucode" />
      </ElTabPane>
      <ElTabPane label="资产配置" name="资产配置" :lazy="true">
        <Allocate :secucode="state.secucode" />
      </ElTabPane>
      <ElTabPane label="业绩归因" name="业绩归因" v-if="false">
        <Attribution :secucode="state.secucode" />
      </ElTabPane>
      <ElTabPane label="重仓持股" name="重仓持股">
        <KeyPortfolio :secucode="state.secucode" />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, watch} from "vue";
import { useRoute } from "vue-router";
import Performance from "./Performance.vue";
import Fact from "./Fact.vue";
import Manager from "./Manager.vue";
import Allocate from "./Allocate.vue";
import KeyPortfolio from "./KeyPortfolio.vue";
import Attribution from "./Attribution.vue";

export default defineComponent({
  name: "DetailLayout",
  components: {Attribution, KeyPortfolio, Allocate, Manager, Fact, Performance},
  setup(){
    const route = useRoute()

    const state: any = reactive({
      currentTab: sessionStorage.getItem('detailTab') || '基金概览',
      secucode: route.params.secucode
    })

    watch(()=>route.path, ()=>{
      const { secucode } = route.params
      if (secucode){
        state.secucode = secucode
      }
    })

    watch(()=>state.currentTab, ()=>{
      sessionStorage.setItem('detailTab', state.currentTab)
    })

    return { state }
  }
})

</script>

<style scoped>
.tab-wrapper{
  margin-top: 15px;
  border-radius: 5px;
  border: #E4E7ED 1px solid;
  padding: 0;
}
</style>