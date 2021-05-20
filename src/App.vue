<template>
  <Layout></Layout>
</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue'
import Layout from "./components/layout/Layout.vue";

export default defineComponent({
  name: 'App',
  components: {Layout},
  setup(){
    onMounted(()=>{
      console.info("%c高山仰止,景行行止\n虽不能至,心向往之", "color: green")
    })
  }
})
</script>

<style>
#app {
  font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-thumb{
  border-radius: 5px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background-color: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background-color: #ededed;
}

</style>
