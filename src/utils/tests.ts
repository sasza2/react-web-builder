export const assignTestProp = (
	testId?: string,
	block?: string | null,
	...modifiers: string[]
) => {
	if (!testId) return {};

	const blockPart = block ? `${testId}__${block}` : testId;
	const parts = [
		blockPart,
		...modifiers.filter(Boolean).map((modifier) => `${blockPart}--${modifier}`),
	];
	return { "data-testid": parts.join(" ") };
};
