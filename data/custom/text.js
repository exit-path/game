export default function textChar(fontId, text, color, size) {
  const font = require(`../characters/${fontId}.json`);
  const glyphs = [];
  let x = 0;
  const y = baseLine(fontId, size);
  for (const char of text) {
    const index = font.glyphs.findIndex((g) => g.char === char);
    const advance = (font.layout.advances[index] / 1024) * (size / 20);
    glyphs.push({
      fontId,
      color,
      x,
      y,
      size,
      index,
    });
    x += advance;
  }
  const bounds = [
    0,
    0,
    Math.ceil(x),
    Math.ceil(y + (font.layout.descent / 1024) * (size / 20)),
  ];
  return { glyphs, bounds, matrix: [1, 0, 0, 1, 0, 0] };
}

export function baseLine(fontId, size) {
  const font = require(`../characters/${fontId}.json`);
  return (font.layout.ascent / 1024) * (size / 20);
}
