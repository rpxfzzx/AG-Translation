<template>
  <div class="app-container" :style="{ fontSize: `${appearance.fontSize}px` }">
    <TitleBar />
    <div class="app-content">
      <router-view />
    </div>
    <NavBar />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from './stores/app'
import TitleBar from './components/TitleBar.vue'
import NavBar from './components/NavBar.vue'

const store = useAppStore()
const { appearance } = store

onMounted(async () => {
  await store.loadConfig()
  store.checkOnlineStatus()
  window.addEventListener('online', () => store.checkOnlineStatus())
  window.addEventListener('offline', () => store.checkOnlineStatus())
})
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.app-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}
</style>
