const {resolve, join} = require("path");

const ROOT = "./src";
const paths = {
	dist: resolve("dist"),
	icon: `${ROOT}/assets/icon.png`,
	scriptsName: "scripts",
	src: ROOT,
	stylesName: "styles",
	static: `${ROOT}/assets/static`
};

module.exports = {
	loaders: {
		css: [
			{
				loader: "typings-for-css-modules-loader",
				options: {
					namedExport: true,
					modules: true,
					camelCase: true,
					localIdentName: "[folder]__[local]--[hash:base64:4]",
					importLoaders: 1,
					minimize: process.env.NODE_ENV === "production"
				}
			},

			{
				loader: "postcss-loader",
				options: require("./postcss.config")
			},

			"resolve-url-loader",

			{
				loader: "sass-loader",
				options: {
					sourceMap: true,
					includePaths: [resolve(__dirname, join("..", paths.src, paths.stylesName))]
				}
			}
		],
		images: [
			"file-loader",

			{
				loader: "image-webpack-loader",
				options: {
					// Only optimize in production.
					bypassOnDebug: true
				}
			}
		]
	},
	paths: paths
};
