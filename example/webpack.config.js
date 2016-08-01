const path = require('path')

module.exports = {
    devtool: 'source-map',
    entry: './src/index.js',
    output: {
        path: './build/',
        filename: 'bundle.js',
    },
    resolveLoader: {
        root: path.join(__dirname, 'node_modules'),
    },
    resolve: {
        alias: {
            'fetch-tree': path.join(__dirname, '../lib/'),
        },
        fallback: path.join(__dirname, "node_modules"),
    },
    module: {
        loaders: [
            {
                test: /\.jsx?/,
                loaders: [
                    'babel',
                ],
                exclude: /node_modules/,
            },
        ],
    },
}
