const path = require("path");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require("webpack");



module.exports = (env, argv) => {

	const production = !!(argv.mode == "production");
  
  var config = {

		mode: production ? "production" : "development",
    // mode: 'production',
    entry: "./src/Root.js",

    target: "webworker", // or 'node' or 'node-webkit'
    externals:{
        fs:    "commonjs fs",
        path:  "commonjs path"
    },

    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, 'dist')
    },

    optimization: {
      minimizer: [new UglifyJsPlugin()],
    },

    module: {

      rules: [
        {
          test: /\.(scss|css)$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        // this will apply to both plain `.scss` files
        // AND `<style lang="scss">` blocks in `.vue` files
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.(glsl|vs|fs|vert|frag)$/,
          exclude: /node_modules/,
          use: [
            'raw-loader',
            'glslify-loader'
          ]
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        }
      ],
    },

    plugins: [
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        '__VUE_PROD_DEVTOOLS__': true
      }),

    ],

    resolve: {
      symlinks: false,
      alias: {
          // "@": path.resolve(__dirname, '../src'),
          vue: '@vue/runtime-dom'
        },
    },

    watchOptions: {
        aggregateTimeout: 1000,
        poll: 500,
        ignored: /node_modules/,
    }


  }

  return config;

};