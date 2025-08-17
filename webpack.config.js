const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    
    return {
        entry: {
            main: './js/modules/main.mjs',
            legacy: './js/main.js' // Fallback for older browsers
        },
        
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].js',
            chunkFilename: isProduction ? 'js/[name].[contenthash].chunk.js' : 'js/[name].chunk.js',
            publicPath: './',
            clean: true
        },
        
        optimization: {
            minimize: isProduction,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: isProduction,
                            drop_debugger: isProduction
                        },
                        format: {
                            comments: false
                        }
                    },
                    extractComments: false
                }),
                new OptimizeCSSAssetsPlugin()
            ],
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    },
                    modules: {
                        test: /[\\/]js[\\/]modules[\\/]/,
                        name: 'modules',
                        chunks: 'all',
                        priority: 10
                    }
                }
            }
        },
        
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    targets: {
                                        browsers: ['> 1%', 'last 2 versions']
                                    },
                                    modules: false,
                                    useBuiltIns: 'usage',
                                    corejs: 3
                                }]
                            ],
                            plugins: [
                                '@babel/plugin-proposal-class-properties',
                                '@babel/plugin-proposal-private-methods'
                            ]
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                sourceMap: !isProduction
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        ['autoprefixer'],
                                        ...(isProduction ? [['cssnano']] : [])
                                    ]
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|jpe?g|gif|svg|webp)$/i,
                    type: 'asset',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 8 * 1024 // 8KB
                        }
                    },
                    generator: {
                        filename: 'assets/images/[name].[hash][ext]'
                    }
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/fonts/[name].[hash][ext]'
                    }
                },
                {
                    test: /\.pdf$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/documents/[name].[hash][ext]'
                    }
                }
            ]
        },
        
        plugins: [
            new CleanWebpackPlugin(),
            
            new MiniCssExtractPlugin({
                filename: isProduction ? 'css/[name].[contenthash].css' : 'css/[name].css',
                chunkFilename: isProduction ? 'css/[name].[contenthash].chunk.css' : 'css/[name].chunk.css'
            }),
            
            new HtmlWebpackPlugin({
                template: 'index_optimized.html',
                filename: 'index.html',
                chunks: ['main'],
                minify: isProduction ? {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true
                } : false
            }),
            
            new HtmlWebpackPlugin({
                template: 'index.html',
                filename: 'legacy.html',
                chunks: ['legacy'],
                minify: isProduction
            }),
            
            ...(isProduction ? [
                new CompressionPlugin({
                    algorithm: 'gzip',
                    test: /\.(js|css|html|svg)$/,
                    threshold: 8192,
                    minRatio: 0.8
                })
            ] : [])
        ],
        
        resolve: {
            extensions: ['.mjs', '.js', '.json'],
            alias: {
                '@': path.resolve(__dirname, 'js'),
                '@modules': path.resolve(__dirname, 'js/modules'),
                '@css': path.resolve(__dirname, 'css'),
                '@assets': path.resolve(__dirname, 'assets')
            }
        },
        
        devServer: {
            static: {
                directory: path.join(__dirname, 'dist')
            },
            compress: true,
            port: 3000,
            hot: true,
            open: true,
            historyApiFallback: true,
            client: {
                overlay: {
                    errors: true,
                    warnings: false
                }
            }
        },
        
        devtool: isProduction ? 'source-map' : 'eval-source-map',
        
        performance: {
            hints: isProduction ? 'warning' : false,
            maxEntrypointSize: 250000,
            maxAssetSize: 250000
        }
    };
};