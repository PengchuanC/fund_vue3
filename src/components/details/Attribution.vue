<template>
  <div class="attribution">
    <ElEmpty description="开发中" class="attribution"/>
  </div>
</template>

<script>
import {defineComponent} from "vue";


export default defineComponent({
  name: "Attribution",
  props: { secucode: String},
  setup(props){
    const {secucode} = props
  }
})
</script>

<style scoped>
.attribution {
  min-height: 600px;
}
</style>