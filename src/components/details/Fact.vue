<template>
  <div class="row">
    <div class="col">
      <ElCard shadow="never" class="card">
        <Statistic :secucode="secucode" />
      </ElCard>
      <ElCard shadow="never" class="card">
        <h4 class="desc-title">基金风格</h4>
        <Style :secucode="secucode" />
      </ElCard>
      <ElCard shadow="never" class="card">
        <h4 class="desc-title">业绩归因</h4>
        <Brinson :secucode="secucode" />
      </ElCard>
      <ElCard shadow="never" class="card">
        <h4 class="desc-title">换手率</h4>
        <Turnover :secucode="secucode" />
      </ElCard>
      <ElCard shadow="never" class="card">
        <h4 class="desc-title">业绩评价</h4>
        <div style="display: inline-flex; width: 100%">
          <RiskTraceShort :secucode="secucode" url="/fundinfo/risk/short"/>
          <RiskTraceShort :secucode="secucode" url="/fundinfo/risk/long"/>
        </div>
      </ElCard>
    </div>
    <div class="col">
      <ElCard shadow="never" class="card">
        <h4 class="desc-title">业绩曲线</h4>
        <NavChart :secucode="secucode" />
      </ElCard>
      <ElCard shadow="never" class="card">
        <h4 class="desc-title">规模变化</h4>
        <ScaleChange :secucode="secucode" />
      </ElCard>
      <ElCard shadow="never" class="card">
        <h4 class="desc-title">持有人结构</h4>
        <HolderInfo :secucode="secucode" />
      </ElCard>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import Style from "./charts/Style.vue";
import Brinson from "./charts/Brinson.vue";
import Statistic from "./charts/Statistic.vue";
import Turnover from "./charts/Turnover.vue";
import HolderInfo from "./charts/HolderInfo.vue";
import NavChart from "./charts/NavChart.vue";
import ScaleChange from "./charts/ScaleChange.vue";
import RiskTraceShort from "./charts/RiskTraceShort.vue";

export default defineComponent({
  name: "Fact",
  components: {RiskTraceShort, ScaleChange, NavChart, HolderInfo, Turnover, Statistic, Brinson, Style},
  props: { secucode: String },
  setup(props){
    const { secucode } = props
    return { secucode }
  }

})

</script>

<style scoped>
.row {
  display: inline-flex;
  width: 100%;
}

.col {
  width: 100%;
  flex: 12;
  padding: 10px;
}

.card {
  width: 100%;
  margin-bottom: 5px;
}

.desc-title {
  text-align: left;
  margin-bottom: 10px;
}
</style>