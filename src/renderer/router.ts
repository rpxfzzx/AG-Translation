import { createRouter, createMemoryHistory } from 'vue-router'
import TranslateView from './views/TranslateView.vue'
import SettingsView from './views/SettingsView.vue'
import HistoryView from './views/HistoryView.vue'

const routes = [
  { path: '/', name: 'translate', component: TranslateView, meta: { title: '翻译' } },
  { path: '/settings', name: 'settings', component: SettingsView, meta: { title: '设置' } },
  { path: '/history', name: 'history', component: HistoryView, meta: { title: '历史记录' } },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
