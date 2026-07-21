/**
 * 鸿蒙 6.0 平台适配层
 * 
 * 鸿蒙 6.0 使用 ArkUI (声明式 UI) + WebView 加载 Vue 前端
 * 该文件提供鸿蒙平台特有的 API 接口
 * 
 * 部署方式：
 * 1. Vite 构建 dist/ 目录
 * 2. 鸿蒙项目将 dist/ 作为 WebView 资源加载
 * 3. 鸿蒙原生通过 JS Bridge 注入 window.harmonyAPI
 * 4. 本适配层自动检测平台，使用合适的 API
 */

// 鸿蒙平台检测
export const isHarmony = typeof window !== 'undefined' && (
  (window as any).harmony !== undefined ||
  (window as any).__harmony__ === true
)

// 鸿蒙 API 接口
interface HarmonyAPI {
  // 本地存储
  getStorage(key: string): Promise<string | null>
  setStorage(key: string, value: string): Promise<void>
  
  // 网络检测
  getNetworkType(): Promise<string>
  
  // 翻译
  translate(text: string, source: string, target: string, config?: any): Promise<string>
  
  // 剪贴板
  setClipboard(text: string): Promise<void>
  getClipboard(): Promise<string>
  
  // 窗口
  minimize(): void
  maximize(): void
  close(): void
  
  // 打开链接
  openUrl(url: string): void
}

// 获取平台 API
export function getPlatformAPI(): HarmonyAPI | null {
  if (isHarmony) {
    return (window as any).harmonyAPI || null
  }
  // Electron 环境通过 preload 提供 electronAPI
  if ((window as any).electronAPI) {
    const api = (window as any).electronAPI
    return {
      getStorage: async (key: string) => api.storeGet(key),
      setStorage: async (key: string, value: string) => api.storeSet(key, value),
      getNetworkType: () => api.isOnline().then((online: boolean) => online ? 'wifi' : 'none'),
      translate: async (text: string, source: string, target: string) => {
        const result = await api.translateOffline(text, source, target)
        return result.text
      },
      setClipboard: (text: string) => api.clipboardWrite(text),
      getClipboard: () => api.clipboardRead(),
      minimize: () => api.minimize(),
      maximize: () => api.maximize(),
      close: () => api.close(),
      openUrl: (url: string) => api.openExternal(url),
    }
  }
  return null
}
