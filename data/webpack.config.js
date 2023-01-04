const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

class ExtractDataPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("ExtractDataPlugin", (compilation) => {
      compilation.hooks.processAssets.tap("ExtractDataPlugin", () => {
        function runModule(name) {
          const code = String(compilation.getAsset(name).source.source());
          const exports = {};
          new Function("exports", code)(exports, require);
          return exports;
        }

        const dataBundle = Buffer.from(
          JSON.stringify(runModule("data.js").bundle)
        );
        const assets = runModule("assets.js").assets;

        const sizes = {};
        sizes["data"] = dataBundle.length;
        for (const [key, url] of Object.entries(assets)) {
          sizes[key] = Number(url.hash.slice(1));
        }

        for (const i of compilation.getAssets()) {
          compilation.deleteAsset(i.name);
        }
        compilation.emitAsset(
          "data.json",
          new webpack.sources.RawSource(dataBundle)
        );
        compilation.emitAsset(
          "sizes.json",
          new webpack.sources.RawSource(JSON.stringify(sizes))
        );
      });
    });
  }
}

module.exports = {
  entry: {
    data: path.resolve(__dirname, "characters"),
    assets: path.resolve(__dirname, "assets"),
  },
  target: "es5",
  devtool: false,
  output: {
    filename: "[name].js",
    libraryTarget: "commonjs",
    chunkFormat: "commonjs",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        include: [path.resolve(__dirname, "assets")],
        exclude: [path.resolve(__dirname, "assets", "index.js")],
        type: "asset/inline",
        generator: {
          dataUrl: (content) => `file://#${content.length}`,
        },
      },
    ],
  },
  plugins: [new CleanWebpackPlugin(), new ExtractDataPlugin()],
};
