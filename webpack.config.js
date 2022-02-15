const path = require('path');
const ArchiveAssetsWebpackPlugin = require('./src/index');

module.exports = {
    entry: {
        main: path.resolve(__dirname, './example/index.js')
    },
    mode: 'development',
    devtool: false,
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    },
    plugins: [
        new ArchiveAssetsWebpackPlugin({
            source: './dist',
            destination: 'result.zip'
        })
    ]
}