<template>
  <ElHeader class="header">
    <ElMenu :default-active="activeIndex" class="menu" mode="horizontal" @select="selectMenu">
      <ElMenuItem index="home" class="menu-item"><i class="el-icon-reading"></i>首页</ElMenuItem>
      <ElMenuItem index="cart" class="menu-item"><i class="el-icon-shopping-cart-2"></i>基金挑选</ElMenuItem>
      <ElMenuItem index="dashboard" class="menu-item"><i class="el-icon-trophy-1"></i>基金看板</ElMenuItem>
      <ElSubmenu index="3">
        <template #title><i class="el-icon-files"></i>基金入池</template>
        <ElMenuItem index="3-1">分类统计</ElMenuItem>
        <ElMenuItem index="screen">基金筛选</ElMenuItem>
      </ElSubmenu>
      <ElMenuItem index="portfolio" class="menu-item"><i class="el-icon-data-line"></i>组合管理</ElMenuItem>
      <ElMenuItem index="news" class="menu-item"><i class="el-icon-tickets"></i>热门新闻</ElMenuItem>

      <ElSelect
          size="mini"
          class="search-bar"
          prefix-icon="el-icon-search"
          clearable
          filterable
          reserve-keyword
          placeholder="输入基金代码或简称"
          v-model="searchText"
          remote
          :remote-method="onChange"
          @change="onSelect"
      >
        <ElOption v-for="(row, idx) in searchOptions" :label="row.label" :value="idx" :key="`search${String(idx)}`"
        >
          <span style="float: left">{{ row.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ row.value }}</span>
        </ElOption>
      </ElSelect>
    </ElMenu>
  </ElHeader>
</template>

<script lang="ts">
import {onMounted, ref} from "vue";
import {useRouter} from 'vue-router'
import request from "../../request";
import Storage from "../../assets/js/storage";

export default {
  name: "Header",
  setup() {
    const activeIndex = ref('home')
    const router = useRouter()
    const searchText: any = ref(null)
    const searchOptions: any = ref([])
    const index = ref(0)

    const selectMenu = (index: string) => {
      sessionStorage.setItem('basicRoute', index)
      router.push({name: index})
    }

    onMounted(()=>{
      const basicRoute = sessionStorage.getItem('basicRoute') || 'home'
      activeIndex.value = basicRoute.toString()
      searchOptions.value = Storage.loadSearchHistory()
    })

    const onChange = (search: string)=>{
      request.post('/search/fundlist', {data: {search}}).then((r: any)=>{
        searchOptions.value = r.map((x: any) => {
          return {label: x[1], value: x[0]}
        })
      })
    }

    const onSelect = ()=>{
      if (searchText.value !== null){
        const selected = searchOptions.value[searchText.value]
        if (selected){
          Storage.saveSearchHistory(selected)
          searchOptions.value = Storage.loadSearchHistory()
          router.push({name: 'info', params: {secucode: selected.value}})
        }
      }
    }

    return {
      activeIndex, selectMenu, searchText, onChange, searchOptions, onSelect, index
    }
  }
}
</script>

<style scoped>

.header {
  position: fixed;
  width: 100%;
  z-index: 100;
  padding: 0;
}

.menu {
  width: 100%;
  height: inherit;
  display: inline-flex;
  top: 0;
  left:0;
  position: fixed;
}

.menu-item:first-child {
  margin-left: 30px;
}

.search-bar {
  width: 250px;
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
}
</style>