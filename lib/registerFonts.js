const path = require("path");
const { GlobalFonts } = require("@napi-rs/canvas");

function registerFonts() {
  const fonts = [
    { path: "../fonts/NotoSansJP-Regular.ttf", name: "Noto Sans JP" },
  ];

  for (const font of fonts) {
    const fullPath = path.join(__dirname, font.path);
    if (!GlobalFonts.has(font.name)) {
      const loaded = GlobalFonts.registerFromPath(fullPath, font.name);
      if (!loaded) console.warn(`フォントの読み込みに失敗しました: ${font.name}`);
    }
  }
}

module.exports = registerFonts;
