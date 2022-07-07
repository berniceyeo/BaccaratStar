// breack the cache of the browswe so thye wil have to retrieve the fresh files on load. creates a dynamically generated script tag
import HtmlWebpackPlugin from "html-webpack-plugin";
// transforms css variants into css
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";

import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
console.log("dirname", __dirname);

let htmlPageNames = ["in-room", "pre-room"];
let multipleHtmlPlugins = htmlPageNames.map((name) => {
  return new HtmlWebpackPlugin({
    // template: `./src/${name}.html`, // relative path to the HTML files
    template: path.resolve(__dirname, "..", "src", `${name}.html`),
    chunks: [name],
    filename: `${name}.html`, // output HTML files
  });
});

const config = {
  entry: {
    main: "./src/js/main.js",
    "pre-room": "./src/js/pre-room.js",
    "in-room": "./src/js/in-room.js",
  },
  output: {
    filename: "[name]-[contenthash].bundle.js",
    path: path.resolve(__dirname, "../dist"),
    // Replace previously-compiled files with latest one on each build
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      // Name this file main so it does not get automatically requested as a static file
      filename: "main.html",
      template: path.resolve(__dirname, "..", "src", "main.html"),
    }),
    new MiniCssExtractPlugin(),
  ].concat(multipleHtmlPlugins),
  module: {
    rules: [
      {
        // Regex to decide which files to run Babel on
        test: /\.(js|mjs|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader", //transforms ES5 to ES6
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
      {
        test: /\.(css|scss)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          // webpack will automatically reference a .babelrc file
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|jpg|gif|svg|jpeg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              output: "images/",
              publicPath: "images/",
            },
          },
        ],
      },
    ],
  },
};

export default config;
