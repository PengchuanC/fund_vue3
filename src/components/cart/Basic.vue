<template>
 <div v-if="state.init">
   <div class="items-wrapper" v-for="(selection, abbr) in state.selections.checkbox" :key="String(abbr)">
     <div class="target">{{ selection.label }}</div>
     <ElCheckbox
         class="checkbox" style="width: 80px"
         v-model="state.selected.checkbox[abbr].checkAll"
         :indeterminate="state.selected.checkbox[abbr].indeterminate"
         @click.prevent.native="handleCheckAll(abbr)"
     >
       不限
     </ElCheckbox>
     <ElCheckboxGroup
         class="selection-items" v-model="state.selected.checkbox[abbr].checkAllGroup"
         @change="(data)=>checkAllGroupChange(data, abbr)"
     >
         <ElCheckbox class="checkbox"  size="small" v-for="(_, name) in selection.value" :key="`${String(abbr)}${String(name)}`"
                     style="width: 180px;" :label="name">
         </ElCheckbox>
     </ElCheckboxGroup>
   </div>

   <!--风控指标-->
   <div class="items-wrapper" v-for="(item, name) in state.selections.selectors" :key="String(name)">
     <div class="target">{{item.label}}</div>
     <div class="selector-items">
       <ElCascader
           size="mini" style="width: 50%"
           :placeholder="`选择 ${item.label} ${item.peer? '同类分位': ''}，同一时间区间请勿多选`"
           v-model="state.selected.selectors[name]" :props="selectorProps" :options="item.options" clearable
       ></ElCascader>
     </div>
   </div>

   <!--提交-->
   <ElButton class="submit-button" type="success" size="small" @click="submit" :loading="state.submitting">执行筛选</ElButton>
   <ElButton class="submit-button" type="danger" size="small" @click="refreshCache" :loading="state.refreshing">刷新缓存(耗时操作)</ElButton>

   <CartTable :data="state.data" :loading="state.loading" class="data-present" v-if="!state.loading" />
   <CartTable :data="[]" v-else/>
 </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive} from "vue";
import request from '../../request'
import CartTable from "./CartTable.vue";

const checkbox = {
  indeterminate: false,
  checkAll: true,
  checkAllGroup: []
}

const selectorProps = {
  multiple: true,
  expandTrigger: 'hover'
}

export default defineComponent({
  name: "Basic",
  components: { CartTable },
  props: { basicUrl: String },
  setup(props: any){
    const state: any = reactive({
      init: false,
      selections: {checkbox: {}, selectors: {}},
      selected: {checkbox: {}, selectors: {}},
      data: [],
      loading: true,
      refreshing: false,
      submitting: false
    })

    const { basicUrl } = props

    // 初始化选项布置
    const fetchSelections = ()=>{
      request.get(basicUrl + '/selections').then((r: any)=>{
        state.selections = r.data
        const data = r.data.checkbox
        for (const attr in data) {
          if (data.hasOwnProperty(attr)){
            const groups = Object.keys(data[attr].value)
            state.selected.checkbox[attr] = {...checkbox, checkAllGroup: groups}
          }
        }

        const { selectors } = r.data
        for (const name in selectors) {
          if (selectors.hasOwnProperty(name)){
            state.selected.selectors[name] = []
          }
        }

        state.init = true
      })
    }

    onMounted(()=>{
      fetchSelections()
    })

    const handleCheckAll = (group: any) => {
      if (state.selected.checkbox[group].indeterminate) {
        state.selected.checkbox[group].checkAll = false;
      } else {
        state.selected.checkbox[group].checkAll = !state.selected.checkbox[group].checkAll;
      }
      state.selected.checkbox[group].indeterminate = false;

      if (state.selected.checkbox[group].checkAll) {
        state.selected.checkbox[group].checkAllGroup = Object.keys(state.selections.checkbox[group].value);
      } else {
        state.selected.checkbox[group].checkAllGroup = [];
      }
    }


    const checkAllGroupChange = (data: any, group: any) => {
      if (data.length === Object.keys(state.selections.checkbox[group].value).length) {
        state.selected.checkbox[group].indeterminate = false;
        state.selected.checkbox[group].checkAll = true;
      } else if (data.length > 0) {
        state.selected.checkbox[group].indeterminate = true;
        state.selected.checkbox[group].checkAll = false;
      } else {
        state.selected.checkbox[group].indeterminate = false;
        state.selected.checkbox[group].checkAll = false;
      }
    }

    const submit = ()=>{
      const checkbox = Object.keys(state.selected.checkbox).map(name=>{
        return {name: name, value: state.selected.checkbox[name].checkAllGroup }
      })

      state.loading = true
      state.submitting = true
      const params = {checkbox:checkbox, selectors: state.selected.selectors}
      request.post(basicUrl, {data: params}).then(r => {
        state.data = r.data
        state.loading = false
        state.submitting = false
      }).catch(()=>{
        state.submitting = false
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

    return { state, selectorProps, handleCheckAll, checkAllGroupChange, submit, refreshCache }
  }
})

</script>

<style scoped>
@import "../../assets/css/cart.css";
</style>