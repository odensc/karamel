process.env.NODE_ENV = "development";
const base = require("./webpack.base");
const webpack = require("webpack");
const {CheckerPlugin} = require("awesome-typescript-loader");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");

module.exports = Object.assign(base, {
	plugins: base.plugins.concat([
		new webpack.WatchIgnorePlugin([
			/.*\.scss\.d\.ts/
		]),
		new webpack.DefinePlugin({
            "process.env.NODE_ENV": `"development"`
        }),
		new FriendlyErrorsPlugin(),
		new CheckerPlugin()
	]),
	devtool: "eval-source-map"
});
