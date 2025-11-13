import type { $ZodIssue, $ZodError, output, ParseContext } from 'zod/v4/core';
import { type ZodType, custom, safeParse } from 'zod/v4';
import { Result, ok, err } from 'neverthrow';

export function neverthrowParse<T extends ZodType>(
	schema: T,
	data: unknown,
	params?: ParseContext<$ZodIssue>,
): Result<output<T>, $ZodError<output<T>>> {
	const { success, data: parsed, error } = safeParse(schema, data, params);

	return success ? ok(parsed) : err(error);
}

export function isResult<T = unknown, E = unknown>(value: unknown): value is Result<T, E> {
	return value != null && typeof value === 'object' && Reflect.has(value, 'isOk') && Reflect.has(value, 'isErr');
}

export function createResultSchema<T extends ZodType, E extends ZodType>(value: T, error: E) {
	return custom<Result<output<T>, output<E>>>(
		(v) => isResult(v) && (v.isOk() ? value.safeParse(v.value).success : error.safeParse(v.error).success),
	);
}
