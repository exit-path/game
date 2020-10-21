const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

class ExtractDataPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("ExtractDataPlugin", (compilation) => {
      compilation.hooks.processAssets.tap("ExtractDataPlugin", () => {
        const bundle = compilation.getAsset("data.js");
        const code = String(bundle.source.source());
        const exports = {};
        new Function("exports", code + "")(exports);

        compilation.deleteAsset("data.js");
        compilation.emitAsset(
          "data.json",
          new webpack.sources.RawSource(JSON.stringify(exports.bundle))
        );
      });
    });
  }
}

const config = {
  entry: {
    data: path.resolve(__dirname, "characters"),
    index: { import: path.resolve(__dirname, "index.js"), depend: "data" },
  },
  target: "node",
  devtool: false,
  output: {
    filename: "index.js",
    library: "manifest",
    libraryTarget: "commonjs",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpeg|mp3)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "assets",
              publicPath: (u) => path.basename(u),
            },
          },
        ],
      },
    ],
  },
  plugins: [new CleanWebpackPlugin(), new ExtractDataPlugin()],
};

module.exports = [
  {
    name: "data",
    entry: path.resolve(__dirname, "characters"),
    target: "node",
    devtool: false,
    output: {
      filename: "data.js",
      libraryTarget: "commonjs",
      path: path.resolve(__dirname, "dist"),
    },
    plugins: [new CleanWebpackPlugin(), new ExtractDataPlugin()],
  },
];
