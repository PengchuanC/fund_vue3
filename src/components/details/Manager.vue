<template>
  <div class="manager">
    <h4>现任基金经理</h4>
    <div class="row">
      <div class="col">
        <ElDescriptions :column="3" title="任职信息" border>
          <ElDescriptionsItem label="基金经理">
            {{ state.manager.manager }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="任职日期">
            {{ state.manager.start }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="管理规模">
            {{ state.manager.managed_scale }}亿元
          </ElDescriptionsItem>
        </ElDescriptions>
        <vxe-grid
            class="table"
            border auto-resize stripe highlight-hover-row size="mini"
            :columns="columns"
            :data="state.managed"
        ></vxe-grid>
      </div>
      <div class="col"></div>
    </div>
  </div>
</template>

<script>
import request from "../../request";
import {onMounted, reactive} from "vue";
import numeral from "numeral";

const columns = [
  {
    type: 'seq',
    width: 50,
    align: 'center'
  },
  {
    title: '基金代码',
    field: 'secucode',
    align: 'center'
  },
  {
    title: '基金简称',
    field: 'secuabbr',
    align: 'left',
    showOverflow: true
  },
  {
    title: '基金类型',
    field: 'classify',
    align: 'left',
    showOverflow: true
  },
  {
    title: '成立日期',
    field: 'launch',
    align: 'center',
  },
  {
    title: '任职日期',
    field: 'serve_date',
    align: 'center',
  },
  {
    title: '基金规模(亿元)',
    field: 'scale',
    align: 'right',
    formatter: (row) => numeral(row.cellValue).format('0,000.0'),
  },
  {
    title: '任职回报(%)',
    field: 'return',
    align: 'right'
  },
  {
    title: '任职同类排名',
    field: 'rank',
    align: 'right'
  }
  ]

export default {
  name: "Manager",
  props: {secucode: String},
  setup(props){
    const { secucode } = props

    const state = reactive({
      manager: { manager: null, managed_scale: 0, start: null},
      managed: []
    })

    const fetchFactManager = ()=>{
      request.get("/manager", {params: {secucode: secucode}}).then((resp) => {
        state.manager = resp
      })
    }

    const fetchManagerManaged = ()=>{
      request.get("/manager/managed", {params: {secucode: secucode}}).then((resp) => {
        state.managed = resp
      })
    }

    onMounted(()=>{
      fetchManagerManaged()
      fetchFactManager()
    })

    return { state, columns }
  }
}
</script>

<style scoped>

.manager {
  min-height: 600px;
}

.row {
  display: inline-flex;
  width: 100%;
}

.col {
  width: 100%;
  flex: 12;
  padding: 10px;
}

.table {
  margin-top: 10px;
}

</style>