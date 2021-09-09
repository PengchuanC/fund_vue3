<template>
  <div class="dashboard">
    <div v-if="!state.show">
    <div class="row">
      <div class="period">
        <span>时间段：</span>
        <ElRadioGroup v-model="state.period" @change="change">
          <ElRadio label="近1年"></ElRadio>
          <ElRadio label="近2年"></ElRadio>
          <ElRadio label="近3年"></ElRadio>
          <ElRadio label="近5年"></ElRadio>
        </ElRadioGroup>
      </div>
      <div class="style">
        <span>风格：</span>
        <ElRadioGroup v-model="state.style" @change="change">
          <ElRadio label="成长"></ElRadio>
          <ElRadio label="均衡"></ElRadio>
          <ElRadio label="价值"></ElRadio>
        </ElRadioGroup>
      </div>
      <div class="industry">
        <span>行业：</span>
        <ElRadioGroup v-model="state.industry" @change="change">
          <ElRadio label="消费"></ElRadio>
          <ElRadio label="金融地产"></ElRadio>
          <ElRadio label="TMT"></ElRadio>
          <ElRadio label="中游制造"></ElRadio>
          <ElRadio label="周期"></ElRadio>
          <ElRadio label="港股"></ElRadio>
        </ElRadioGroup>
      </div>
    </div>
    <div class="row" :key="index">
      <Simple @show="showComplex" :index="idx" v-for="(row, idx) in state.data" :key="'simple'+idx.toString()" :data="row"/>
    </div>
    </div>
    <ElCard style="width: 100%" v-else>
      <template #header>
        <ElPageHeader title="返回" content="详细" @back="state.show=false"></ElPageHeader>
      </template>
      <Detail class="detail" :params="state.params" />
    </ElCard>
  </div>
</template>

<script>
import {defineComponent, nextTick, onMounted, reactive, ref} from "vue";
import Simple from "./dashboard/Simple.vue";
import request from "../request";
import Detail from "./dashboard/Detail.vue";
import { ElLoading } from 'element-plus';

export default defineComponent({
  name: "Dashboard",
  components: {Detail, Simple},
  setup(){
    const state = reactive({
      show: false,
      backup: [],
      data: [],
      period: null,
      style: null,
      industry: null,
      params: {}
    })

    // 用于强制刷新页面
    const index = ref(0)


    const showComplex = (index)=>{
      const d = state.data[index]
      const { year, style, industry } = d
      state.params = {year: year, style: style, industry: industry}
      state.show = true
    }

    onMounted(()=>{
      const loadingInstance = ElLoading.service({fullscreen: true})
      request.get('/dashboard/home').then(r=>{
        state.backup = r.data
        state.data = state.backup
        nextTick(()=>{
          loadingInstance.close()
        })
      })
    })

    const change = ()=>{
      state.data = state.backup
      if (state.period !== null){
        state.data = state.data.filter((x)=> x.year === state.period)
      }
      if (state.style !== null){
        state.data = state.data.filter((x)=> x.style === state.style)
      }
      if (state.industry !== null) {
        state.data = state.data.filter((x) => x.industry === state.industry)
      }
      state.data = [...state.data]
      index.value ++
    }

    return { state, showComplex, change, index }
  }
})

</script>

<style scoped>
.dashboard {
  /*border: 1px solid #E6E6E6;*/
  border-radius: 5px;
  min-height: 780px;
}

.row {
  margin: 5px;
  width: calc(100% - 10px);
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
}

.period {
  width: 410px;
}

.style {
  width: 350px;
}

.industry {
  width: 650px;
}

.detail {
  width: 100%;
  overflow: auto;
}

</style>
