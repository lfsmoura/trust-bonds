# Getting Started

To develop the contract:

1. Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. Install dependencies

```bash
# Install Node.js dependencies
pnpm install

# Install Forge dependencies
cd packages/contracts
forge install
```

3. Test the contracts

```bash
# Run all tests
pnpm -F @trust-bonds/contracts test

# Run tests with coverage
pnpm -F @trust-bonds/contracts coverage

# Run gas snapshot checks
pnpm -F @trust-bonds/contracts snapshot-check

# Create new gas snapshots
pnpm -F @trust-bonds/contracts snapshot
```

4. Build the contracts

```bash
pnpm -F @trust-bonds/contracts build
```

5. Lint and format

```bash
pnpm -F @trust-bonds/contracts lint
```

The project uses Foundry for Solidity development and testing. The main contract files are located in `packages/contracts/src/`. Tests can be found in `packages/contracts/test/`.
