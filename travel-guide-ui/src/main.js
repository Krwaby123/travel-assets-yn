import { createApp } from 'vue'
import App from './App.vue'
import './utils/registerServiceWorker'
import router from './router'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

const app = createApp(App)

app.config.errorHandler = (err) => {
  if (err.message && err.message.includes('ResizeObserver loop completed with undelivered notifications')) {
    return
  }
  console.error(err)
}

app.use(router).use(ElementPlus).mount('#app')
