<template>
  <div>
    <ElTabs v-model="activeName">
      <ElTabPane label="资金概览" name="outlook" :lazy="true">
        <ETFHome />
      </ElTabPane>
      <ElTabPane label="分类统计" name="category" :lazy="true">
        <ETFCategory />
      </ElTabPane>
      <ElTabPane label="近期情况" name="latest" :lazy="true">
        <ETFRecent />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script>
import {defineComponent, ref} from "vue";
import ETFHome from "./ETFHome.vue";
import ETFCategory from "./ETFCategory.vue";
import ETFRecent from "./ETFRecent.vue";

export default defineComponent({
  name: "ETFLayout",
  components: {ETFRecent, ETFCategory, ETFHome},
  setup(){
    const activeName = ref('outlook')

    return { activeName }
  }

})
</script>

<style scoped>

</style>