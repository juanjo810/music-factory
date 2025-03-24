import { createApp } from 'vue'
import App from './App.vue'
import { loadFonts } from './plugins/webfontloader'
import { registerPlugins } from '@/plugins'

loadFonts()

const app = createApp(App)
registerPlugins(app)

app.mount('#app')
