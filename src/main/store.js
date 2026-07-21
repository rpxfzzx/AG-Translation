const fs = require('fs');
const path = require('path');
const { app } = require('electron');

let storeData = {};
let storePath = '';

const defaultConfig = {
  // Agent API 配置
  apiConfig: {
    endpoint: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-4o-mini',
    temperature: 0.3,
  },
  // 翻译设置
  translation: {
    sourceLang: 'auto',
    targetLang: 'en',
    mode: 'online', // 'online' | 'offline' | 'auto'
  },
  // 界面设置
  appearance: {
    theme: 'light',
    fontSize: 14,
  },
  // 历史记录
  history: [],
};

function initStore() {
  const userDataPath = app.getPath('userData');
  storePath = path.join(userDataPath, 'ag-translation-config.json');

  try {
    if (fs.existsSync(storePath)) {
      const raw = fs.readFileSync(storePath, 'utf-8');
      storeData = { ...defaultConfig, ...JSON.parse(raw) };
    } else {
      storeData = { ...defaultConfig };
      saveStore();
    }
  } catch (err) {
    console.error('Store init error:', err);
    storeData = { ...defaultConfig };
  }
}

function saveStore() {
  try {
    fs.writeFileSync(storePath, JSON.stringify(storeData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Store save error:', err);
  }
}

function getStore(key) {
  return key ? storeData[key] : storeData;
}

function setStore(key, value) {
  storeData[key] = value;
  saveStore();
}

module.exports = { initStore, getStore, setStore };
