<template>
  <div class="title-bar" @dblclick="maximize">
    <div class="title-bar-drag">
      <span class="title-text">AG Translation</span>
      <span class="online-status" :class="{ offline: !isOnline }">
        {{ isOnline ? '在线' : '离线' }}
      </span>
    </div>
    <div class="window-controls">
      <button class="ctrl-btn" @click="minimize" title="最小化">
        <svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="5.5" width="10" height="1.5" fill="currentColor"/></svg>
      </button>
      <button class="ctrl-btn" @click="maximize" title="最大化">
        <svg width="12" height="12" viewBox="0 0 12 12"><rect x="1.5" y="1.5" width="9" height="9" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
      </button>
      <button class="ctrl-btn close-btn" @click="closeWindow" title="关闭">
        <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '../stores/app'

const store = useAppStore()
const { isOnline } = store

function minimize() {
  window.electronAPI?.minimize()
}

function maximize() {
  window.electronAPI?.maximize()
}

function closeWindow() {
  window.electronAPI?.close()
}
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
  height: 36px;
  background: var(--bg-secondary);
  -webkit-app-region: drag;
  user-select: none;
  padding: 0 8px;
  flex-shrink: 0;
}

.title-bar-drag {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 8px;
}

.title-text {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.online-status {
  font-size: 11px;
  color: #67c23a;
  background: rgba(103, 194, 58, 0.1);
  padding: 1px 6px;
  border-radius: 8px;
}

.online-status.offline {
  color: #f56c6c;
  background: rgba(245, 108, 108, 0.1);
}

.window-controls {
  display: flex;
  gap: 2px;
  -webkit-app-region: no-drag;
}

.ctrl-btn {
  width: 36px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.ctrl-btn:hover {
  background: var(--hover-bg);
}

.close-btn:hover {
  background: #e81123;
  color: white;
}
</style>
