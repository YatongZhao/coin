import type * as webpack from 'webpack';
import * as path from 'path';
import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';

const mode: 'development' | 'production' = (process.env.NODE_ENV as any) || 'development';
const prod = mode === 'production';

const config: webpack.Configuration & WebpackDevServerConfiguration = {
    target: 'web',
    mode,
    entry: {
        bundle: ['./src/index.ts']
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
        globalObject: 'this'
    },
    resolve: {
        extensions: ['.ts', '.mjs', '.js', '.json', '.svelte'],
        alias: {
            svelte: path.resolve('node_modules', 'svelte')
        },
        mainFields: ['svelte', 'browser', 'module', 'main']
    },
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
                test: /\.svelte$/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        hotReload: true,
                        preprocess: require('svelte-preprocess')({})
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    prod ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader'
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
