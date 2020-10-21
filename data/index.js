import { assets } from "./assets";
import properties from "./properties.json";

const dataBundle = new URL("./dist/data.json", import.meta.url);

export const manifest = {
  data: "data",
  properties,
  assets: {
    data: dataBundle,
    ...assets,
  },
};
