declare module "*.json" {
	const json: {[key: string]: any};
	export default json;
}

declare module "*.scss" {
	const scss: {[key: string]: string};
	export default scss;
}

declare module "*.svg" {
	const path: string;
	export default path;
}
