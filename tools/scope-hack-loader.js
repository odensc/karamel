const loaderUtils = require("loader-utils");

// The new YouTube layout uses scoped styles, which breaks root-level class selectors for some reason.
// This loader does a little trickery to prepend an ID selector to every class selector in the CSS.
module.exports = function(content) {
	const opts = loaderUtils.getOptions(this);
	content = content.replace(/\/\*# sourceMappingURL=.* \*\//g, "");
	return content.replace(/(\..+).*({|,)/g, `:global(${opts.prepend}) $1$2`);
};
