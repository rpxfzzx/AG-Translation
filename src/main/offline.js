// 离线翻译引擎 - 内置词典 + 简单规则
// 完整离线翻译需要加载词典文件，这里实现基础框架

let dictionary = {};

// 内置基础中英词典示例
const builtinDict = {
  'hello': '你好',
  'world': '世界',
  'thank you': '谢谢',
  'goodbye': '再见',
  'yes': '是',
  'no': '否',
  'good': '好',
  'bad': '坏',
  'big': '大',
  'small': '小',
  'beautiful': '美丽',
  'happy': '快乐',
  'sad': '悲伤',
  'love': '爱',
  'time': '时间',
  'day': '天',
  'night': '夜晚',
  'water': '水',
  'fire': '火',
  'sun': '太阳',
  'moon': '月亮',
  'star': '星星',
  'book': '书',
  'computer': '电脑',
  'technology': '技术',
  'english': '英语',
  'chinese': '中文',
  'translation': '翻译',
  'language': '语言',
  '你好': 'hello',
  '世界': 'world',
  '谢谢': 'thank you',
  '再见': 'goodbye',
  '是': 'yes',
  '否': 'no',
  '好': 'good',
  '坏': 'bad',
  '大': 'big',
  '小': 'small',
  '美丽': 'beautiful',
  '快乐': 'happy',
  '悲伤': 'sad',
  '爱': 'love',
  '时间': 'time',
  '天': 'day',
  '夜晚': 'night',
  '水': 'water',
  '火': 'fire',
  '太阳': 'sun',
  '月亮': 'moon',
  '星星': 'star',
  '书': 'book',
  '电脑': 'computer',
  '技术': 'technology',
  '英语': 'english',
  '中文': 'chinese',
  '翻译': 'translation',
  '语言': 'language',
};

function initOfflineEngine() {
  dictionary = { ...builtinDict };
  console.log('[Offline] 离线翻译引擎初始化完成，内置词条:', Object.keys(dictionary).length);
}

function translateOffline(text, sourceLang, targetLang) {
  if (!text || text.trim() === '') {
    return { text: '', success: false, reason: 'empty' };
  }

  const trimmed = text.trim();

  // 1. 精确匹配
  const lowerText = trimmed.toLowerCase();
  if (dictionary[lowerText]) {
    return { text: dictionary[lowerText], success: true };
  }

  // 2. 逐词翻译
  const isChinese = /[\u4e00-\u9fff]/.test(trimmed);
  const words = isChinese
    ? trimmed.split('')
    : trimmed.split(/\s+/);

  const translatedWords = words.map(w => {
    const lower = w.toLowerCase().replace(/[^a-z\u4e00-\u9fff]/g, '');
    return dictionary[lower] || w;
  });

  const result = translatedWords.join('');

  // 3. 如果全部词都没翻译，返回失败
  if (result === trimmed) {
    return {
      text: result,
      success: false,
      reason: 'no_match',
      message: '未找到匹配的翻译条目，请切换到在线模式或添加词典',
    };
  }

  return { text: result, success: true };
}

module.exports = { initOfflineEngine, translateOffline };
