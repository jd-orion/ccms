const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx'],
    modules: [path.resolve("./node_modules")]
  },
  entry: path.join(__dirname, './src/index.tsx'),
  output: {
    filename: 'index.js',
    path: path.join(__dirname, './dist'),
    libraryTarget: "umd",
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React',
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM',
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: [path.join(__dirname, './src')],
        exclude: /node_modules/
      },
      {
        test: /\.(j|t)sx?$/,
        include: [path.join(__dirname, './src')],
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      }, {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'fonts/'
          }
        }
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              }
            },
          }
        ]
      }
    ]
  },
}
