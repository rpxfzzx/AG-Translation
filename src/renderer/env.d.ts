/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Window {
  electronAPI: {
    storeGet: (key: string) => Promise<any>
    storeSet: (key: string, value: any) => Promise<void>
    minimize: () => void
    maximize: () => void
    close: () => void
    isOnline: () => Promise<boolean>
    translateOffline: (text: string, source: string, target: string) => Promise<{ text: string; success: boolean; reason?: string; message?: string }>
    clipboardWrite: (text: string) => Promise<void>
    clipboardRead: () => Promise<string>
    openExternal: (url: string) => void
  }
}
