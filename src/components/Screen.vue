<template>
  <div class="screen">
    <ElTabs size="small" class="tab-pane" model-value="1">
      <ElTabPane label="基础筛选" name="1">
        <ElRow>
          <ElCol :span="6">
            <p class="tip">基金分类</p>
            <ElSelect v-model="state.selected.category" placeholder="选择分类" size="mini" multiple class="selector">
              <ElOption v-for="(r, i) in state.selections.category" :key="'category'+i" :value="r">{{ r }}</ElOption>
            </ElSelect>
          </ElCol>
          <ElCol :span='3' class="col-md">
            <p class="tip">成立年限</p>
            <ElSelect v-model="state.selected.existed" placeholder="选择成立年限" size="mini" class="selector">
              <ElOption v-for="(r, i) in state.selections.existed" :key="'existed'+i" :value="r">{{ r }}</ElOption>
            </ElSelect>
          </ElCol>
          <ElCol :span="3" class="col-md">
            <p class="tip">最新净值</p>
            <ElSelect v-model="state.selected.netValue" placeholder="选择最新净值范围" size="mini" class="selector">
              <ElOption v-for="(r, i) in state.selections.netValue" :key="'netValue'+i" :value="r">{{ r }}</ElOption>
            </ElSelect>
          </ElCol>
          <ElCol :span="3">
            <p class="tip">单一投资者持仓比例</p>
            <ElSelect v-model="state.selected.holding" placeholder="选择单一投资者持仓比例上限" size="mini" class="selector">
              <ElOption v-for="(r, i) in state.selections.holding" :key="'holding'+i" :value="r">{{ r }}</ElOption>
            </ElSelect>
          </ElCol>
          <ElCol :span="3">
            <p class="tip">与同期指数比较</p>
            <ElSelect v-model="state.selected.index" placeholder="选择是否超过同期指数业绩" size="mini" class="selector">
              <ElOption v-for="(r, i) in state.selections.index" :key="'index'+i" :value="r">{{ r }}</ElOption>
            </ElSelect>
          </ElCol>
          <ElCol :span="3">
            <p class="tip">与同期业绩比较基准比较</p>
            <ElSelect v-model="state.selected.benchmark" placeholder="选择是否超过同期基准业绩" size="mini" class="selector">
              <ElOption v-for="(r, i) in state.selections.benchmark" :key="'benchmark'+i" :value="r">{{ r }}</ElOption>
            </ElSelect>
          </ElCol>
          <ElCol :span="3">
            <p class="tip">月度胜率</p>
            <ElSelect v-model="state.selected.win" placeholder="选择月底胜率" size="mini" class="selector">
              <ElOption v-for="(r, i) in state.selections.win" :key="'win'+i" :value="r">{{ r }}</ElOption>
            </ElSelect>
          </ElCol>
        </ElRow>
        <ElRow class="row2">
          <ElCol :span="3">
            <p class="tip">最大回撤</p>
            <ElSelect v-model="state.selected.drawback" placeholder="选择最大回撤上限" size="mini" clearable class="selector">
              <ElOption v-for="(r, i) in state.selections.drawback" :key="'drawback'+i" :value="r">{{ r }}</ElOption>
            </ElSelect>
          </ElCol>
          <ElCol :span="3">
            <p class="tip">债券：定期开放</p>
            <ElSelect v-model="state.selected.open" placeholder="选择是否定期开放" size="mini" class="selector">
              <ElOption v-for="(r, i) in state.selections.open" :key="'open'+i" :value="r">{{ r }}</ElOption>
            </ElSelect>
          </ElCol>
          <ElCol :span="3">
            <p class="tip">债券：年化波动</p>
            <ElSelect v-model="state.selected.vol" placeholder="选择债券年化波动上限" size="mini" class="selector">
              <ElOption v-for="(r, i) in state.selections.vol" :key="'vol'+i" :value="r">{{ r }}</ElOption>
            </ElSelect>
          </ElCol>
        </ElRow>
        <ElButton type="primary" class="execute" size="small" @click="commitSelected" :loading="state.loading">执行
        </ElButton>
        <ElButton type="success" size="small" @click="addToPool">添加到进阶筛选</ElButton>
        <ScreenResult class="table" :data="state.tableData" :key="'normal'+index"></ScreenResult>
      </ElTabPane>
      <ElTabPane label="进阶筛选" name="name2">
        <ElRow>
          <ElCol :span="3">
            <p class="tip">管理人规模</p>
            <ElSelect v-model="state.selected.managedScale" placeholder="管理人规模水平" size="mini" class="selector">
              <ElOption v-for="(r, i) in state.selections.managedScale" :key="'org'+i" :value="r">{{ r }}</ElOption>
            </ElSelect>
          </ElCol>
          <ElCol :span="3">
            <p class="tip">基金经理从业年限</p>
            <ElSelect v-model="state.selected.working" placeholder="选择基金经理从业时间下限" size="mini" class="selector">
              <ElOption v-for="(r, i) in state.selections.working" :key="'workingYear'+i" :value="r">{{ r }}</ElOption>
            </ElSelect>
          </ElCol>
          <ElCol :span="3">
            <p class="tip">任职本基金时间</p>
            <ElSelect v-model="state.selected.workingThis" placeholder="选择基金经理任职本基金时间下限" size="mini" class="selector">
              <ElOption v-for="(r, i) in state.selections.workingThis" :key="'workingThis'+i" :value="r">{{ r }}
              </ElOption>
            </ElSelect>
          </ElCol>
          <ElCol :span="3">
            <p class="tip">基金经理从业期间平均回报</p>
            <ElSelect v-model="state.selected.ret" placeholder="选择基金经理从业回报下限" size="mini" class="selector">
              <ElOption v-for="(r, i) in state.selections.ret" :key="'workingYearR'+i" :value="r">{{ r }}</ElOption>
            </ElSelect>
          </ElCol>
          <ElCol :span="3">
            <p class="tip">基金经理任职年化回报</p>
            <ElSelect v-model="state.selected.retThis" placeholder="选择基金经理任职本基金年化回报下限" size="mini" class="selector">
              <ElOption v-for="(r, i) in state.selections.retThis" :key="'workingThisR'+i" :value="r">{{ r }}</ElOption>
            </ElSelect>
          </ElCol>
          <ElCol :span="3">
            <p class="tip">基金三年评级</p>
            <ElSelect v-model="state.selected.rate" placeholder="选择基金三年评级下限" size="mini" class="selector">
              <ElOption v-for="(r, i) in state.selections.rate" :key="`rate${String(i)}`" :value="r">{{ r }}</ElOption>
            </ElSelect>
          </ElCol>
        </ElRow>
        <ElRow class="row2">
          <ElCol :span="6">
            <p class="tip">近年回报水平</p>
            <ElSelect v-model="state.selected.level" placeholder="选择近年回报水平下限" size="mini" multiple class="selector">
              <ElOption v-for="(r, i) in state.selections.level" :key="`level${String(i)}`" :value="r">{{ r }}</ElOption>
            </ElSelect>
          </ElCol>
        </ElRow>
        <ElButton type="primary" class="execute" size="small" @click="commitAdvancedSelected" :loading="state.loading">
          执行
        </ElButton>
        <ElButton type="success" size="small" @click="addToPortfolio">添加到基金池</ElButton>
        <ScreenResult class="table" :data="state.tableData" :key="'advance'+index"></ScreenResult>
        <vxe-modal :key="state.showSave" v-model="state.showSave" fullscreen title="保存筛选结果到基金池">
          <AddToPool :funds="state.funds"/>
        </vxe-modal>
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script>

import {defineComponent, onMounted, reactive, ref} from "vue"
import request from "../request"
import ScreenResult from './screen/ScreenResult.vue'
import AddToPool from "./screen/AddToPool.vue"
import {ElMessage} from 'element-plus';

export default defineComponent({
  name: "Screen",
  components: {ScreenResult, AddToPool},
  setup() {
    const state = reactive({
      selected: {
        category: [],
        existed: '',
        netValue: '',
        holding: '',
        index: '',
        benchmark: '',
        win: '',
        drawback: '',
        open: '',
        vol: '',
        managedScale: '',
        working: '',
        workingThis: '',
        ret: '',
        retThis: '',
        rate: '',
        level: []
      },
      selections: {
        category: ['加载中...'],
        existed: [],
        netValue: [],
        holding: [],
        index: [],
        benchmark: [],
        win: [],
        drawback: [],
        open: [],
        vol: [],
        level: [],
        ret: [],
        retThis: [],
        rate: [],
        managedScale: [],
        working: [],
        workingThis: []
      },
      tableData: [],
      advancedPool: [],
      showSave: false,
      funds: [],
      loading: false,
    })

    // 强制刷新组件
    const index = ref(0)

    const getSelections = () => {
      request.get('/screen/selections').then(r => {
        const data = r.data
        for (let key in data) {
          if (!data.hasOwnProperty(key)) {
            break
          }
          state.selections[key] = data[key]
        }
      })
    }

    onMounted(() => {
      getSelections()
    })

    const commitSelected = () => {
      state.tableData = []
      index.value++
      state.loading = true
      request.post('/screen/selections', {data: {selected: state.selected}}).then(r => {
        state.tableData = r
        index.value++
        state.loading = false
      })
    }

    const commitAdvancedSelected = () => {
      state.tableData = []
      index.value++
      state.loading = true
      request.post('/screen/selections', {data: {selected: state.selected, funds: state.advancedPool}}).then(r => {
        state.tableData = r.map(x => {
          if (state.advancedPool.includes(x.secucode)) {
            return x
          }
        })
        index.value++
        state.loading = false
      })
    }

    const addToPool = () => {
      const funds = state.tableData.map(x => x.secucode)
      state.advancedPool.push(...funds)
      state.advancedPool = Array.from(new Set(state.advancedPool))
      ElMessage.success({
        message: '成功添加到进阶筛选池'
      })
    }

    const addToPortfolio = () => {
      state.showSave = !state.showSave
      state.funds = state.advancedPool
    }

    return {state, commitSelected, commitAdvancedSelected, addToPool, addToPortfolio, index}
  }
})

</script>

<style scoped>
.screen {
  width: 100%;
}

p {
  font-size: 14px;
  margin-bottom: 5px;
}

.row2 {
  margin: 10px 0 5px 0;
  padding-bottom: 10px;
  border-bottom: #cccccc 1px solid;
}

.tab-pane {
  text-align: left;
  height: 100%;
}

.selector {
  width: calc(100% - 5px);
  margin-right: 5px;
}

.execute {
  margin-top: 10px;
  margin-right: 5px;
}

.table {
}

.modal {
  width: 100%;
}
</style>