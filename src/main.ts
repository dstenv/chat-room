import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vantUI from './utils/vantUI'
import XHeader from '@/components/XHeader/index.vue'
import piniaPluginPersist from 'pinia-plugin-persist'
// import 'uno.css'
import 'vant/lib/index.css'
import './style/common.scss'

const app = createApp(App)

app.use(createPinia().use(piniaPluginPersist))
app.use(router)
app.use(vantUI)
app.component('XHeader', XHeader)

app.mount('#app')
