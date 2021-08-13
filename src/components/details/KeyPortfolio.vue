<template>
  <TopHolding :secucode="secucode" />
  <hr class="divider">
  <div class="history">
    <h4 class="text-left">任职以来重仓股票概览</h4>
    <div class="reports" v-if="state.show">
      <div class="layout">
        <div>
          <div class="header">名次/报告期</div>
          <div v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" :key="i" class="header-cell">
            {{i}}
          </div>
          <div class="header-cell">占权益仓位比例</div>
        </div>
        <div v-for="(rows, date) in state.reports" :key="String(date)">
          <div class="title">{{date}}</div>
          <div
              v-for="(row, idx) in rows"
              :key="String(idx)" class="cell"
              :title="(row.ratio*100).toFixed(2)+'%'"
              :style="{backgroundColor: state.color[row.stockname]}">
            {{row.stockname}}
          </div>
          <div style="height: 20px; line-height: 20px; font-size: 14px;">{{sum(rows)}}</div>
        </div>
      </div>
      <br>
      <div class="summary">
        <p>总结:</p>
        <p>{{state.msg}}</p>
      </div>
      <br>
      <div>
        <div class="table-wrapper">
          <div v-for="(r, idx) in state.reports" :key="`table${String(idx)}`">
            <p class="table-title">{{idx}}</p>
            <div class="table-wrapper">
              <p class="table-item">股票名称</p>
              <p class="table-item">占净值比</p>
            </div>
            <div v-for="(s, idx2) in r" :key="`${String(idx)}${String(idx2)}`" class="table-wrapper">
              <p class="table-item">{{s.stockname}}</p>
              <p class="table-item">{{numeral(s.ratio).format('0.00%')}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <ElEmpty description="基金类型不适用" class="empty"/>
    </div>
  </div>
</template>

<script lang="ts">
import {onMounted, reactive} from 'vue';
import numeral from "numeral";
import request from "../../request";
import TopHolding from "./manager/TopHolding.vue";

export default {
  name: "KeyPortfolio",
  components: {TopHolding},
  props: {secucode: String},
  setup(props: any){
    const { secucode } = props


    const state: any = reactive({
      reports: [],
      color: {},
      msg: '',
      show: true
    })

    const fetch = ()=>{
      request.get('/reports', {params: {secucode}}).then((r: any)=>{
        const { reports, color, msg } = r
        state.reports = reports
        state.color = color
        state.msg = msg
      }).catch(()=>{
        state.show = false
      })
    }

    const sum = (rows: any) => {
      let _sum = 0
      for (let i in rows) {
        _sum += rows[i]['ratio']
      }
      return numeral(_sum).format('0.00%')
    }

    onMounted(fetch)


    return { state, sum, numeral, secucode }
  }
}
</script>

<style scoped>
.text-left {
  text-align: left;
  margin-left: 10px;
}

.divider {
  margin: 20px 5px;
  border: none;
  border-top: lightgray dashed 2px;
}

.history {
  width: 100%;
  overflow-x: auto;
}

.reports {
  padding-left: 20px;
  padding-top: 10px;
}

.layout {
  display: inline-flex;
  justify-content: center;
}

.title {
  font-size: medium;
  font-weight: bold;
  /*width: 150px;*/
  text-align: center;
  background-color: #FAFAFA;
  padding: 5px 15px 5px 15px;
}

.cell {
  color: white;
  cursor: pointer;
  font-size: 14px;
  height: 20px;
}

.header {
  font-size: medium;
  font-weight: bold;
  width: 120px;
  text-align: center;
  background-color: #FAFAFA;
  padding: 5px 15px 5px 15px;
}

.header-cell {
  background-color: #FAFAFA;
  font-size: 14px;
  height: 20px;
}

.summary {
  width: fit-content;
  text-align: left;
  margin: auto;
}

.table-wrapper {
  display: flex;
  width: fit-content;
  text-align: center;
  margin: auto;
  border: 1px solid #e9e9e9;
}

.table-item {
  overflow: hidden;
  width: 60px;
  height: 24px;
  line-height: 24px;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.table-item:hover {
  text-overflow: initial;
}

.table-title {
  height: 30px;
  border: 1px solid #e9e9e9;
  line-height: 30px;
  font-size: 16px;
}

.table-item:nth-child(odd){
  width: 65px;
  border-right: 1px solid #e9e9e9;
}

.table-item:nth-child(even){
  border-left: 1px solid #e9e9e9;
}

.empty {
  min-height: 600px;
}
</style>
