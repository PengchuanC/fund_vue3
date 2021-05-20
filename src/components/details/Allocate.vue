<template>
  <div class="allocate">
    <div class="row">
      <div class="col">
        <ElCard shadow="never" class="card">
          <h4 class="desc-title">资产配置</h4>
            <Asset :data="state.asset" :date="state.last" v-if="state.last"/>
        </ElCard>
        <ElCard shadow="never" class="card">
          <h4 class="desc-title">行业配置</h4>
          <Industry :data="state.industry" :date="state.last" v-if="state.last"/>
        </ElCard>
        <ElCard shadow="never" class="card">
          <h4 class="desc-title">资产配置-多期</h4>
          <AllocateHis :data="state.history" v-if="state.last"/>
        </ElCard>
        <ElCard shadow="never" class="card">
          <h4 class="desc-title">前十大集中度</h4>
          <Concentrate :data="state.concentration" v-if="state.last"/>
        </ElCard>
      </div>
      <div class="col">
        <ElCard shadow="never" class="card">
          <h4 class="desc-title">重仓债券</h4>
          <Bond :data="state.bond" :date="state.last" v-if="state.last"/>
        </ElCard>
        <ElCard shadow="never" class="card">
          <h4 class="desc-title">重仓股票</h4>
          <Stock :data="state.stock" :date="state.last" v-if="state.last"/>
        </ElCard>
        <ElCard shadow="never" class="card">
          <h4 class="desc-title">行业配置</h4>
          <IndustrySw :data="state.stock_sw" v-if="state.last"/>
        </ElCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import request from "../../request";
import {onMounted, reactive} from "vue";
import Asset from "./allocate/Asset.vue";
import Bond from "./allocate/Bond.vue";
import Industry from "./allocate/Industry.vue";
import Stock from "./allocate/Stock.vue";
import AllocateHis from "./allocate/AllocateHis.vue";
import IndustrySw from "./allocate/IndustrySw.vue";
import Concentrate from "./allocate/Concentrate.vue";

export default {
  name: "Allocate",
  components: {Concentrate, IndustrySw, AllocateHis, Stock, Asset, Bond, Industry},
  props: { secucode: String},
  setup(props: any){
    const { secucode } = props

    const state: any = reactive({
      last: null,
      asset: {chart: [], table: []},
      industry: [],
      stock: [],
      bond: [],
      history: [],
      stock_sw : {},
      concentration: []
    })

    const fetchData = ()=>{
      state.last = null
      state.asset = { chart: [], table: []}
      state.bond = []
      state.industry = []
      state.stock = []
      request.get("/asset", {params: {secucode}}).then(resp => {
        const data = resp;
        if (data.last) {
          state.last = data.last
        }
        if (data.asset) {
          state.asset = data.asset;
          state.history = data.history
        }
        if (data.industry) {
          state.industry = data.industry;
        }
        if (data.stock) {
          state.stock = data.stock;
          state.stock_sw = data.stock_sw
        }
        if (data.bond) {
          state.bond = data.bond;
        }
        state.concentration = data.concentration
      })
    }

    onMounted(()=>{
      fetchData()
    })

    return { secucode, state }

  }
}

</script>

<style scoped>
.allocate {
  min-height: 600px;
}

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