const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const jsSourcePath = path.join(__dirname, './source/js');
const buildPath = path.join(__dirname, './build');
const imgPath = path.join(__dirname, './source/assets/img');
const sourcePath = path.join(__dirname, './source');

// Common plugins
const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(nodeEnv),
    },
  }),
  new webpack.NamedModulesPlugin(),
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [
        autoprefixer({
          browsers: [
            'last 3 version',
            'ie >= 10',
          ],
        }),
      ],
      context: sourcePath,
    },
  }),
];

// Common rules
const rules = [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: [
      'babel-loader',
    ],
  },
  {
    test: /\.(png|gif|jpg|svg)$/,
    include: imgPath,
    use: 'url-loader?emitFile=false&limit=20480&name=assets/[name]-[hash].[ext]',
  },
];

if (isProduction) {
  // Production plugins
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false,
      },
    }),
    new ExtractTextPlugin('style-[hash].css')
  );

  // Production rules
  rules.push(
    {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: 'css-loader!postcss-loader!sass-loader',
      }),
    }
  );
} else {
  // Development plugins
  plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );

  // Production rules
  rules.push(
    {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: 'css-loader!postcss-loader!sass-loader',
      }),
    }
  );

  // Development rules
  rules.push(
    {
      test: /\.scss$/,
      exclude: /node_modules/,
      use: [
        'style-loader',
        // Using source maps breaks urls in the CSS loader
        // https://github.com/webpack/css-loader/issues/232
        // This comment solves it, but breaks testing from a local network
        // https://github.com/webpack/css-loader/issues/232#issuecomment-240449998
        // 'css-loader?sourceMap',
        'css-loader',
        'postcss-loader',
        'sass-loader?sourceMap',
      ],
    }
  );
}

// config.entry.index.unshift(
//   'webpack/hot/poll?1000'
// );
const config = {
  watch: !isProduction,
  cache: true,

  devtool: isProduction ? 'eval' : 'source-map',
  context: jsSourcePath,
  entry: [
    // 'webpack/hot/signal',
    './server.js',
  ],
  output: {
    path: buildPath,
    publicPath: '/',
    filename: 'server.js',
  },
  module: {
    rules,
  },
  resolve: {
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      jsSourcePath,
    ],
  },
  plugins,
  // Fix for node modules
  externals: fs.readdirSync('node_modules').reduce((accumulator, module) => {
    const newAccumulator = accumulator;
    newAccumulator[module] = `commonjs ${ module }`;

    return newAccumulator;
  }, {}),
};


// config.entry.index.unshift(
//   'webpack/hot/poll?1000'
// );

module.exports = config;
