import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { translateOnline } from '../api/agent'
import type { ApiConfig, TranslationConfig, HistoryItem } from '../api/types'

export const useAppStore = defineStore('app', () => {
  // ======== 状态 ========
  const apiConfig = ref<ApiConfig>({
    endpoint: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-4o-mini',
    temperature: 0.3,
  })

  const translationConfig = ref<TranslationConfig>({
    sourceLang: 'auto',
    targetLang: 'en',
    mode: 'online',
  })

  const appearance = ref({
    theme: 'light',
    fontSize: 14,
  })

  const inputText = ref('')
  const outputText = ref('')
  const isTranslating = ref(false)
  const isOnline = ref(true)
  const history = ref<HistoryItem[]>([])
  const showSettings = ref(false)
  const showHistory = ref(false)

  // ======== 计算属性 ========
  const targetLangs = computed(() => [
    { value: 'en', label: '英语' },
    { value: 'zh', label: '中文' },
    { value: 'ja', label: '日语' },
    { value: 'ko', label: '韩语' },
    { value: 'fr', label: '法语' },
    { value: 'de', label: '德语' },
    { value: 'es', label: '西班牙语' },
    { value: 'ru', label: '俄语' },
    { value: 'pt', label: '葡萄牙语' },
  ])

  const sourceLangs = computed(() => [
    { value: 'auto', label: '自动检测' },
    ...targetLangs.value,
  ])

  // ======== 方法 ========

  async function loadConfig() {
    try {
      if (window.electronAPI) {
        const saved = await window.electronAPI.storeGet('apiConfig')
        if (saved) apiConfig.value = { ...apiConfig.value, ...saved }

        const savedTrans = await window.electronAPI.storeGet('translation')
        if (savedTrans) translationConfig.value = { ...translationConfig.value, ...savedTrans }

        const savedAppearance = await window.electronAPI.storeGet('appearance')
        if (savedAppearance) appearance.value = { ...appearance.value, ...savedAppearance }

        const savedHistory = await window.electronAPI.storeGet('history')
        if (savedHistory) history.value = savedHistory
      }
    } catch (e) {
      console.error('加载配置失败:', e)
    }
  }

  async function saveApiConfig() {
    if (window.electronAPI) {
      await window.electronAPI.storeSet('apiConfig', apiConfig.value)
    }
  }

  async function saveTranslationConfig() {
    if (window.electronAPI) {
      await window.electronAPI.storeSet('translation', translationConfig.value)
    }
  }

  async function saveAppearance() {
    if (window.electronAPI) {
      await window.electronAPI.storeSet('appearance', appearance.value)
    }
  }

  async function translate() {
    if (!inputText.value.trim() || isTranslating.value) return

    isTranslating.value = true
    outputText.value = ''

    try {
      determineMode()

      if (translationConfig.value.mode === 'offline') {
        // 离线翻译
        if (window.electronAPI) {
          const result = await window.electronAPI.translateOffline(
            inputText.value,
            translationConfig.value.sourceLang,
            translationConfig.value.targetLang
          )
          outputText.value = result.text
          if (!result.success) {
            outputText.value = result.message || result.text
          }
        } else {
          outputText.value = '离线翻译引擎不可用'
        }
      } else {
        // 在线翻译 (Agent API)
        const result = await translateOnline(
          inputText.value,
          translationConfig.value.sourceLang,
          translationConfig.value.targetLang,
          apiConfig.value
        )
        outputText.value = result
      }

      // 添加到历史记录
      addHistory(inputText.value, outputText.value)

    } catch (err: any) {
      outputText.value = `翻译失败: ${err.message || '未知错误'}`

      // 如果在线模式失败且开启了 auto 模式，尝试离线
      if (translationConfig.value.mode === 'online' && window.electronAPI) {
        try {
          const fallback = await window.electronAPI.translateOffline(
            inputText.value,
            translationConfig.value.sourceLang,
            translationConfig.value.targetLang
          )
          if (fallback.success) {
            outputText.value = `[离线模式] ${fallback.text}`
          }
        } catch {}
      }
    } finally {
      isTranslating.value = false
    }
  }

  function determineMode() {
    if (translationConfig.value.mode === 'auto') {
      const online = navigator.onLine
      translationConfig.value.mode = online ? 'online' : 'offline'
      // 恢复
      setTimeout(() => {
        translationConfig.value.mode = 'auto'
      }, 100)
    }
  }

  function addHistory(source: string, target: string) {
    const item: HistoryItem = {
      id: Date.now().toString(),
      sourceText: source,
      targetText: target,
      sourceLang: translationConfig.value.sourceLang,
      targetLang: translationConfig.value.targetLang,
      mode: translationConfig.value.mode,
      timestamp: Date.now(),
    }
    history.value.unshift(item)
    // 只保留最近100条
    if (history.value.length > 100) {
      history.value = history.value.slice(0, 100)
    }
    saveHistory()
  }

  async function clearHistory() {
    history.value = []
    saveHistory()
  }

  async function saveHistory() {
    if (window.electronAPI) {
      await window.electronAPI.storeSet('history', history.value)
    }
  }

  async function checkOnlineStatus() {
    isOnline.value = navigator.onLine
  }

  return {
    apiConfig,
    translationConfig,
    appearance,
    inputText,
    outputText,
    isTranslating,
    isOnline,
    history,
    showSettings,
    showHistory,
    targetLangs,
    sourceLangs,
    loadConfig,
    saveApiConfig,
    saveTranslationConfig,
    saveAppearance,
    translate,
    clearHistory,
    checkOnlineStatus,
  }
})
