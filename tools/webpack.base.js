const common = require("./common");
const { join, resolve } = require("path");
const webpack = require("webpack");
const CleanPlugin = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	entry: {
		"index": [
			`${common.paths.src}/index.tsx`
		]
	},
	output: {
		path: common.paths.dist,
		filename: "[name].js",
		chunkFilename: "[name].chunk.js"
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
		modules: [
			"node_modules",
			resolve(__dirname, join("..", common.paths.src))
		]
	},
	module: {
		rules: [
			{
				enforce: "pre",
				test: /\.scss$/,
				use: common.loaders.css
			},

			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				use: common.loaders.images
			}
		]
	},
	plugins: [
		new CleanPlugin(
			[common.paths.dist], {
				root: process.cwd(),
				verbose: false
			}
		),
		new CopyPlugin([
			{from: common.paths.static}
		])
	]
};
