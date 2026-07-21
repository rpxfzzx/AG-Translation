export interface ApiConfig {
  endpoint: string
  apiKey: string
  model: string
  temperature: number
}

export interface TranslationConfig {
  sourceLang: string
  targetLang: string
  mode: 'online' | 'offline' | 'auto'
}

export interface HistoryItem {
  id: string
  sourceText: string
  targetText: string
  sourceLang: string
  targetLang: string
  mode: string
  timestamp: number
}
