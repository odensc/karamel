export const formatScore = (score: number) => {
	if (score < 10000) return score;

	const thousands = score / 1000;
	return `${thousands.toFixed(thousands < 100 ? 1 : 0)}k`;
};

export const returnOf = <A, T>(_: (a: A) => T): T => null!;
