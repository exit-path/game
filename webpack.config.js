const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

const config = {
  mode: isProduction ? "production" : "development",
  entry: "./web/index.tsx",
  devtool: isProduction ? "source-map" : "cheap-module-source-map",
  output: {
    filename: "static/[name].[contenthash:8].js",
    assetModuleFilename: "static/assets/[hash][ext][query]",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    contentBase: "./dist",
    hot: true,
  },
  optimization: {
    minimize: isProduction,
    splitChunks: {
      chunks: "initial",
      name: "vendor",
    },
    minimizer: ["...", new CssMinimizerPlugin()],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
      {
        test: /\.(ts|tsx|js)$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          compact: isProduction,
        },
      },
      {
        test: /\.scss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                ident: "postcss",
              },
            },
          },
          "sass-loader",
        ],
        sideEffects: true,
      },
      {
        test: /\.png$/,
        type: "asset",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".scss"],
    alias: {
      "swf-lib": "@kiootic/swf-lib",
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "static/[name].[contenthash:8].css",
    }),
    new HtmlWebpackPlugin({
      template: "web/index.html",
    }),
  ],
};

module.exports = config;
