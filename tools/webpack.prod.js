process.env.NODE_ENV = "production";
const base = require("./webpack.base");
const webpack = require("webpack");

module.exports = Object.assign(base, {
	plugins: base.plugins.concat([
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				dead_code: true,
				drop_console: true,
				unused: true,
				warnings: false
			}
		}),
		new webpack.DefinePlugin({
            "process.env.NODE_ENV": `"production"`
        })
	])
});
