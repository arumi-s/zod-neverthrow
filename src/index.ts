import { ParseParams, z } from 'zod';
import { Result, ok, err } from 'neverthrow';

declare module 'zod' {
	interface ZodType<Output, Def extends z.ZodTypeDef, Input = Output> {
		neverthrowParse(data: unknown): Result<Output, z.ZodError>;
	}
}

if (!z.ZodType.prototype.neverthrowParse) {
	Object.defineProperty(z.ZodType.prototype, 'neverthrowParse', {
		value: function (data: unknown, params?: Partial<ParseParams>) {
			const { success, data: parsed, error } = this.safeParse(data, params);

			return success ? ok(parsed) : err(error);
		},
		writable: true,
		enumerable: false,
		configurable: true,
	});
}
