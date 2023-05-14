const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./react-folder/src/index.js",
  output: {
    path: path.resolve(__dirname, "./react-folder/static/js"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$|jsx/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV' : JSON.stringify('production')
    }),
  ],

  stats: {
    errorDetails: true,
  },

  resolve: {
    fallback: {
      "string_decoder": require.resolve("string_decoder"),
      "timers": require.resolve("timers-browserify"),
      "buffer": require.resolve("buffer/"),
      "stream": require.resolve("stream-browserify")
    }
  }
};