import { type z, custom } from 'zod/v3';
import { type Result, ok, err } from 'neverthrow';

export function neverthrowParse<T extends z.ZodTypeAny>(
	schema: T,
	data: unknown,
	params?: Partial<z.ParseParams>,
): Result<z.infer<T>, z.ZodError> {
	const { success, data: parsed, error } = schema.safeParse(data, params);

	return success ? ok(parsed) : err(error);
}

export function isResult<T = unknown, E = unknown>(value: unknown): value is Result<T, E> {
	return value != null && typeof value === 'object' && Reflect.has(value, 'isOk') && Reflect.has(value, 'isErr');
}

export function createResultSchema<T extends z.ZodTypeAny, E extends z.ZodTypeAny>(value: T, error: E) {
	return custom<Result<z.infer<T>, z.infer<E>>>(
		(v) => isResult(v) && (v.isOk() ? value.safeParse(v.value).success : error.safeParse(v.error).success),
	);
}
