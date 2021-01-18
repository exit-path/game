import lib from "swf-lib";
import { ColorPickerEvent } from "../events/ColorPickerEvent";

const colorPickerWidth = 22 * 20;
const colorPickerHeight = 22 * 20;

function makeColorPickerElement(): HTMLInputElement {
  const input = document.createElement("input");
  input.type = "color";
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
  private renderWidth: number | null = null;
  private renderHeight: number | null = null;
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
    const bounds = this.getBounds(this.stage);
    const canvas = this.stage.__canvas;
    const clientRect = canvas.element.getClientRects()[0];
    const width = (bounds.width * clientRect.width) / canvas.width;
    const height = (bounds.height * clientRect.height) / canvas.height;
    const x = (bounds.x * clientRect.width) / canvas.width;
    const y = (bounds.y * clientRect.height) / canvas.height;
    if (this.renderX !== x) {
      this.elem.style.setProperty("left", `${x}px`);
      this.renderX = x;
    }
    if (this.renderY !== y) {
      this.elem.style.setProperty("top", `${y}px`);
      this.renderY = y;
    }
    if (this.renderWidth !== width) {
      this.elem.style.setProperty("width", `${width}px`);
      this.renderWidth = width;
    }
    if (this.renderHeight !== height) {
      this.elem.style.setProperty("height", `${height}px`);
      this.renderHeight = height;
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
