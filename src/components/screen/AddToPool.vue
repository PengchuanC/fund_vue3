<template>
  <div class="center">
    <ElCard shadow="never" class="card"
          title="选择需要更新的基金池"
    >
      <div class="row">
        <div class="col-4">
          <ElTag class="tag">选择基金池</ElTag>
        </div>
        <div class="col-16">
          <ElSelect v-model="state.pool" clearable placeholder="选择基金池" size="small" style="width:200px"
                  @on-change="onSelectPool">
            <ElOption v-for="item in state.poolList" :key="item.value" :value="item.value" :label="item.label"></ElOption>
          </ElSelect>
        </div>
      </div>
      <br>
      <div class="row at-row">
        <div class="col-4">
          <ElTag class="tag">基金池类型</ElTag>
        </div>
        <div class="col-8">
          <ElSelect v-model="state.poolType" clearable placeholder="选择基金池类型" size="small" style="width:200px"
                  @on-change="onSelectPoolType">
            <ElOption v-for="item in state.poolTypeList" :key="item.value" :value="item.value" :label="item.label"></ElOption>
          </ElSelect>
        </div>
        <div class="col-8">
          <ElDatePicker v-model="state.date" placeholder="选择组合更新日期" size="small" style="width: 200px" type="date"></ElDatePicker>
        </div>
      </div>
      <br>
      <div class="row at-row">
        <div class="col-4">
          <ElTag class="tag">内容提示</ElTag>
        </div>
        <div class="col-16">
          <div v-if="state.message">
            <ElAlert type="success" class="alert" show-icon :title="state.message"></ElAlert>
          </div>
          <div v-else>
            <ElAlert type="warning" class="alert" title="请选择基金池" show-icon></ElAlert>
          </div>
        </div>
      </div>
      <br>
      <div class="row">
        <div class="col-4">
          <ElTag class="tag">执行操作</ElTag>
        </div>
        <div class="col-3">
          <ElButton type="success" size="small" @click="commit">提交</ElButton>
        </div>
        <div class="col-3">
          <ElButton type="warning" size="small" @click="reset">重置</ElButton>
        </div>
      </div>
    </ElCard>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive} from "vue"
import request from "../../request"
import dayjs from "dayjs"

export default defineComponent({
  name: "AddToPool",
  props: {funds: Array},
  setup(props: any){

    const { funds } = props

    const state: any = reactive({
      pool: '',
      poolList: [],
      poolType: '',
      date: '',
      message: '',
      poolTypeList: [{label: "观察池", value: 1}, {label: "核心池", value: 2}]
    })

    const getFundPool = ()=>{
      request.get('/portfolio').then((resp: any) => {
        const data = resp
        if (!data) {
          return
        }
        state.poolList = data.slice(1, data.length).map(x => {
          return {label: x.port_name, value: x.port_id}
        })
      })
    }

    const onSelectPool = ()=>{
      if (state.poolType) {
        getPoolMaxUpdateDate()
      } else {
        state.message = "请选择基金类型"
      }
    }

    const onSelectPoolType = ()=>{
      if (state.pool) {
        getPoolMaxUpdateDate()
      } else {
        state.message = "尚未选择基金池，请选择基金池"
      }
    }

    const getPoolMaxUpdateDate = ()=>{
      request.get("/portfolio/date",
          {params: {port_id: state.pool, port_type: state.poolType}}
      ).then((resp: any) => {
       state.message = `当前所选基金池最新更新日期为${resp[0]}，选择更新日期请勿早于此日，建议选择次月末`
      })
    }

    const addToPool = ()=>{
      const date = dayjs(state.date).format('YYYY-MM-DD')
      request.post("/portfolio", {data: {
          port_id: state.pool, port_type: state.poolType, funds: funds, date
        }}).then(data => {
        switch (data.code) {
          case 0:
            state.message = "保存成功"
            break
          case -1:
            state.message = "保存失败"
            break
        }
      })
    }

    const commit = ()=>{
      if (funds.length === 0) {
        state.message = "筛选出的基金列表为空，或者没有筛选基金，请返回筛选界面筛选基金"
        return
      }
      addToPool()
    }
    const reset = ()=>{
      state.pool = ""
      state.poolType = ""
      state.date = ""
      state.message = "重置完成"
    }

    onMounted(()=>{getFundPool()})

    return { state, getFundPool, onSelectPoolType, onSelectPool, addToPool, commit, reset }
  }
})

</script>

<style scoped>
.center {
  padding: 0;
}

.card {
  width: 50vw;
  height: 75vh;
  margin-left: 25%;
  margin-right: 25%;
}

.row {
  display: inline-flex;
  width: 100%;
  margin-bottom: 15px;
}

.col-3 {
  width: 60px;
}

.col-4 {
  width: 100px;
}

.col-8 {
  width: 200px;
  margin-right: 5px;
}

.tag {
  text-align: center;
  width: 90px;
  height: 32px;
}

.alert {
  width: 405px;
  height: 32px;
}
</style>