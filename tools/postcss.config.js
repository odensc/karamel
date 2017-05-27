module.exports = {
	plugins: [
		require("autoprefixer")(["last 3 Chrome versions"])
	],
	sourceMap: (process.env.NODE_ENV === "development") ? "inline" : false
};
