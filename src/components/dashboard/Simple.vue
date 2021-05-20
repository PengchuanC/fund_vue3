<template>
  <ElCard class="card">
    <div class="tags-group">
      <ElTag effect="plain" size="small" class="tag">{{ year }}</ElTag>
      <ElTag effect="plain" size="small" class="tag" type="warning">{{ style }}</ElTag>
      <ElTag effect="plain" size="small" class="tag" type="success">{{ industry }}</ElTag>
    </div>
    <hr class="divider">
    <vxe-grid
        border
        size="mini"
        height="216"
        :columns="columns"
        :data="tableData"
    ></vxe-grid>
    <ElTooltip class="expanded" placement="top" content="点击查看全部同类基金">
      <i class="el-icon-full-screen" @click="show"></i>
    </ElTooltip>
  </ElCard>
</template>

<script>
import numeral from "numeral";

export default {
  name: "Simple",
  props: {
    index: Number,
    data: Object
  },
  setup(props, {emit}){
    const columns = [
      {
        type: 'seq',
        width: 30
      },
      {
        title: '基金名称',
        field: 'secuabbr',
        showOverflow: true
      },
      {
        title: '基金经理',
        field: 'manager'
      },
      {
        title: '区间涨跌',
        field: 'change',
        align: 'right',
        formatter: (row) => numeral(row.cellValue).format('0.00')
      }
    ]

    const { index, data } = props

    const { year, style, industry } = data
    const tableData = data.data

    const show = ()=>{
      emit('show', index)
    }

    return {columns, show, year, style, industry, tableData }
  }
}
</script>

<style scoped>

.card {
  position: relative;
  width: 400px;
  height: 320px;
  margin-right: 10px;
  margin-bottom: 5px;
}

.tags-group {
  display: inline-flex;
  width: 100%;
  justify-content: flex-start;
}

.tag {
  margin-right: 5px;
}

.divider {
  border-top: 2px dashed #cccccc;
  margin-bottom: 10px;
  margin-top: 5px;
}

.title {
  height: 30px;
  width: calc(100% - 20px);
  padding-bottom: 10px;
  border-bottom: 1px dashed #cccccc;
  margin: auto;
  text-align: left;
}

.expanded {
  position: absolute;
  bottom: 5px;
  right: 10px;
  height: 20px;
  width: 20px;
}
</style>