<template>
  <div class="industry">
    <vxe-table
        :data="data"
        size="mini"
        highlight-hover-row stripe highlight-hover-column
        border
    >
      <vxe-column field="industry" title="行业简称"></vxe-column>
      <vxe-column field="ratio" title="占净值比(%)" align="center" :formatter="formatPercent"></vxe-column>
      <vxe-column field="change" title="较上期变动(%)" align="center" :formatter="formatPercent"></vxe-column>
    </vxe-table>
    <div class="update-date">更新日期: {{date}}</div>
  </div>
</template>

<script>
import numeral from "numeral";

export default {
  name: "Industry",
  props: {
    data: Array,
    date: String
  },
  setup(props){
    const { data, date } = props

    const formatPercent = ({cellValue})=>{
      return numeral(cellValue).format('0.00%')
    }

    return {data, date , formatPercent}
  }

}
</script>

<style scoped>
.industry {
  width: 100%;
}

.update-date {
  margin-top: 20px;
  text-align: left;
  font-size: smaller;
}
</style>