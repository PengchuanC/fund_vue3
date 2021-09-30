<template>
  <div class="allocate">
    <div class="row">
      <div class="col">
        <ElCard shadow="never" class="card">
          <h4 class="desc-title">资产配置</h4>
            <Asset :secucode="secucode"/>
        </ElCard>
        <ElCard shadow="never" class="card">
          <h4 class="desc-title">行业配置</h4>
          <Industry :secucode="secucode"/>
        </ElCard>
        <ElCard shadow="never" class="card">
          <h4 class="desc-title">资产配置-多期</h4>
          <AllocateHis :secucode="secucode"/>
        </ElCard>
        <ElCard shadow="never" class="card">
          <h4 class="desc-title">前十大集中度</h4>
          <Concentrate :secucode="secucode"/>
        </ElCard>
      </div>
      <div class="col">
        <ElCard shadow="never" class="card">
          <h4 class="desc-title">重仓债券</h4>
          <Bond :secucode="secucode"/>
        </ElCard>
        <ElCard shadow="never" class="card">
          <h4 class="desc-title">重仓股票</h4>
          <Stock :secucode="secucode"/>
        </ElCard>
        <ElCard shadow="never" class="card">
          <h4 class="desc-title">行业配置</h4>
          <IndustrySw :secucode="secucode"/>
        </ElCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
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

    return { secucode }

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
