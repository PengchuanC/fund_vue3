<template>
  <div class="row">
    <div class="col">
      <Managed :secucode="secucode" />
    </div>
    <div class="col">
    </div>
  </div>
</template>

<script>
import Managed from "./manager/Managed.vue";

export default {
  name: "Manager",
  components: {Managed},
  props: {secucode: String},
  setup(props){
    const { secucode } = props

    return { secucode }
  }
}
</script>

<style scoped>

.row {
  display: inline-flex;
  width: 100%;
}

.col {
  width: 50%;
  height: 100%;
}

</style>
