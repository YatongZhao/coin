import * as webpack from 'webpack';

const config: webpack.Configuration = {
    target: 'web',
    mode: 'development',
    entry: {
        bundle: ['./src/index.ts'],
        // worker: ['./src/index.worker.ts']
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
        globalObject: 'this'
    },
    resolve: { extensions: ['.ts', '.js', '.json'] },
    devServer: {
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.worker\.ts$/, // ts结尾,这也很重要
                use: [
                    {
                        loader: 'worker-loader',
                        options: {
                            filename: '[name].js',
                            inline: 'fallback'
                        }
                    }
                ]
            },
            {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    },
    devtool: 'source-map'
}

export default config;
