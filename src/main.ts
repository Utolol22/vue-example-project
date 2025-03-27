import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './components/App.vue'
import router from './router'
import axios from 'axios'

import './assets/style/app.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

// Importation des plugins
import authPlugin from './plugins/auth'

// Configuration d'Axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || ''

const app = createApp(App)

// Utilisation des plugins
app.use(createPinia())
app.use(router)
app.use(authPlugin)

// Attacher l'instance Vue à window pour accès global (comme dans l'ancienne version)
app.config.globalProperties.axios = axios
app.mount('#app')

// Exposer l'instance Vue globalement (pour compatibilité)
window.vueApp = app