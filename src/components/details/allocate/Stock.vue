<template>
  <div class="stock">
    <vxe-table
        :data="data.data"
        size="mini"
        highlight-hover-row stripe highlight-hover-column
        border
    >
      <vxe-column field="stockcode" title="证券代码"></vxe-column>
      <vxe-column field="stockname" title="证券简称"></vxe-column>
      <vxe-column field="ratio" title="占净值比(%)" align="center" :formatter="formatPercent"></vxe-column>
      <vxe-column field="change" title="较上期变动(%)" align="center" :formatter="formatPercent"></vxe-column>
      <vxe-column field="pe_ttm" title="PE_TTM" align="center" :formatter="formatFloat"></vxe-column>
      <vxe-column field="pb" title="PB" align="center" :formatter="formatFloat"></vxe-column>
    </vxe-table>
    <div class="update-date">更新日期: {{data.date}}</div>
  </div>
</template>

<script>
import numeral from "numeral";
import { onMounted, reactive } from "vue";
import { fundKeyStock } from "../../../assets/js/api";

export default {
  name: "Stock",
  props: {
    secucode: String
  },
  setup(props){
    const { secucode } = props

    const data = reactive({data: [], date: ''})

    const formatPercent = ({cellValue})=>{
      return numeral(cellValue).format('0.00%')
    }

    const formatFloat = ({cellValue})=>{
      return numeral(cellValue).format('0.00')
    }

    onMounted(()=>{
      fundKeyStock(secucode).then(r=>{
        data.data = r.stock
        data.date = r.date
      })
    })

    return {data, formatPercent, formatFloat}
  }
}
</script>

<style scoped>
.stock {
  width: 100%;
}

.update-date {
  margin-top: 20px;
  text-align: left;
  font-size: smaller;
}
</style>
