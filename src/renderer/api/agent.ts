import axios from 'axios'
import type { ApiConfig } from './types'

const langMap: Record<string, string> = {
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

/**
 * 使用 OpenAI 兼容的 Agent API 进行翻译
 */
export async function translateOnline(
  text: string,
  sourceLang: string,
  targetLang: string,
  config: ApiConfig
): Promise<string> {
  if (!config.apiKey) {
    throw new Error('请先在设置中配置 API Key')
  }

  const sourceName = langMap[sourceLang] || sourceLang
  const targetName = langMap[targetLang] || targetLang

  // 构建翻译 prompt
  const systemPrompt = `你是一个专业的翻译助手。请将以下文本从${sourceName}翻译成${targetName}。
要求：
1. 直接返回翻译结果，不要添加任何解释或额外内容
2. 保持原文的格式和标点
3. 如果遇到专业术语，使用行业通用译法
4. 注意上下文的语气和风格`

  const userPrompt = `请翻译以下内容：\n\n${text}`

  try {
    const response = await axios.post(
      `${config.endpoint.replace(/\/+$/, '')}/chat/completions`,
      {
        model: config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: config.temperature ?? 0.3,
        max_tokens: 4096,
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    )

    const result = response.data?.choices?.[0]?.message?.content
    if (!result) {
      throw new Error('API 返回格式异常')
    }

    return result.trim()

  } catch (err: any) {
    if (err.response) {
      const status = err.response.status
      const data = err.response.data
      if (status === 401) {
        throw new Error('API Key 无效或已过期')
      } else if (status === 429) {
        throw new Error('请求过于频繁，请稍后重试')
      } else if (status === 500) {
        throw new Error('服务器内部错误')
      }
      throw new Error(data?.error?.message || `请求失败 (${status})`)
    } else if (err.code === 'ECONNABORTED') {
      throw new Error('请求超时，请检查网络或 API 地址')
    } else if (err.message?.includes('Network Error')) {
      throw new Error('网络连接失败，请检查网络或切换到离线模式')
    }
    throw err
  }
}

/**
 * 测试 API 连接
 */
export async function testApiConnection(config: ApiConfig): Promise<boolean> {
  try {
    const response = await axios.post(
      `${config.endpoint.replace(/\/+$/, '')}/chat/completions`,
      {
        model: config.model,
        messages: [
          { role: 'user', content: 'Hello' },
        ],
        max_tokens: 5,
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    )
    return !!response.data?.choices?.[0]?.message?.content
  } catch {
    return false
  }
}
