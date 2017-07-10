const { join, resolve } = require("path");

const ROOT = "./src";
const paths = {
	dist: resolve("dist"),
	src: ROOT,
	stylesName: "styles",
	static: `${ROOT}/assets/static`,
	tsIndex: `${ROOT}/index.tsx`
};

module.exports = {
	loaders: {
		css: [
			"style-loader",

			{
				loader: "typings-for-css-modules-loader",
				options: {
					namedExport: true,
					modules: true,
					camelCase: true,
					sourceMap: (process.env.NODE_ENV === "development" || process.env.PRODUCTION_DEBUG),
					localIdentName: (process.env.NODE_ENV === "development" || process.env.PRODUCTION_DEBUG)
						? "[name]__[local]--[hash:2]"
						: "[hash:4]",
					importLoaders: 1,
					minimize: process.env.NODE_ENV === "production"
				}
			},

			{
				loader: "./tools/scope-hack-loader",
				options: {prepend: "#tube-mount"}
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
			"url-loader?limit=10000",

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
