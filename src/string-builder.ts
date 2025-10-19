export class StringBuilder {
	private parts: string[];

	constructor() {
		this.parts = [];
	}

	append(...segments: (string | undefined | null)[]): this {
		for (const segment of segments) {
			if (segment != null && segment !== '')
				this.parts.push(segment);
		}
		return this;
	}

	toString(): string {
		return this.parts.join('');
	}

	clear(): void {
		this.parts.length = 0;
	}
}
