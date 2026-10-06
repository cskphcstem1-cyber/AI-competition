/** Shared bilingual labels used on Python chapter pages. */
export function pythonChrome(tx, chapterNo) {
  return {
    contents: tx("目錄", "Contents"),
    chapterN: tx(`第 ${chapterNo} 章`, `Chapter ${chapterNo}`),
    chapterContents: tx(`第 ${chapterNo} 章 目錄`, `Chapter ${chapterNo} contents`),
    quiz: tx("開始知識測驗", "Start knowledge quiz"),
    backCatalog: tx("返回章節目錄", "Back to chapter list"),
    backCatalogShort: tx("回章節目錄", "Back to chapter list"),
    examples: tx("例子", "Examples"),
    remember: tx("記住", "Remember"),
    practice: tx("練習", "Practice"),
    tip: tx("提示", "Tip"),
    doneChapter: (n) =>
      tx(`完成 · Python 第${n}章`, `Done · Python Chapter ${n}`),
  };
}
