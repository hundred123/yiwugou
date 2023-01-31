import { createApp } from 'vue'
import router from '@/router'
// import {store} from '@/vuex'
import {createPinia} from 'pinia'
import App from './App.vue'
import { useAntd } from '@/antd'
import { useVant } from '@/vant';

const app = createApp(App)
app.config.warnHandler=()=>null
app.config.errorHandler=()=>null
useAntd(app)
useVant(app)
app.use(router)
app.use(createPinia())
// app.use(AddressEdit);
// app.use(Card);
app.mount('#app')
