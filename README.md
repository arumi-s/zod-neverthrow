# zod-neverthrow

[![npm version](https://img.shields.io/npm/v/zod-neverthrow)](https://npm.im/zod-neverthrow) [![npm downloads](https://img.shields.io/npm/dm/zod-neverthrow)](https://npm.im/zod-neverthrow)

A lightweight TypeScript utility that integrates [Zod](https://github.com/colinhacks/zod) schema validation with the `Result` type from [neverthrow](https://github.com/supermacro/neverthrow) for streamlined robust error handling.

## Installation

```bash
npm install zod-neverthrow zod neverthrow
# or
pnpm add zod-neverthrow zod neverthrow
```

## Dependencies

This package requires the following peer dependencies:

- [Zod](https://www.npmjs.com/package/zod)
- [neverthrow](https://www.npmjs.com/package/neverthrow)

## Usage

```typescript
import { z } from 'zod';
import 'zod-neverthrow';

const UserSchema = z.object({
	name: z.string(),
	age: z.number(),
	enabled: z.boolean(),
});

// Result<{ name: string; age: number; enabled: boolean; }, z.ZodError<any>>
const result = UserSchema.neverthrowParse({
	name: 'John Doe',
	age: 30,
	enabled: true,
});

result.match(
	(user) => console.log('User processed successfully:', user),
	(error) => console.error('Invalid user data:', error.errors),
);
```

## License

MIT License
