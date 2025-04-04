# Contract

## Overview

The TrustBond contract is a decentralized system that enables users to create trust-based bonds with other users by locking tokens. It leverages AAVE's lending pool to generate yield on the locked tokens. The system provides functionality for creating bonds, withdrawing funds, and breaking bonds, with various security measures and fee structures in place.

## Key Components

### External Integrations

- **AAVE Pool**: Used for lending/borrowing functionality
- **Gitcoin Passport Decoder**: Provides score verification for sybil resistance
- **ERC20 Tokens**:
  - Base token for bonding
  - AAVE's aToken for yield generation

### Core Data Structure

```solidity
struct Bond {
    address partner;      // The address of the bonding partner
    uint256 amount;       // Amount of tokens locked in the bond
    uint256 createdAt;    // Timestamp of bond creation
    uint256 lastUpdated;  // Timestamp of last update
}
```

## Contract Functions

### Administrative Functions

#### Constructor

```solidity
constructor(
    address owner,
    IGitcoinPassportDecoder passportDecoder,
    IPool pool,
    IERC20 token,
    IERC20 atoken
)
```

- Initializes the contract with essential components
- Sets initial withdrawal fee (1%) and break fee (4%)

#### Fee Management

- `setFee(uint256 newFee)`: Sets the general fee (currently under review)
- `setWithdrawalFee(uint256 newFee)`: Sets the fee for withdrawals
- `setBreakFee(uint256 newFee)`: Sets the fee for breaking bonds

#### Security Controls

- `pause()`: Pauses all contract operations
- `unpause()`: Resumes contract operations
- `isPaused()`: Returns current pause status

### Core Bond Functions

#### Deposit

```solidity
function deposit(uint256 amount, address partner) external
```

Before calling the deposit function, users must first approve the TrustBond contract to spend their tokens:

```solidity
// First approve the TrustBond contract to spend tokens
token.approve(trustBondAddress, amount);
// Then make the deposit
trustBond.deposit(amount, partner);
```

**Requirements:**

- Amount must be greater than 0
- Sufficient balance and allowance:
  - User must have enough tokens in their wallet
  - User must have approved the TrustBond contract to spend their tokens
- Cannot bond with yourself (sender address cannot be the same as partner address)
- Both parties must have valid Gitcoin Passport scores:
  - Both sender and partner must have a score ≥ 20
  - This prevents Sybil attacks and ensures user legitimacy

**Process:**

1. Validates all requirements (reverts if any check fails)
2. Transfers tokens from sender to contract
3. Supplies tokens to AAVE pool for yield generation
4. Creates or updates bond record:
   - If no existing bond: Creates new bond with specified amount
   - If existing bond: Updates amount and lastUpdated timestamp

**Example usage:**

1. Creating bond without passport:

   ```mermaid
   sequenceDiagram
       participant User
       participant TrustBond
       participant PassportDecoder

       User->>TrustBond: deposit(100, partner)
       TrustBond->>PassportDecoder: getScore(user)
       PassportDecoder-->>TrustBond: score < REQUIRED_SCORE
       TrustBond-->>User: Revert: insufficient passport score
   ```

2. Creating bond with user without passport:

   ```mermaid
   sequenceDiagram
       participant User
       participant TrustBond
       participant PassportDecoder

       Note over User: User has valid score
       User->>TrustBond: deposit(100, partner)
       TrustBond->>PassportDecoder: getScore(partner)
       PassportDecoder-->>TrustBond: score < REQUIRED_SCORE
       TrustBond-->>User: Revert: partner has insufficient score
   ```

3. Successful bond creation:

   ```mermaid
   sequenceDiagram
       participant User
       participant TrustBond
       participant PassportDecoder
       participant Token
       participant AAVEPool

       Note over User,PassportDecoder: Both user and partner have valid scores
       User->>Token: approve(trustBond, 100)
       User->>TrustBond: deposit(100, partner)
       TrustBond->>PassportDecoder: getScore(user)
       PassportDecoder-->>TrustBond: score ≥ REQUIRED_SCORE
       TrustBond->>PassportDecoder: getScore(partner)
       PassportDecoder-->>TrustBond: score ≥ REQUIRED_SCORE
       TrustBond->>Token: transferFrom(user, trustBond, 100)
       TrustBond->>AAVEPool: supply(100)
       TrustBond->>TrustBond: Create/update bond record
       TrustBond-->>User: Emit BondCreated event
   ```

**Bond State After Deposit:**
After a successful deposit, you can query the bond state:

```solidity
Bond memory bond = trustBond.bond(sender, partner);
// bond.partner == partner address
// bond.amount == deposited amount
// bond.createdAt == timestamp of creation
// bond.lastUpdated == timestamp of last update
```

**Events Emitted:**

- `BondCreated(address indexed partner1, address indexed partner2, uint256 amount)`: Emitted when a new bond is created or updated

#### Withdraw

```solidity
function withdraw(address partner) external
```

**Requirements:**

- Both parties must have active bonds
- Bond amounts must match

**Process:**

1. Withdraws tokens from AAVE pool
2. Applies withdrawal fee (1%)
3. Distributes tokens to both parties

#### Break Bond

```solidity
function breakBond(address partner) external
```

**Process:**

1. Withdraws total bonded amount from AAVE pool
2. Applies break fee (4%)
3. Returns remaining tokens to the breaker

### View Functions

#### Bond Information

- `bond(address partner1, address partner2)`: Returns bond details between two partners
- `bonds(address user)`: Returns array of all bonds for a user

#### Fee Information

- `fee()`: Returns general fee
- `withdrawalFee()`: Returns withdrawal fee percentage
- `breakFee()`: Returns bond breaking fee percentage
- `communityPoolBalance()`: Returns contract's token balance

#### Score Functions (To Be Implemented)

- `personMultiplier(address user)`
- `score(address user)`

## Security Features

1. **Access Control**

   - Owner-only functions protected by `onlyOwner` modifier
   - Emergency pause mechanism

2. **Sybil Resistance**

   - Integration with Gitcoin Passport
   - Minimum score requirement

3. **Economic Security**
   - Fee mechanisms to discourage malicious behavior
   - Withdrawal and break fees

## Constants

- `REQUIRED_SCORE`: 20 (Minimum Gitcoin Passport score)
- Withdrawal Fee: 1%
- Break Fee: 4%

## Events

The contract emits the following events:

- `FeeUpdated(uint256 newFee)`
- `CommunityPoolDeposited(uint256 amount)`
- `CommunityPoolWithdrawn(uint256 amount)`
- `RewardsWithdrawn(address indexed user, uint256 amount)`
- `BondCreated(address indexed partner1, address indexed partner2, uint256 amount)`
- `BondBroken(address indexed breaker, address indexed partner, uint256 amount)`
- `Paused(bool paused)`
