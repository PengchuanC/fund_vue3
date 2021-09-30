<template>
<div class="bond">
  <vxe-table
      size="mini"
      highlight-hover-row stripe highlight-hover-column
      border
      :data="data.data"
  >
    <vxe-column field="bondcode" title="证券代码"></vxe-column>
    <vxe-column field="bondname" title="证券简称" show-overflow></vxe-column>
    <vxe-column field="ratio" title="占净值比(%)" align="center" :formatter="formatPercent"></vxe-column>
    <vxe-column field="change" title="较上期变动(%)" align="center" :formatter="formatPercent"></vxe-column>
  </vxe-table>
  <div class="update-date">更新日期: {{data.date}}</div>
</div>
</template>

<script>
import numeral from "numeral";
import {onMounted, reactive} from "vue";
import { fundKeyBond } from "../../../assets/js/api";

export default {
  name: "Bond",
  props: {
    secucode: String,
  },
  setup(props){
    const { secucode } = props

    const data = reactive({data: [], date: ''})

    const formatPercent = ({cellValue})=>{
      return numeral(cellValue).format('0.00%')
    }

    onMounted(()=>{
      fundKeyBond(secucode).then(r=>{
        data.data = r.bond
        data.date = r.date
      })
    })

    return {data, formatPercent}
  }

}
</script>

<style scoped>
.bond {
  width: 100%;
}

.update-date {
  margin-top: 20px;
  text-align: left;
  font-size: smaller;
}
</style>
