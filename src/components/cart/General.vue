<template>
  <div>
    <div class="items-wrapper" v-for="(abbr, idx) in state.abbr" :key="`abbr${String(idx)}`">
      <div class="target">{{ abbr.name }}</div>
      <ElCheckbox class="checkbox" style="width: 80px" :indeterminate="state.selected[abbr.key].indeterminate"
                  size="small"
                  v-model="state.selected[abbr.key].checkAll"
                  @click.prevent.native="handleCheckAll(abbr.key)">
        不限
      </ElCheckbox>
      <ElCheckboxGroup class="selection-items" v-model="state.selected[abbr.key].checkAllGroup"
                       @change="(d)=>{checkAllGroupChange(d, abbr.key)}">
        <ElCheckbox class="checkbox" v-for="(item, idx) in state.selections[abbr.key]" size="small" :key="`${String(abbr.key)}${String(idx)}`"
                    style="width: 180px;" :label="item">
        </ElCheckbox>
      </ElCheckboxGroup>
    </div>
    <!--风控指标-->
    <div class="items-wrapper" v-for="(item, name) in state.riskSelections" :key="String(name)">
      <div class="target">{{item.label}}</div>
      <div class="selector-items">
        <ElCascader
            size="mini" style="width: 50%"
            :placeholder="`选择 ${item.label} ${item.peer? '同类分位': ''}，同一时间区间请勿多选`"
            v-model="state.risks[name]" :props="props" :options="item.options" clearable
        ></ElCascader>
      </div>
    </div>

    <!--提交-->
    <ElButton class="submit-button" type="success" size="small" :onclick="submit">执行筛选</ElButton>
    <ElButton class="submit-button" type="danger" size="small" :onclick="refreshCache" :loading="state.refreshing">刷新缓存(耗时操作)</ElButton>

    <!--数据展示-->
    <CartTable :data="state.tableData" :loading="state.loading" class="data-present" v-if="!state.loading"/>
  </div>
</template>

<script lang="ts">

import {defineComponent, onMounted, reactive} from "vue";
import request from "../../request";
import CartTable from "./CartTable.vue";

const checkbox: any = {
  indeterminate: false,
  checkAll: true,
  checkAllGroup: []
}

const props: any = {
  multiple: true,
  expandTrigger: 'hover'
}

export default defineComponent({
  name: "General",
  components: { CartTable },
  setup(){
    const state: any = reactive({
      showSelection: true,
      refreshing: false,
      loading: true,
      outlook: [],
      tableData: [],
      abbr: [],
      mapping: {},
      selections: {},
      riskSelections: [],
      selected: {
        branch: checkbox,
        category: checkbox,
        industry: checkbox,
        classify_industry: checkbox,
        nature: checkbox,
        operation: checkbox,
        stock: checkbox,
        scale_nature: checkbox,
        style_nature: checkbox,
        scale: checkbox,
        apply: checkbox,
        redeem: checkbox,
        init_fund: checkbox
      },
      risks: {}
    })

    const getOutlook = () => {
      state.loading = true
      request.get('/overview/selections').then(r => {
        const data = r.data
        state.mapping = data.mapping
        state.selections = data.selections
        state.abbr = data.abbr
        for (let x in state.selections) {
          if (state.selections.hasOwnProperty(x)) {
            state.selected[x] = {
              indeterminate: false,
              checkAll: true,
              checkAllGroup: state.selections[x]
            }
          }
        }

        // 添加风控指标
        state.riskSelections = data.riskSelections
        for (const name in Object.keys(data.riskSelections)){
          state.risks[name] = []
        }
      })
      request.get('/overview/init').then((r: any) => {
        state.tableData = r.data
        state.loading = false
      })
    }

    onMounted(()=>{ getOutlook() })

    const handleCheckAll = (group: any) => {
      if (state.selected[group].indeterminate) {
        state.selected[group].checkAll = false;
      } else {
        state.selected[group].checkAll = !state.selected[group].checkAll;
      }
      state.selected[group].indeterminate = false;

      if (state.selected[group].checkAll) {
        state.selected[group].checkAllGroup = state.selections[group];
      } else {
        state.selected[group].checkAllGroup = [];
      }

      handleClick(group)
    }

    const checkAllGroupChange = (data: any, group: any) => {
      if (data.length === state.selections[group].length) {
        state.selected[group].indeterminate = false;
        state.selected[group].checkAll = true;
      } else if (data.length > 0) {
        state.selected[group].indeterminate = true;
        state.selected[group].checkAll = false;
      } else {
        state.selected[group].indeterminate = false;
        state.selected[group].checkAll = false;
      }

      handleClick(group)
    }

    const handleClick = (abbr: string) => {
      if (abbr === 'branch') {
        state.selected.category.checkAllGroup = []
        const selected_branch = Array.from(state.selected.branch.checkAllGroup)
        for (const x in selected_branch) {
          const b: any = selected_branch[x]
          const category = state.mapping.branch[b]
          state.selected.category.checkAllGroup.push(...category)
        }
        state.selected.category.checkAll = false
        state.selected.category.indeterminate = true
      }
    }

    const submit = () => {
      state.loading = true
      const selected = {}
      for (let key in state.selected) {
        if (state.selected.hasOwnProperty(key)) {
          selected[key] = state.selected[key].checkAllGroup
        }
      }
      request.post('/overview/selected', {data: {selected: selected, risks: state.risks}}).then(r => {
        state.tableData = r.data
        state.loading = false
      })
    }

    const refreshCache = ()=>{
      state.refreshing = true
      state.tableData = []
      state.loading = true
      request.get('/overview/refresh').then(r=>{
        state.refreshing = false
        submit()
      })
    }

    return { state, handleCheckAll, checkAllGroupChange, handleClick, props, submit, refreshCache }
  }
})

</script>

<style scoped>
@import "../../assets/css/cart.css";
</style>