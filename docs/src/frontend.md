# Frontend Documentation

## Project Context

This project was initially created as part of the [Modular Carnival Hackathon](https://www.modularcarnival.xyz/) in Belo Horizonte, Brazil. The codebase is currently under active development and will be receiving updates and improvements.

## Technical Stack

The frontend application is built using modern web technologies:

- **Framework**: Next.js 14.2
- **Language**: TypeScript
- **UI Components**: Custom UI library (@repo/ui)
- **Web3 Integration**:
  - RainbowKit v2 for wallet connection
  - Wagmi v2 for Ethereum interactions
  - Viem 2.23 for blockchain interactions
- **State Management & Data Fetching**: TanStack Query (React Query) v5

## Project Structure

The frontend is organized as part of a monorepo structure with shared configurations for:

- ESLint
- TypeScript
- Tailwind CSS

## Development

To run the project locally:

```bash
# Install dependencies (from root directory if using monorepo)
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Environment Setup

The project uses dotenvx for environment variable management. Make sure to:

1. Create a `.env.local` file in the root directory
2. Add necessary environment variables
3. The development server will automatically load these variables

## Code Quality

The project maintains code quality through:

- TypeScript for type safety
- ESLint for code linting
- Built-in type checking scripts

To run type checks:

```bash
pnpm type-check
```

## Styling

The project uses Tailwind CSS for styling with a custom configuration shared across the monorepo (@repo/tailwind-config).
