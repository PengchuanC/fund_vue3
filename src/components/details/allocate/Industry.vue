<template>
  <div class="industry">
    <vxe-table
        :data="data.data"
        size="mini"
        highlight-hover-row stripe highlight-hover-column
        border
    >
      <vxe-column field="industry" title="行业简称"></vxe-column>
      <vxe-column field="ratio" title="占净值比(%)" align="center" :formatter="formatPercent"></vxe-column>
      <vxe-column field="change" title="较上期变动(%)" align="center" :formatter="formatPercent"></vxe-column>
    </vxe-table>
    <div class="update-date">更新日期: {{data.date}}</div>
  </div>
</template>

<script>
import {defineComponent, onMounted, reactive} from "vue";
import numeral from "numeral";
import { fundIndustryCSI } from "../../../assets/js/api";

export default defineComponent({
  name: "Industry",
  props: {
    data: Array,
    date: String,
    secucode: String
  },
  setup(props){
    const { secucode } = props
    const data = reactive({data: [], date: ''})

    const fetch = (secucode) => {
      fundIndustryCSI(secucode).then(r=>{
        data.data = r.industry
        data.date = r.date
      })
    }

    onMounted(()=>fetch(secucode))

    const formatPercent = ({cellValue})=>{
      return numeral(cellValue).format('0.00%')
    }

    return {data, formatPercent}
  }

})
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
