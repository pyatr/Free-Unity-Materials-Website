// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = MiniCssExtractPlugin.loader;

const htmlWebpackPlugin = new HtmlWebpackPlugin({template: "./public/index.html",});
//Костыль для экспорта файла как php вместо html
//htmlWebpackPlugin.userOptions.filename = "index.php";

const config = {

    entry: "./src/index.tsx",
    output: {
        path: path.resolve(__dirname, "dist"),
    },
    devServer: {
        open: true,
        host: "localhost",
    },
    plugins: [
        htmlWebpackPlugin,
        new MiniCssExtractPlugin(),
<<<<<<< Updated upstream

=======
        new CopyPlugin(
            {
                patterns: [
                    {from: "./public/assets", to: "assets"},
                    //TODO: сделать копирование по типу ./public/*.php в dist, сейчас создает папку public
                    {from: "./public/login.html"},
                    {from: "./public/manifest.json"},
                    {from: "./public/robots.txt"}
                ]
            }
        )
>>>>>>> Stashed changes
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: "ts-loader",
                exclude: ["/node_modules/"],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, "css-loader"],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: "asset",
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = "production";

        config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
    } else {
        config.mode = "development";
    }
    return config;
};
