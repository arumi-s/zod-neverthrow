import * as z from 'zod/v4/core';
import { Result, ok, err } from 'neverthrow';

export function neverthrowParse<T extends z.$ZodType>(
	schema: T,
	data: unknown,
	params?: z.ParseContext<z.$ZodIssue>,
): Result<z.output<T>, z.$ZodError<z.output<T>>> {
	const { success, data: parsed, error } = z.safeParse(schema, data, params);

	return success ? ok(parsed) : err(error);
}
