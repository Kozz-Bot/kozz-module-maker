export function mapObject2<K extends string, A, B>(
	object: { [P in K]: A },
	mapper: (value: A) => B
): { [P in K]: B } {
	const result: { [P in K]?: B } = {};

	(Object.keys(object) as K[]).forEach((key: K) => {
		// assert -------> ^^^^^^ (you already did this)
		result[key] = mapper(object[key]);
	});

	return result as { [P in K]: B };
	// assert --> ^^^^^^^^^^^^^^^^^^
}
