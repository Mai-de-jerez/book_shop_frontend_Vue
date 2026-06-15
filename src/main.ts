import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
//app.use(Toast)
app.use(Toast, {
  timeout: 1500,
  closeOnClick: true,
  pauseOnHover: false,
})
app.mount('#app')
