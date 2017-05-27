const common = require("./common");
const config = require("./config");
const {resolve, join} = require("path");
const webpack = require("webpack");
const CleanPlugin = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
	entry: {
		"index": [
			`${common.paths.src}/${common.paths.scriptsName}/index.tsx`
		]
	},
	output: {
		path: common.paths.dist,
		filename: "[name].js",
		chunkFilename: "[name].chunk.js",
		publicPath: config.publicPath
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
		modules: [
			"node_modules",
			resolve(__dirname, join("..", common.paths.src, common.paths.scriptsName))
		]
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: "awesome-typescript-loader"
			},

			{
				enforce: "pre",
				test: /\.scss$/,
				loaders: ExtractTextPlugin.extract({
					use: common.loaders.css
				})
			},

			{
				test: /\.(woff|woff2|eot|ttf)$/i,
				loader: "file-loader"
			},

			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				loaders: common.loaders.images
			},

			{
				test: /\.json$/,
				loader: "json-loader"
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
		]),
		new ExtractTextPlugin("index.css")
	]
};
