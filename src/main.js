import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap"
import "../src/assets/main.css"

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ToastPlugin, {
    position: 'top-right'
});

app.mount('#app')
