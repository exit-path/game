import lib from "swf-lib";
import { ColorPickerEvent } from "../events/ColorPickerEvent";

const colorPickerWidth = 22;
const colorPickerHeight = 22;

function makeColorPickerElement(): HTMLInputElement {
  const input = document.createElement("input");
  input.type = "color";
  input.style.setProperty("width", `${colorPickerWidth}px`, "important");
  input.style.setProperty("height", `${colorPickerHeight}px`, "important");
  input.style.setProperty("padding", "0", "important");
  input.style.setProperty("margin", "0", "important");
  input.style.setProperty("border", "none", "important");
  input.style.setProperty("outline", "none", "important");
  input.style.setProperty("position", "absolute");
  return input;
}

export class ColorPicker extends lib.flash.display.DisplayObject {
  private readonly elem = makeColorPickerElement();
  private renderX: number | null = null;
  private renderY: number | null = null;
  private value = 0xffffff;

  get selectedColor() {
    return this.value;
  }
  set selectedColor(value) {
    this.value = value;
    this.elem.value = "#" + value.toString(16).padStart(6, "0");
  }

  constructor() {
    super();
    this.__node.setRenderObjects(
      [],
      Float32Array.of(0, 0, colorPickerWidth, colorPickerHeight)
    );
    this.elem.oninput = () => {
      const newValue = parseInt(this.elem.value.slice(1), 16);
      this.value = newValue;
      this.dispatchEvent(
        new ColorPickerEvent(ColorPickerEvent.CHANGE, newValue)
      );
    };
  }

  private layout() {
    this.__node.ensureLayout();
    const x = this.__node.boundsWorld[0];
    const y = this.__node.boundsWorld[1];
    if (this.renderX !== x) {
      this.elem.style.setProperty("left", `${x}px`);
      this.renderX = x;
    }
    if (this.renderY !== y) {
      this.elem.style.setProperty("top", `${y}px`);
      this.renderY = y;
    }
  }

  __onRender() {
    super.__onRender();
    this.layout();
  }

  __onAddedToStage(stage: lib.flash.display.Stage) {
    super.__onAddedToStage(stage);

    this.layout();
    stage.__canvas.container.appendChild(this.elem);
  }

  __onRemovedFromStage(stage: lib.flash.display.Stage) {
    this.elem.remove();
    this.renderX = null;
    this.renderX = null;

    super.__onRemovedFromStage(stage);
  }
}
