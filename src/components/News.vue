<template>
  <div class="news">
    <div class="filter-area">
      <div class="filter-item">
        <ElInput size="mini" v-model="state.search" placeholder="关键字检索" prefix-icon="el-icon-search" style="width: 160px"></ElInput>
      </div>
      <div class="filter-item">
        <ElSelect size="mini" v-model="state.keyword" placeholder="关键字筛选" prefix-icon="el-icon-folder-opened" style="width: 160px">
          <ElOption v-for="(o, idx) in state.keywords" :label="o" :value="o" :key="`nf${String(idx)}`"></ElOption>
        </ElSelect>
      </div>
      <div class="filter-item">
        <ElDatePicker v-model="state.date" size="mini" placeholder="日期筛选" :shortcuts="shortcuts" style="width: 140px"></ElDatePicker>
      </div>
      <div class="filter-item" style="width: 30px">
        <ElSwitch active-color="#13ce66" v-model="state.showSource" style="margin-top: 4px"></ElSwitch>
      </div>
    </div>
    <ElTabs @tab-click="clickTable" :model-value="state.currentTab">
      <ElTabPane v-for="(tab, idx) in tabs" :key="'new-tab' + idx" :label="tab.label" :name="tab.name"></ElTabPane>
    </ElTabs>
    <div class="news-area">
      <div v-for="n in state.data" :key="'news'+n.id">
        <a :href="n.url" class="news-title" target="_blank">{{n.title}}</a>
        <p class="news-abstract">{{n.abstract}}</p>
        <div class="source-area" v-show="state.showSource">
          <p class="news-date">{{formatDate(n.savedate)}}</p>
          <p>{{n.source}}</p>
        </div>
        <div class="divider"></div>
        <br>
      </div>
    </div>
    <ElPagination
        layout="prev, pager, next"
        :total="state.pages"
        :current-page="state.currentPage"
        @current-change="changePage"
    ></ElPagination>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, watch} from "vue";
import dayjs from "dayjs";
import request from "../request";

const tabs = [
  {label: '全部', name: 'whole'},
  {label: '宏闻', name: 'economy'},
  {label: '金闻', name: 'finance'},
  {label: '商闻', name: 'company'},
  {label: '日闻', name: 'japan'},
]


const shortcuts = [{
  text: '今日',
  value: new Date(),
}, {
  text: '昨日',
  value: (() => {
    const date = new Date()
    date.setTime(date.getTime() - 3600 * 1000 * 24)
    return date
  })(),
}, {
  text: '上周',
  value: (() => {
    const date = new Date()
    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
    return date
  })(),
}]

export default defineComponent({
  name: "News",
  setup() {

    const state: any = reactive({
      data: [],
      date: null,
      currentTab: 'whole',
      currentPage: 1,
      keywords: [],
      keyword: null,
      search: null,
      showSource: true,
      pages: 0,
    })

    const clickTable = (tab: any) => {
      const index = tab.index
      state.currentTab = tabs[index].name
      state.keyword = null
      getNews()
    }

    const getKeywords = () => {
      request.get("/news/follow/keywords").then((resp) => {
        const data: [] = resp.data;
        state.keywords.push(...data);
      })
    }

    const getNews = ()=>{
      const params: any = {
        page: state.currentPage, section: state.keyword, date: state.date, search: state.search
      }
      if (state.keyword){
        params.section = state.keyword
      }else{
        params.section = state.currentTab
      }
      request.get('/news/newslist', {params}).then(resp=>{
        const { per_page, data, total } = resp
        state.pages = total / per_page
        state.data = data
      })
    }

    const formatDate = (date: Date) => {
      return dayjs(date).format('YYYY-MM-DD hh:mm')
    }

    const changePage = (currentPage: number)=>{
      state.currentPage = currentPage
      getNews()
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    }

    onMounted(()=>{
      getNews()
      getKeywords()
    })

    watch(()=>state.date, getNews)
    watch(()=>state.keyword, getNews)
    watch(()=>state.search, getNews)

    return { tabs, state, shortcuts, clickTable, formatDate, changePage }
  }
})

</script>

<style scoped>

.filter-area {
  display: inline-flex;
  width: 100%;
  justify-content: flex-start;
  justify-items: flex-start;
}

.filter-item {
  width: 160px;
  margin-right: 20px;
}

.news-area {
  width: 100%;
  text-align: left;
}

.news-title {
  color: #2c3e50;
  text-decoration: none;
}

.news-title:hover {
  color: #1989fa;
  text-decoration: underline;
}

.news-abstract {
  font-size: 15px;
  margin-top: 4px;
  color: rgba(0, 0, 0, 0.6);
}

.source-area {
  display: inline-flex;
  width: 100%;
  margin-top: 4px;
  font-size: 13px;
}

.divider {
  margin-top: 5px;
  border-bottom: #cccccc 1px solid;
  /*margin-bottom: 5px;*/
}

.news-date {
  margin-right: 8px;
  padding-right: 8px;
  border-right: darkgray 1px solid;
}

</style>