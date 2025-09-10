import { type z } from 'zod/v3';
import { type Result, ok, err } from 'neverthrow';

export function neverthrowParse<T extends z.ZodTypeAny>(
	schema: T,
	data: unknown,
	params?: Partial<z.ParseParams>,
): Result<z.infer<T>, z.ZodError> {
	const { success, data: parsed, error } = schema.safeParse(data, params);

	return success ? ok(parsed) : err(error);
}
