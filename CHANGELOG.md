# @efobi/paystack

## 0.11.3

### Patch Changes

- 5464e81: Updated the entrypoints for ESM only

## 0.11.2

### Patch Changes

- 84ba768: Enable isolated declarations

## 0.11.1

### Patch Changes

- 3d8ec2e: Migrate to tsdown

## 0.11.0

### Minor Changes

- 87b1335: Reduce bundle size and fix transfer api validation bug

## 0.10.6

### Patch Changes

- cc17812: Fixed zod validation

## 0.10.5

### Patch Changes

- 7d75970: made logs nullable

## 0.10.4

### Patch Changes

- fd7b512: Fixed the metadata so that it can allow any structure

## 0.10.3

### Patch Changes

- f9b2b1c: Work in Progress fix

## 0.10.2

### Patch Changes

- 6504f31: Added missing recipient in Recipient API

## 0.10.1

### Patch Changes

- 2a687f4: Fixed test regression

## 0.10.0

### Minor Changes

- 82ac232: Add Transfer Recipients API with comprehensive tests

## 0.9.0

### Minor Changes

- d7be394: Added Transfers API with comprehensive tests passing

## 0.8.6

### Patch Changes

- 9700641: Added final fix for undefined key "id" and added two more tests to make sure the sdk is initialized

## 0.8.5

### Patch Changes

- 1bc6d63: Added passthrough across API responses

## 0.8.4

### Patch Changes

- 6d58990: Fixed import resolution wahala

## 0.8.3

### Patch Changes

- 24b238e: FIxed import path

## 0.8.2

### Patch Changes

- 2dcc694: Fixed the Transaction API tests failing due to zod validation error

## 0.8.1

### Patch Changes

- 569de63: Updates...

## 0.7.1

### Patch Changes

- b5522e9: Minor patch to switch back to tsc

## 0.7.0

### Minor Changes

- 1a19012: All tests passed, and excluding tests from final bundle

## 0.6.4

### Patch Changes

- 6e542eb: Added test coverage for completed APIs, unit tests for all done, integration tests only done for Transactions API

## 0.6.3

### Patch Changes

- f635956: Fixed some typos

## 0.6.2

### Patch Changes

- 5e4d47f: Removed node:crypto to use Web Crypto API for better compatibility across platforms

## 0.6.1

### Patch Changes

- 7d5591c: Made some fields nullable and/or undefined in miscellaneous.listBanks

## 0.6.0

### Minor Changes

- e2c8d66: Added Miscellaneous and Verification APIs

## 0.5.3

### Patch Changes

- 88c87a7: Fixed build script and modified tsconfig

## 0.5.2

### Patch Changes

- f8c8f27: Work in progress on finalizing the webhook class

## 0.5.1

### Patch Changes

- bbd3142: Prefer validation over type assertion for secret key

## 0.5.0

### Minor Changes

- a9993b1: Added webhook handler for Paystack events

## 0.4.1

### Patch Changes

- e3e2432: Fixed zod meta schema

## 0.4.0

### Minor Changes

- 516892b: Updated config and peer dependencies

## 0.3.1

### Patch Changes

- ac1549b: Improved the tsconfig and build process

## 0.3.0

### Minor Changes

- 095173d: Added Dedicated Virtual Account API

## 0.2.0

### Minor Changes

- 0dc68a7: Add Transaction Split API

## 0.1.0

### Minor Changes

- 81ff4b7: Added Paystack Transaction API

## 0.0.2

### Patch Changes

- 48762f3: Initial commit
