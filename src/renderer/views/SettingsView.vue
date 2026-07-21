<template>
  <div class="settings-view">
    <h3 class="section-title">Agent API 配置</h3>
    <p class="section-desc">配置自定义 AI 翻译接口，支持 OpenAI 兼容的 API 服务</p>

    <el-form label-width="100px" label-position="top" size="small">
      <el-form-item label="API 地址 (Endpoint)">
        <el-input v-model="store.apiConfig.endpoint" placeholder="https://api.openai.com/v1" @change="saveConfig">
          <template #append>
            <el-button @click="resetEndpoint" :disabled="!isCustom">重置</el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="API Key">
        <el-input
          v-model="store.apiConfig.apiKey"
          type="password"
          show-password
          placeholder="sk-..."
          @change="saveConfig"
        />
      </el-form-item>

      <el-form-item label="模型 (Model)">
        <el-input v-model="store.apiConfig.model" placeholder="gpt-4o-mini" @change="saveConfig">
          <template #append>
            <el-button @click="showModelPresets = !showModelPresets">预设</el-button>
          </template>
        </el-input>
        <div v-if="showModelPresets" class="model-presets">
          <el-tag
            v-for="m in modelPresets"
            :key="m"
            :type="store.apiConfig.model === m ? 'primary' : 'info'"
            class="model-tag"
            @click="selectModel(m)"
          >
            {{ m }}
          </el-tag>
        </div>
      </el-form-item>

      <el-form-item label="温度 (Temperature)">
        <el-slider
          v-model="store.apiConfig.temperature"
          :min="0"
          :max="1"
          :step="0.1"
          show-input
          input-size="small"
          @change="saveConfig"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="testConnection" :loading="testing">
          {{ testing ? '测试中...' : '测试连接' }}
        </el-button>
        <span v-if="testResult !== null" :style="{ color: testResult ? '#67c23a' : '#f56c6c', marginLeft: '8px', fontSize: '12px' }">
          {{ testResult ? '连接成功' : '连接失败' }}
        </span>
      </el-form-item>
    </el-form>

    <el-divider />

    <h3 class="section-title">翻译设置</h3>
    <el-form label-width="100px" size="small">
      <el-form-item label="默认目标语言">
        <el-select v-model="store.translationConfig.targetLang" @change="saveTransConfig">
          <el-option v-for="lang in store.targetLangs" :key="lang.value" :label="lang.label" :value="lang.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="默认模式">
        <el-radio-group v-model="store.translationConfig.mode" @change="saveTransConfig">
          <el-radio value="online">在线翻译</el-radio>
          <el-radio value="offline">离线翻译</el-radio>
          <el-radio value="auto">智能切换</el-radio>
        </el-radio-group>
        <p class="form-tip">智能模式下，有网络时自动使用在线翻译，无网络时自动切换为离线翻译</p>
      </el-form-item>
    </el-form>

    <el-divider />

    <h3 class="section-title">关于</h3>
    <div class="about-info">
      <p><strong>AG Translation</strong> v1.0.0</p>
      <p>支持在线 AI 翻译 (OpenAI 兼容 API) 和离线词典翻译</p>
      <p>平台：Windows / 鸿蒙 6.0</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '../stores/app'
import { testApiConnection } from '../api/agent'

const store = useAppStore()
const testing = ref(false)
const testResult = ref<boolean | null>(null)
const showModelPresets = ref(false)

const isCustom = ref(false)

const modelPresets = [
  'gpt-4o-mini',
  'gpt-4o',
  'gpt-4.1',
  'gpt-4.1-mini',
  'gpt-4.1-nano',
  'claude-3-5-sonnet',
  'deepseek-v3',
  'qwen-plus',
]

function saveConfig() {
  store.saveApiConfig()
}

function saveTransConfig() {
  store.saveTranslationConfig()
}

function resetEndpoint() {
  store.apiConfig.endpoint = 'https://api.openai.com/v1'
  isCustom.value = false
  saveConfig()
}

function selectModel(model: string) {
  store.apiConfig.model = model
  showModelPresets.value = false
  saveConfig()
}

async function testConnection() {
  testing.value = true
  testResult.value = null
  try {
    testResult.value = await testApiConnection(store.apiConfig)
  } catch {
    testResult.value = false
  } finally {
    testing.value = false
  }
}
</script>

<style scoped>
.settings-view {
  padding: 4px 0;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: var(--text-primary);
}

.section-desc {
  font-size: 12px;
  color: var(--text-tertiary);
  margin: 0 0 12px 0;
}

.form-tip {
  font-size: 11px;
  color: var(--text-tertiary);
  margin: 4px 0 0 0;
}

.model-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.model-tag {
  cursor: pointer;
  font-size: 11px;
}

.about-info {
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-secondary);
}

.about-info p {
  margin: 2px 0;
}
</style>
