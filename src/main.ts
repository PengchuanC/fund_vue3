import { createApp } from 'vue'
import element from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import vxe from 'vxe-table'
import 'vxe-table/lib/style.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.use(element, { locale })
app.use(vxe)

app.mount('#app')
