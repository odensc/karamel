import i18n from "common/i18n";

const chunks: [number, string][] = [
	[60 * 60 * 24 * 365, "time:year"],
	[60 * 60 * 24 * 30, "time:month"],
	[60 * 60 * 24, "time:day"],
	[60 * 60, "time:hour"],
	[60, "time:minute"]
];

export const format = (ageSeconds: number) => {
	let text = i18n.t("time:now");
	for (const chunk of chunks) {
		const amount = Math.floor(ageSeconds / chunk[0]);
		if (amount > 0) {
			text = i18n.t(chunk[1], { count: amount });
			break;
		}
	}

	return text;
};
