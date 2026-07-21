<template>
  <div class="history-view">
    <div class="history-header">
      <h3 class="section-title">翻译历史</h3>
      <el-button size="small" type="danger" text @click="confirmClear" v-if="store.history.length > 0">
        清空历史
      </el-button>
    </div>

    <div v-if="store.history.length === 0" class="empty-state">
      <p>暂无翻译历史记录</p>
    </div>

    <div v-else class="history-list">
      <div
        v-for="item in store.history"
        :key="item.id"
        class="history-item"
        @click="reuseTranslation(item)"
      >
        <div class="history-meta">
          <span class="lang-badge">{{ getLangLabel(item.sourceLang) }} → {{ getLangLabel(item.targetLang) }}</span>
          <span class="mode-badge" :class="item.mode">
            {{ item.mode === 'online' ? '在线' : item.mode === 'offline' ? '离线' : '智能' }}
          </span>
          <span class="history-time">{{ formatTime(item.timestamp) }}</span>
        </div>
        <div class="history-source">{{ item.sourceText }}</div>
        <div class="history-target">{{ item.targetText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { useAppStore } from '../stores/app'
import { useRouter } from 'vue-router'
import type { HistoryItem } from '../api/types'

const store = useAppStore()
const router = useRouter()

const langLabels: Record<string, string> = {
  auto: '自动检测',
  en: '英语',
  zh: '中文',
  ja: '日语',
  ko: '韩语',
  fr: '法语',
  de: '德语',
  es: '西班牙语',
  ru: '俄语',
  pt: '葡萄牙语',
}

function getLangLabel(code: string): string {
  return langLabels[code] || code
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function reuseTranslation(item: HistoryItem) {
  store.inputText = item.sourceText
  store.outputText = item.targetText
  store.translationConfig.sourceLang = item.sourceLang
  store.translationConfig.targetLang = item.targetLang
  router.push('/')
}

async function confirmClear() {
  try {
    await ElMessageBox.confirm('确定清空所有翻译历史记录吗？', '确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    store.clearHistory()
  } catch {}
}
</script>

<style scoped>
.history-view {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  overflow-y: auto;
}

.history-item {
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.history-item:hover {
  background: var(--hover-bg);
}

.history-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  font-size: 11px;
}

.lang-badge {
  background: var(--accent-bg);
  color: var(--accent-color);
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.mode-badge {
  padding: 1px 6px;
  border-radius: 4px;
}

.mode-badge.online {
  background: rgba(103, 194, 58, 0.1);
  color: #67c23a;
}

.mode-badge.offline {
  background: rgba(144, 147, 153, 0.1);
  color: #909399;
}

.history-time {
  color: var(--text-tertiary);
  margin-left: auto;
}

.history-source {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-target {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
