import textChar, { baseLine } from "./text";

const borderColor = 0xffb0c67d;
const bgColorNormal = 0xff4e6d01;
const bgColorHover = 0xff719e03;
const textColor = 0xffffffff;
const fontId = 39;
const fontSize = 300;

function rect(strokeThickness, strokeColor, fillColor, width, height) {
  return {
    contours: [
      {
        fill: { kind: 0, color: strokeColor },
        vertices: [width, 0, 0, height, 0, 0, width, height],
        indices: [0, 1, 2, 1, 0, 3],
      },
      {
        fill: { kind: 0, color: fillColor },
        vertices: [
          width - strokeThickness,
          strokeThickness,
          strokeThickness,
          height - strokeThickness,
          strokeThickness,
          strokeThickness,
          width - strokeThickness,
          height - strokeThickness,
        ],
        indices: [0, 1, 2, 1, 0, 3],
      },
    ],
    bounds: [0, 0, width, height],
  };
}

export default function buttonChar(
  bundle,
  id,
  text,
  width,
  height,
  strokeThickness
) {
  bundle.shapes[id + 1] = rect(
    strokeThickness,
    borderColor,
    bgColorNormal,
    width,
    height
  );
  bundle.shapes[id + 2] = rect(
    strokeThickness,
    borderColor,
    bgColorHover,
    width,
    height
  );
  const textCharData = textChar(fontId, text, textColor, fontSize);
  bundle.staticTexts[id + 3] = textCharData;

  const textX = Math.floor((width - textCharData.bounds[2]) / 2);
  const textY = Math.floor((height - baseLine(fontId, fontSize)) / 2);

  bundle.buttons[id] = {
    trackAsMenu: false,
    characters: [
      {
        hitTest: false,
        down: false,
        over: false,
        up: true,
        characterId: id + 1,
        depth: 1,
        matrix: [1, 0, 0, 1, 0, 0],
        colorTransform: [1, 1, 1, 1, 0, 0, 0, 0],
      },
      {
        hitTest: false,
        down: true,
        over: true,
        up: true,
        characterId: id + 3,
        depth: 2,
        matrix: [1, 0, 0, 1, textX, textY],
        colorTransform: [1, 1, 1, 1, 0, 0, 0, 0],
      },
      {
        hitTest: true,
        down: true,
        over: true,
        up: false,
        characterId: id + 2,
        depth: 1,
        matrix: [1, 0, 0, 1, 0, 0],
        colorTransform: [1, 1, 1, 1, 0, 0, 0, 0],
      },
    ],
  };
}
