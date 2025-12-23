# PULSE Smart Contracts

This directory contains the smart contracts for the PULSE Daily Ritual dApp, implemented for both Stacks (Clarity) and Base/Ethereum (Solidity).

## 📁 Directory Structure

```
contracts/
├── clarity/           # Stacks blockchain (Clarity 4)
│   ├── pulse.clar     # Main contract
│   ├── Clarinet.toml  # Project config
│   └── deployments/   # Deployment configs
│
└── solidity/          # Base/Ethereum (Solidity)
    ├── Pulse.sol      # Main contract
    ├── package.json   # Dependencies
    ├── hardhat.config.js
    └── scripts/
        └── deploy.js
```

## 🔧 Features

Both contracts implement the same core functionality:

### Quest System (10 Daily Quests)
| ID | Quest | Points | Description |
|----|-------|--------|-------------|
| 1 | Daily Check-In | 50 | Secure your streak |
| 2 | Relay Signal | 100 | Pass the torch to another timezone |
| 3 | Update Atmosphere | 30 | Sync local weather to chain |
| 4 | Nudge Friend | 40 | Ping a friend to save their streak |
| 5 | Mint Hour Badge | 60 | Collect unique hour stamps |
| 6 | Commit Message | 20 | Etch your mood on the ticker |
| 7 | Stake for Streak | 200 | High risk, high reward |
| 8 | Claim Milestone | 500 | Evolve your profile level |
| 9 | Predict Pulse | 80 | Vote on tomorrow's activity |
| 10 | Open Capsule | 1000 | Reveal long-term rewards |

### Streak System
- Consecutive daily check-ins build streaks
- 2-day grace period for broken streaks
- Streak multipliers:
  - Days 1-7: 1x points
  - Days 8-30: 2x points
  - Days 31+: 3x points

### Combo System
Complete quests 1, 3, and 6 within 5 hours to activate the Daily Triple Combo for bonus points!

## 🛡️ Security Features

### Clarity Contract
- No loops (prevents DoS attacks)
- Block-height based timing (immutable)
- Principal-based access control
- Input validation on all functions
- No unbounded data structures

### Solidity Contract
- OpenZeppelin ReentrancyGuard
- OpenZeppelin Pausable
- OpenZeppelin Ownable (access control)
- Built-in Solidity 0.8+ overflow protection
- Gas-optimized with bitmap quest tracking

---

## Stacks (Clarity) Deployment

### Prerequisites
- [Clarinet](https://github.com/hirosystems/clarinet) installed
- Stacks testnet STX tokens ([faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet))

### Setup
```bash
cd contracts/clarity

# Check contract
clarinet check

# Run tests
clarinet test

# Open console for testing
clarinet console
```

### Deploy to Testnet
```bash
# Set your mnemonic
export STACKS_DEPLOYER_MNEMONIC="your 24 word mnemonic"

# Deploy
clarinet deployment apply -p deployments/testnet.devnet-plan.yaml
```

### Contract Address Format
After deployment, your contract will be at:
```
ST<YOUR_ADDRESS>.pulse
```

---

## Base/Ethereum (Solidity) Deployment

### Prerequisites
- Node.js 18+
- Base Sepolia ETH ([faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet))

### Setup
```bash
cd contracts/solidity

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your private key
```

### Compile
```bash
npm run compile
```

### Deploy to Base Sepolia Testnet
```bash
npm run deploy:base-sepolia
```

### Deploy to Base Mainnet
```bash
npm run deploy:base
```

### Verify on Basescan
Contract verification is automatic during deployment if `BASESCAN_API_KEY` is set.

---

## 📖 Contract API Reference

### Clarity Functions

```clarity
;; Quests
(daily-checkin)                              ;; Quest 1
(relay-signal)                               ;; Quest 2  
(update-atmosphere (weather-code uint))      ;; Quest 3
(nudge-friend (friend principal))            ;; Quest 4
(commit-message (message (string-utf8 280))) ;; Quest 6
(predict-pulse (predicted-level uint))       ;; Quest 9
(claim-daily-combo)                          ;; Combo bonus

;; Read-only
(get-user-profile (user principal))
(get-daily-quest-status (user principal) (day uint))
(get-day)
(get-global-stats)
(has-completed-quest-today (user principal) (quest-id uint))
(is-combo-available (user principal))
```

### Solidity Functions

```solidity
// Quests
function dailyCheckin() external returns (uint256 pointsEarned)
function relaySignal() external returns (uint256 pointsEarned)
function updateAtmosphere(uint8 weatherCode) external returns (uint256 pointsEarned)
function nudgeFriend(address friend) external returns (uint256 pointsEarned)
function commitMessage(string calldata message) external returns (uint256 pointsEarned)
function predictPulse(uint8 predictedLevel) external returns (uint256 pointsEarned)
function claimDailyCombo() external returns (uint256 bonusPoints)

// Views
function getUserProfile(address user) external view returns (UserProfile memory)
function getDailyQuestStatus(address user, uint256 day) external view returns (DailyQuestStatus memory)
function getCurrentDay() external view returns (uint256)
function getGlobalStats() external view returns (uint256, uint256, uint256)
function hasCompletedQuestToday(address user, uint8 questId) external view returns (bool)
function isComboAvailable(address user) external view returns (bool)
```

---

## 🧪 Testing

### Clarity Tests
```bash
cd contracts/clarity
clarinet test
```

### Solidity Tests
```bash
cd contracts/solidity
npm test
```

---

## 📄 License

MIT License - see LICENSE file for details.
