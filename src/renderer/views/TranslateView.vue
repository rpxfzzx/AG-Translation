<template>
  <div class="translate-view">
    <!-- 模式选择 -->
    <div class="mode-bar">
      <el-radio-group v-model="translationConfig.mode" size="small" @change="saveTranslationConfig">
        <el-radio-button value="online">在线翻译</el-radio-button>
        <el-radio-button value="offline">离线翻译</el-radio-button>
        <el-radio-button value="auto">智能模式</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 语言选择 -->
    <div class="lang-bar">
      <el-select
        v-model="translationConfig.sourceLang"
        size="small"
        style="width: 120px"
        @change="saveTranslationConfig"
      >
        <el-option
          v-for="lang in sourceLangs"
          :key="lang.value"
          :label="lang.label"
          :value="lang.value"
        />
      </el-select>

      <button class="swap-btn" @click="swapLangs" title="交换语言">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M7 16l-4-4 4-4"/><path d="M17 8l4 4-4 4"/><path d="M3 12h18"/>
        </svg>
      </button>

      <el-select
        v-model="translationConfig.targetLang"
        size="small"
        style="width: 120px"
        @change="saveTranslationConfig"
      >
        <el-option
          v-for="lang in targetLangs"
          :key="lang.value"
          :label="lang.label"
          :value="lang.value"
        />
      </el-select>
    </div>

    <!-- 输入区域 -->
    <div class="input-area">
      <el-input
        v-model="inputText"
        type="textarea"
        :rows="5"
        placeholder="输入要翻译的文本..."
        resize="none"
        @keydown.ctrl.enter="translate"
        @keydown.meta.enter="translate"
      />
      <div class="input-actions">
        <span class="char-count">{{ inputText.length }} 字符</span>
        <div class="action-right">
          <el-button size="small" @click="pasteFromClipboard" :disabled="!isOnline">
            粘贴
          </el-button>
          <el-button size="small" @click="clearInput" v-if="inputText">
            清空
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="translate"
            :loading="isTranslating"
            :disabled="!inputText.trim()"
          >
            {{ isTranslating ? '翻译中...' : '翻译 (Ctrl+Enter)' }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 输出区域 -->
    <div class="output-area" v-if="outputText">
      <div class="output-header">
        <span class="output-label">翻译结果</span>
        <div class="output-actions">
          <el-button size="small" text @click="copyResult" title="复制结果">
            {{ copied ? '已复制' : '复制' }}
          </el-button>
          <el-button size="small" text @click="clearOutput" title="清空">
            清空
          </el-button>
        </div>
      </div>
      <div class="output-content" @click="selectAll">
        {{ outputText }}
      </div>
    </div>

    <!-- 离线提示 -->
    <div class="offline-banner" v-if="!isOnline">
      <el-alert title="当前处于离线状态，将使用离线翻译功能" type="warning" :closable="false" show-icon />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '../stores/app'

const store = useAppStore()
const {
  inputText,
  outputText,
  isTranslating,
  isOnline,
  translationConfig,
  sourceLangs,
  targetLangs,
  translate,
  saveTranslationConfig,
} = store

const copied = ref(false)

function swapLangs() {
  if (translationConfig.sourceLang === 'auto') return
  [translationConfig.sourceLang, translationConfig.targetLang] = [
    translationConfig.targetLang,
    translationConfig.sourceLang,
  ]
  saveTranslationConfig()
}

function clearInput() {
  inputText.value = ''
}

function clearOutput() {
  outputText.value = ''
}

async function pasteFromClipboard() {
  if (window.electronAPI) {
    const text = await window.electronAPI.clipboardRead()
    if (text) inputText.value = text
  }
}

async function copyResult() {
  if (outputText.value) {
    if (window.electronAPI) {
      await window.electronAPI.clipboardWrite(outputText.value)
    }
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}

function selectAll(e: MouseEvent) {
  const target = e.target as HTMLElement
  const range = document.createRange()
  range.selectNodeContents(target)
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
}
</script>

<style scoped>
.translate-view {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mode-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 4px;
}

.lang-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.swap-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 28px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-secondary);
}

.swap-btn:hover {
  background: var(--hover-bg);
  color: var(--accent-color);
}

.input-area {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-area :deep(.el-textarea__inner) {
  font-family: inherit;
  line-height: 1.6;
  min-height: 100px;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  font-size: 12px;
  color: var(--text-tertiary);
}

.action-right {
  display: flex;
  gap: 6px;
}

.output-area {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.output-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.output-actions {
  display: flex;
  gap: 4px;
}

.output-content {
  padding: 12px;
  font-size: 1em;
  line-height: 1.8;
  color: var(--text-primary);
  word-break: break-word;
  cursor: text;
  max-height: 200px;
  overflow-y: auto;
}

.offline-banner {
  margin-top: 4px;
}
</style>
