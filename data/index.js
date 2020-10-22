import { assets } from "./assets";
import sizes from "./dist/sizes.json";
import properties from "./properties.json";

const dataBundle = new URL("./dist/data.json", import.meta.url);
assets["data"] = dataBundle;

for (const [key, url] of Object.entries(assets)) {
  assets[key] = { url, size: sizes[key] };
}

export const manifest = {
  data: "data",
  properties,
  assets,
};
