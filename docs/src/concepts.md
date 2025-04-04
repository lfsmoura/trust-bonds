# Core Concepts

## Trust Bond

A Trust Bond is a novel financial primitive that represents a mutual trust relationship between two parties on the blockchain. Key characteristics include:

- **Equal Contribution**: Both parties must contribute the same amount of tokens to form a bond
- **Mutual Access**: Either party can withdraw the full amount at any time
- **Yield Generation**: Bonded tokens are deposited into Aave to generate yield
- **Trust Quantification**: The bond amount represents the level of trust between parties
- **Sybil Resistance**: Integration with Gitcoin Passport ensures genuine user identities

## Bond States

### Active Bond

- Both parties have matching deposits
- Tokens are generating yield in Aave
- Either party can initiate withdrawals
- Bond details are tracked: partner addresses, amount, creation time, and last update

### Broken Bond

When trust is violated or a relationship needs to end:

- Either party can unilaterally break the bond
- Incurs a higher penalty (4% break fee) compared to mutual withdrawal
- Remaining funds are returned to the breaker
- The bond relationship is permanently terminated

## Economic Mechanisms

### Fee Structure

The project implements different fee levels to incentivize positive behavior:

- **Withdrawal Fee (1%)**: Applied when both parties mutually agree to withdraw
- **Break Fee (4%)**: Higher penalty for unilateral bond breaking
- Fees contribute to the community pool, supporting the project's sustainability

### Yield Generation

- Bonded tokens are automatically supplied to Aave's lending pool
- Participants earn higher-than-market-average yields on their locked tokens
- Yield serves as an incentive for maintaining long-term trust relationships

## Social Reputation

### On-chain Trust Network

- Each bond creates a verifiable trust connection between addresses
- Bond amounts indicate trust levels between participants
- Network of bonds forms a map of trust relationships in the ecosystem

### Identity Verification

- Integration with Gitcoin Passport for Sybil resistance
- Minimum score requirement (20) ensures legitimate participants
- Combines off-chain identity verification with on-chain actions

## Public Good Aspects

### Non-excludable Access

- Anyone meeting the minimum Passport score can participate
- No privileged access or special permissions required
- Open source and transparent implementation

### Community Benefits

- Creates a new primitive for establishing trust in Web3
- Enables reputation building through verifiable actions
- Supports coordination and collaboration in decentralized systems
- Fee structure maintains system sustainability

## Technical Safeguards

### Security Measures

- Pause mechanism for emergency situations
- Access controls for administrative functions
- Economic penalties to discourage malicious behavior
- Score-based participation requirements

### Smart Contract Integration

- Seamless integration with Aave for yield generation
- ERC20 token compatibility
- Gitcoin Passport integration for identity verification
