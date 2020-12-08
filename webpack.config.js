const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

const config = {
  mode: isProduction ? "production" : "development",
  entry: "./web/index.tsx",
  devtool: isProduction ? "source-map" : "cheap-module-source-map",
  target: "web", // FIXME: https://github.com/pmmmwh/react-refresh-webpack-plugin/issues/235
  output: {
    filename: "static/[name].[contenthash:8].js",
    assetModuleFilename: "static/assets/[hash][ext][query]",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    contentBase: "./static",
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
          plugins: [!isProduction && "react-refresh/babel"].filter(Boolean),
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
    new CopyPlugin({
      patterns: [
        { from: "static" },
      ],
    }),
    !isProduction && new webpack.HotModuleReplacementPlugin(),
    !isProduction &&
      new ReactRefreshWebpackPlugin({
        exclude: /(node_modules|swf-lib)/,
      }),
  ].filter(Boolean),
};

module.exports = config;
