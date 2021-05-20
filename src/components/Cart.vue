<template>
  <ElCard  class="overview" shadow="never" body-style="padding: 0;">
    <!--筛选选项-->
    <ElRow>
      <div class="head-wrapper">
        <h4>基金筛选</h4>
      </div>
      <div class="selection-area">

        <ElTabs tab-position="top">
          <ElTabPane label="通用筛选">
            <Basic basic-url="/overview/general"/>
          </ElTabPane>
          <ElTabPane label="主动权益">
            <Basic basic-url="/overview/active"/>
          </ElTabPane>
          <ElTabPane label="被动权益">
            <Basic basic-url="/overview/negative"/>
          </ElTabPane>
          <ElTabPane label="债券基金">
            <Basic basic-url="/overview/bond"/>
          </ElTabPane>
        </ElTabs>
      </div>
    </ElRow>

    <el-backtop :bottom="100" class="up-to-top-wrapper">
      <div class="up-to-top">
        UP
      </div>
    </el-backtop>
  </ElCard>
</template>

<script>
import {defineComponent} from 'vue'
import Basic from "./cart/Basic.vue";
import General from "./cart/General.vue";


export default defineComponent({
  name: "Cart",
  components: {General, Basic },
})
</script>

<style scoped>
@import "../assets/css/cart.css";
</style>