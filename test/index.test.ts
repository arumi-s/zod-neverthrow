import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { z } from 'zod';
import '../src';
import { ok } from 'neverthrow';

describe('neverthrowParse', () => {
	it('should exists', () => {
		const schema = z.string();

		expect(schema.neverthrowParse).toBeDefined();
		expect(typeof schema.neverthrowParse).toBe('function');
	});

	it('should have a correct descriptor', () => {
		const descriptor = Object.getOwnPropertyDescriptor(z.ZodType.prototype, 'neverthrowParse');

		expect(descriptor).toBeDefined();
		expect(descriptor!.writable).toBe(true);
		expect(descriptor!.enumerable).toBe(false);
		expect(descriptor!.configurable).toBe(true);
	});

	it('should return an Ok result', () => {
		const schema = z.string();

		const result = schema.neverthrowParse('test');

		expect(result.isOk()).toBe(true);
		expect(result._unsafeUnwrap()).toBe('test');
	});

	it('should return an Err result', () => {
		const schema = z.string();

		const result = schema.neverthrowParse(123);

		expect(result.isErr()).toBe(true);
		expect(result._unsafeUnwrapErr().issues[0].message).toBe('Expected string, received number');
	});

	it('should infer the output type', () => {
		const schema = z.object({
			name: z.string(),
			age: z.number(),
			enabled: z.boolean(),
		});

		const result = schema.neverthrowParse({
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

		const result1 = schema.neverthrowParse({
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
