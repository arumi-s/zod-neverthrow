import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { z } from 'zod/v4';
import { createResultSchema, neverthrowParse } from '../src/v4';
import { err, ok } from 'neverthrow';

describe('neverthrowParse', () => {
	it('should exists', () => {
		const schema = z.string();

		expect(neverthrowParse).toBeDefined();
		expect(typeof neverthrowParse).toBe('function');
	});

	it('should return an Ok result', () => {
		const schema = z.string();

		const result = neverthrowParse(schema, 'test');

		expect(result.isOk()).toBe(true);
		expect(result._unsafeUnwrap()).toBe('test');
	});

	it('should return an Err result', () => {
		const schema = z.string();

		const result = neverthrowParse(schema, 123);

		expect(result.isErr()).toBe(true);
		expect(result._unsafeUnwrapErr().issues[0].message).toBe('Invalid input: expected string, received number');
	});

	it('should infer the output type', () => {
		const schema = z.object({
			name: z.string(),
			age: z.number(),
			enabled: z.boolean(),
		});

		const result = neverthrowParse(schema, {
			name: 'John Doe',
			age: 30,
			enabled: true,
		});

		expect(result.isOk()).toBe(true);
		expectTypeOf(result._unsafeUnwrap()).toMatchObjectType<{
			name: string;
			age: number;
			enabled: boolean;
		}>();
	});

	it('should work', () => {
		const schema = z.object({
			name: z.string(),
			age: z.number(),
			enabled: z.boolean(),
		});

		const result1 = neverthrowParse(schema, {
			name: 'John Doe',
			age: 30,
			enabled: true,
		});

		const okFn = vi.fn();
		const errFn = vi.fn();
		result1.match(
			(data) => {
				okFn(data);
			},
			(error) => {
				errFn(error);
			},
		);

		expect(okFn).toHaveBeenCalledTimes(1);
		expect(errFn).toHaveBeenCalledTimes(0);

		const thenFn = vi.fn();
		result1.andThen((data) => {
			thenFn(data);
			return ok(data);
		});

		expect(thenFn).toHaveBeenCalledTimes(1);
	});
});

describe('createResultSchema', () => {
	it('should exists', () => {
		expect(createResultSchema).toBeDefined();
		expect(typeof createResultSchema).toBe('function');
	});

	it('should return a ZodSchema', () => {
		const value = z.string();
		const error = z.string();

		const schema = createResultSchema(value, error);

		expect(schema).toHaveProperty('_zod');
	});

	it('should validate Result', () => {
		const value = z.string();
		const error = z.string();

		const schema = createResultSchema(value, error);

		const result = ok('');
		expect(schema.safeParse(result)).toStrictEqual({
			data: result,
			success: true,
		});
		expect(schema.safeParse('').success).toBe(false);
	});

	it('should validate Result.value if isOk', () => {
		const value = z.string();
		const error = z.string();

		const schema = createResultSchema(value, error);

		expect(schema.safeParse(ok('')).success).toBe(true);
		expect(schema.safeParse(ok(1)).success).toBe(false);
	});

	it('should validate Result.error if isErr', () => {
		const value = z.string();
		const error = z.string();

		const schema = createResultSchema(value, error);

		expect(schema.safeParse(err('')).success).toBe(true);
		expect(schema.safeParse(err(1)).success).toBe(false);
	});

	it('should infer the Result.value type', () => {
		const value = z.object({
			name: z.string(),
			age: z.number(),
			enabled: z.boolean(),
		});
		const error = z.string();

		const schema = createResultSchema(value, error);
		const result = schema.parse(ok({ name: 'John Doe', age: 30, enabled: true }));

		expectTypeOf(result._unsafeUnwrap()).toMatchObjectType<{
			name: string;
			age: number;
			enabled: boolean;
		}>();
	});

	it('should infer the Result.error type', () => {
		const value = z.string();
		const error = z.object({
			code: z.number().int(),
			message: z.string(),
		});

		const schema = createResultSchema(value, error);
		const result = schema.parse(
			err({
				code: 400,
				message: 'Bad Request',
			}),
		);

		expectTypeOf(result._unsafeUnwrapErr()).toMatchObjectType<{
			code: number;
			message: string;
		}>();
	});
});
