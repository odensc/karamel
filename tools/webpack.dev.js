process.env.NODE_ENV = "development";
const base = require("./webpack.base");
const webpack = require("webpack");
const ForkTsCheckerPlugin = require("fork-ts-checker-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");

module.exports = Object.assign(base, {
	module: {
		rules: base.module.rules.concat([
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: "ts-loader",
				options: {
					transpileOnly: true
				}
			}
		])
	},
	plugins: base.plugins.concat([
		new webpack.WatchIgnorePlugin([
			/.*\.scss\.d\.ts/
		]),
		new webpack.DefinePlugin({
            "process.env.NODE_ENV": `"development"`
        }),
		new ForkTsCheckerPlugin({
			tslint: true
		}),
		new FriendlyErrorsPlugin()
	]),
	devtool: "inline-source-map"
});
