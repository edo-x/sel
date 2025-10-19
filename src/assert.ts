export function assert(condition: unknown, errorMessage?: string): asserts condition {
	if (condition === false) {
		throw new Error(errorMessage ?? 'Assert condition failed');
	}
}
