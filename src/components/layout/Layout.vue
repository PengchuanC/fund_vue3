<template>
  <ElContainer>
  <Header />
    <div class="main">
      <router-view v-slot="{ Component }">
        <keep-alive v-if="$route.meta.keepAlive">
          <component :is="Component"></component>
        </keep-alive>
        <component :is="Component" v-if="!$route.meta.keepAlive"></component>
      </router-view>
    </div>
  <ElFooter class="footer">
    <br>
    <div>
      <ElLink type="info" class="info-link" :href="am" target="_blank">野村东方国际证券-资产管理部</ElLink>
      <ElLink type="info" class="info-link" :href="service" target="_blank">客户服务平台</ElLink>
      <ElLink type="info" class="info-link" :href="manage" target="_blank">财富投管系统</ElLink>
    </div>
    <br>
    <p>Copyright © 2020 Nomura Orient International Securities Co.,Ltd. ALL RIGHTS RESERVED.</p>
    <br>
  </ElFooter>
</ElContainer>
</template>

<script>
import {defineComponent, onMounted} from "vue";
import Header from "./Header.vue";
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: "Layout",
  components: { Header },
  setup(){

    const am = 'https://www.nomuraoi-sec.com/pages/business/business_introduction.jsp?type=5'
    const service = 'https://sma.nomuraoi-sec.com'
    const manage = 'http://10.170.129.129/manage'

    return { am, service, manage }
  }
})
</script>

<style scoped>

.main {
  margin-top: 80px;
  padding: 0 20px;
}

.footer {
  margin-top: 10px;
}

.info-link:not(first-child) {
  margin-left: 30px;
}
</style>