module.exports = {
    target: 'web',
    entry: {
        bundle: ['./src/index.js'],
        worker: ['./src/worker.js']
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
        chunkFilename: '[name].[id].js'
    },
    devServer: {
        hot: true
    }
}
