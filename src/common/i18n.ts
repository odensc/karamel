import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import XHR from "i18next-xhr-backend";

function loadLocale(url: string, _: any, callback: any) {
	try {
		callback(require(`../translations/${url}.json`), { status: 200 });
	} catch (e) {
		callback(null, { status: 404 });
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
		},
		detection: {
			caches: []
		},
		fallbackLng: "en",
		interpolation: {
			escapeValue: false
		},
		react: {
			wait: true
		}
	});
