const manifest = require("../src/assets/static/manifest");

const config = {
	/**
	 * The root path of the application
	 * Must have a trailing slash
	 */
	publicPath: "/"
};

/**
 * HTML injection config
 */
config.html = {
	/**
	 * Custom meta tags
	 */
	meta: [
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1"
		},
		{
			name: "description",
			content: manifest.description
		}
	],
	/**
	 * Title of the application
	 */
	title: manifest.name
};

module.exports = config;
