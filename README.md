# @efobi/paystack

[![npm version](https://badge.fury.io/js/@efobi%2Fpaystack.svg)](https://badge.fury.io/js/@efobi%2Fpaystack)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A type-safe, platform-agnostic TypeScript SDK for the Paystack API. Built with modern TypeScript and Zod for runtime validation, this client provides a clean, intuitive interface for integrating Paystack payment services into your applications.

## Features

- 🔒 **Type-safe**: Full TypeScript support with strict typing
- 🏗️ **Platform-agnostic**: Works in Node.js, Bun, browsers, and edge runtimes
- ✅ **Runtime validation**: Input/output validation using Zod schemas
- 🎯 **Modern API**: Clean, promise-based interface
- 📦 **Lightweight**: Minimal dependencies
- 🔐 **Secure**: Built-in API key management and validation

## Installation

```bash
# npm
npm install @efobi/paystack

# yarn
yarn add @efobi/paystack

# pnpm
pnpm add @efobi/paystack

# bun
bun add @efobi/paystack
```

## ⚠️ Work in Progress

This SDK is actively under development. Below is the current implementation status:

### API Coverage

- ✅ **Transactions** - Complete
- ✅ **Transaction Split** - Complete
- ⏳ **Terminal** - Planned
- ⏳ **Virtual Terminal** - Planned
- ⏳ **Customers** - Planned
- ⏳ **Direct Debit** - Planned
- ✅ **Dedicated Virtual Accounts** - Complete
- ⏳ **Apple Pay** - Planned
- ⏳ **Subaccounts** - Planned
- ⏳ **Plans** - Planned
- ⏳ **Subscriptions** - Planned
- ⏳ **Products** - Planned
- ⏳ **Payment Pages** - Planned
- ⏳ **Payment Requests** - Planned
- ⏳ **Settlements** - Planned
- ⏳ **Transfers** - Planned
- ⏳ **Transfer Control** - Planned
- ⏳ **Bulk Charges** - Planned
- ⏳ **Integration** - Planned
- ⏳ **Charge** - Planned
- ⏳ **Disputes** - Planned
- ⏳ **Refunds** - Planned
- ⏳ **Verification** - Planned
- ⏳ **Miscellaneous** - Planned

**Legend:**

- ✅ Complete and tested
- ⏳ Planned for future releases
- 🚧 Currently in development

> **Note:** While only Transactions are currently implemented, the foundation is designed to easily accommodate all Paystack API endpoints. New endpoints will be added in upcoming releases.

## Quick Start

```typescript
import { Paystack } from '@efobi/paystack';

// Initialize with your secret key
const paystack = new Paystack('sk_test_your_secret_key_here');

// Initialize a transaction
const transaction = await paystack.transaction.initialize({
  email: 'customer@email.com',
  amount: 50000, // Amount in kobo (₦500.00)
  currency: 'NGN'
});

console.log(transaction.data.authorization_url);
```

## API Documentation

### Initialization

```typescript
const paystack = new Paystack(secretKey);
```

**Parameters:**

- `secretKey`: Your Paystack secret key (`sk_test_*` for test mode, `sk_live_*` for live mode)

### Transactions

#### Initialize Transaction

```typescript
const result = await paystack.transaction.initialize({
  email: 'customer@example.com',
  amount: 50000, // Amount in kobo
  currency?: 'NGN', // Optional, defaults to NGN
  reference?: 'unique_reference', // Optional, auto-generated if not provided
  callback_url?: 'https://yoursite.com/callback',
  // ... other optional parameters
});
```

#### Verify Transaction

```typescript
const result = await paystack.transaction.verify('transaction_reference');
```

#### List Transactions

```typescript
const result = await paystack.transaction.list({
  perPage?: 50,
  page?: 1,
  customer?: 'customer_id',
  status?: 'success' | 'failed' | 'abandoned',
  from?: '2023-01-01',
  to?: '2023-12-31'
});
```

#### Get Single Transaction

```typescript
const result = await paystack.transaction.getTransactionById(12345678); // ID is a number
```

#### Charge Authorization

```typescript
const result = await paystack.transaction.chargeAuthorization({
  authorization_code: 'AUTH_code',
  email: 'customer@example.com',
  amount: 50000
});
```

## Error Handling

The SDK provides structured error handling:

```typescript
try {
  const result = await paystack.transaction.verify('non_existent_ref');

  if (result.error) {
    console.error('Validation or API Error:', result.error.flatten());
  } else if (result.data) {
    console.log('Transaction Verified:', result.data);
  }

} catch (e) {
    console.error('Network or unexpected error:', e.message);
}
```

## Environment Variables

You can store your secret key in environment variables:

```bash
# .env
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
```

```typescript
const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!);
```

## TypeScript Support

This package is built with TypeScript and provides full type definitions:

```typescript
import type { 
  Transaction,
  TransactionInitializeInput,
  TransactionResponse 
} from '@efobi/paystack';
```

## Requirements

- TypeScript 5.0 or higher
- Node.js 16+ (if using in Node.js environment)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

I need help writing the tests and documentation for new features. If you find a bug or have a feature request, please open an issue.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Build the project
bun run build

# Format code
bun run format

# Run all checks
bun run ci
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 🐛 [Report Issues](https://github.com/efobi-dev/paystack/issues)
- 📖 [Paystack API Documentation](https://paystack.com/docs/api/)
- 💬 [GitHub Discussions](https://github.com/efobi-dev/paystack/discussions)

## Author

**Owen Efobi**

- GitHub: [@efobi-dev](https://github.com/efobi-dev)
- Email: <owen@efobi.dev>

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a history of changes to this project.

---

Made with ❤️ by [Owen Efobi](https://github.com/efobi-dev)
