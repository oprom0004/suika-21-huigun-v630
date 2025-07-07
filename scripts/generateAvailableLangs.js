 // 自动生成页面-语言可用性映射表
const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '../app');
const langDirs = ['ja', 'fr', 'es', 'pt', 'de', 'nl'];
const mainLang = 'en';

// 获取所有一级页面目录（不含多语言目录和components等）
const allDirs = fs.readdirSync(appDir).filter(
  d => fs.statSync(path.join(appDir, d)).isDirectory() && !langDirs.includes(d) && d !== 'components'
);

// 获取所有页面名（如 contact, about, games-like-suika ...）
const pageNames = allDirs.filter(
  d => fs.existsSync(path.join(appDir, d, 'page.tsx'))
);

const availableLangsForPage = {};

// 主语言页面
pageNames.forEach(page => {
  const langs = [mainLang];
  langDirs.forEach(lang => {
    if (fs.existsSync(path.join(appDir, lang, page, 'page.tsx'))) {
      langs.push(lang);
    }
  });
  availableLangsForPage[`/${page}`] = langs;
});

// 首页特殊处理
const homeLangs = [mainLang, ...langDirs.filter(lang => fs.existsSync(path.join(appDir, lang, 'page.tsx')))];
availableLangsForPage['/'] = homeLangs;

// 写入文件
const output = `// 自动生成的页面-语言可用性映射表\nexport const availableLangsForPage = ${JSON.stringify(availableLangsForPage, null, 2)} as const;\n`;
fs.writeFileSync(path.join(appDir, 'availableLangs.ts'), output);

console.log('availableLangs.ts 已生成！');