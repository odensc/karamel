import i18next from "i18next";
import XHR, {BackendOptions} from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";

function loadLocale(url: string, _: any, callback: any) {
	try {
		callback(require(`../translations/${url}.json`), {status: 200});
	} catch (e) {
		callback(null, {status: 404});
	}
}

export default i18next
	.use(XHR)
	.use(LanguageDetector)
	.init({
		backend: {
			loadPath: "{{lng}}/{{ns}}",
			parse: (data: any) => data,
			ajax: loadLocale
		} as BackendOptions,
		detection: {
			caches: []
		},
		fallbackLng: "en",
		interpolation: {
			escapeValue: false
		},
		wait: true
	});
