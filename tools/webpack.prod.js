process.env.NODE_ENV = "production";
const base = require("./webpack.base");
const webpack = require("webpack");
const BabiliPlugin = require("babili-webpack-plugin");

module.exports = Object.assign(base, {
	module: {
		rules: base.module.rules.concat([
			{
				enforce: "pre",
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: "tslint-loader",
				options: {
					emitErrors: true
				}
			},

			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: "ts-loader"
			}
		])
	},
	plugins: base.plugins.concat([
		new webpack.DefinePlugin({
            "process.env.NODE_ENV": `"production"`
        }),
		new BabiliPlugin({
			removeConsole: true,
			removeDebugger: true
		}, {
			comments: false
		}),
	])
});
