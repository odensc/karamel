process.env.NODE_ENV = "production";
const base = require("./webpack.base");
const webpack = require("webpack");

module.exports = Object.assign(base, {
	mode: "production",
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
		})
	])
});
