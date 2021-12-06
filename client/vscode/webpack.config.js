// @ts-check

'use strict'
const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

/** @type {import('webpack').Configuration}*/
const extensionConfig = {
  target: 'web', // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
  mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
  entry: './src/extension.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    library: {
      type: 'umd',
    },
    globalObject: 'globalThis',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  devtool: 'source-map',
  externals: {
    vscode: 'commonjs vscode', // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
  },
  resolve: {
    mainFields: ['browser', 'module', 'main'], // look for `browser` entry point in imported node modules
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      path: require.resolve('path-browserify'),
      process: 'process/browser',
    },
    fallback: {
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert'),
      os: require.resolve('os-browserify/browser'),
      util: require.resolve('util'),
      child_process: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
}

const rootPath = path.resolve(__dirname, '../../')
const vscodeWorkspacePath = path.resolve(rootPath, 'client', 'vscode')
const vscodeSourcePath = path.resolve(vscodeWorkspacePath, 'src')
const webviewSourcePath = path.resolve(vscodeSourcePath, 'webview')

const getCSSLoaders = (...loaders) => [
  MiniCssExtractPlugin.loader,
  ...loaders,
  {
    loader: 'postcss-loader',
  },
  {
    loader: 'sass-loader',
    options: {
      sassOptions: {
        includePaths: [path.resolve(rootPath, 'node_modules'), path.resolve(rootPath, 'client')],
      },
    },
  },
]

const searchPanelWebviewPath = path.resolve(webviewSourcePath, 'search-panel')
const searchSidebarWebviewPath = path.resolve(webviewSourcePath, 'search-sidebar')
const extensionHostWebviewPath = path.resolve(webviewSourcePath, 'extension-host')

const extensionHostWorker = /main\.worker\.ts$/

/** @type {import('webpack').Configuration}*/
const webviewConfig = {
  target: 'web',
  entry: {
    searchPanel: [path.resolve(searchPanelWebviewPath, 'index.tsx')],
    searchSidebar: [path.resolve(searchSidebarWebviewPath, 'index.tsx')],
    extensionHost: [path.resolve(extensionHostWebviewPath, 'index.tsx')],
    style: path.join(webviewSourcePath, 'index.scss'),
  },
  output: {
    path: path.join(vscodeWorkspacePath, 'dist/webview'),
    filename: '[name].js',
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser', // provide a shim for the global `process` variable
    }),
  ],
  externals: {
    vscode: 'commonjs vscode', // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
  },
  resolve: {
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      path: require.resolve('path-browserify'),
      process: 'process/browser',
    },
    fallback: {
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert'),
      os: require.resolve('os-browserify/browser'),
      util: require.resolve('util'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/, extensionHostWorker],
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      // SCSS rule for our own styles and Bootstrap
      {
        test: /\.(css|sass|scss)$/,
        exclude: /\.module\.(sass|scss)$/,
        use: getCSSLoaders({ loader: 'css-loader', options: { url: false } }),
      },
      // For CSS modules
      {
        test: /\.(css|sass|scss)$/,
        include: /\.module\.(sass|scss)$/,
        use: getCSSLoaders({
          loader: 'css-loader',
          options: {
            sourceMap: false,
            modules: {
              exportLocalsConvention: 'camelCase',
              localIdentName: '[name]__[local]_[hash:base64:5]',
            },
            url: false,
          },
        }),
      },
      {
        test: extensionHostWorker,
        use: [
          {
            loader: 'worker-loader',
            options: { inline: 'no-fallback' },
          },
          'ts-loader',
        ],
      },
    ],
  },
}

module.exports = [webviewConfig, extensionConfig]
