import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'

import App from './App.vue'
import router from './router'

import "v-calendar/dist/style.css";
import VCalendar from "v-calendar";

import io from 'socket.io-client';

const socket = io('http://localhost:3000');


const app = createApp(App)
app.config.globalProperties.$socket = socket;
app.use(VCalendar, {});
app.use(vuetify)
app.use(createPinia())
app.use(router)

app.mount('#app')
