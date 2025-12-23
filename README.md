# PULSE - Social Ritual dApp

![PULSE Logo](https://img.shields.io/badge/PULSE-Social_Ritual-FF6B00?style=for-the-badge&logo=lightning&logoColor=white)

> The world's first decentralized social heartbeat. Join thousands in daily on-chain rituals across 20+ blockchain networks.

## 🌟 Overview

PULSE is a social coordination game where users sync their daily check-ins across timezones. Complete rituals, build streaks, earn rewards, and become part of the global pulse. Every action is recorded on-chain, creating a permanent record of your participation in this unique social experiment.

## ✨ Features

- **🎯 Daily Rituals**: Complete 10 unique on-chain interactions daily
- **🌐 Multi-Chain Support**: Connect from 20+ blockchain networks
- **👥 Social Coordination**: Nudge friends, relay signals, unlock combo multipliers
- **🔥 Streak Building**: Maintain daily streaks for exclusive badges and rewards
- **💰 Stake & Earn**: High-risk, high-reward staking options
- **🎁 Rare Rewards**: Collect time-stamped NFT badges and unlock mystery capsules

## 🔗 Supported Networks

### Mainnets
- Ethereum
- Polygon
- Optimism
- Arbitrum
- Base
- Binance Smart Chain (BSC)
- Avalanche
- Gnosis Chain
- zkSync
- Polygon zkEVM
- Celo
- Aurora

### Testnets
- Sepolia (Ethereum)
- Polygon Amoy
- Optimism Sepolia
- Base Sepolia
- Arbitrum Sepolia
- Avalanche Fuji
- BSC Testnet

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun
- A Web3 wallet (MetaMask, WalletConnect, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd klock
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_PROJECT_ID=your_reown_project_id
   ```
   
   Get your Project ID from [Reown Cloud](https://cloud.reown.com)

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
klock/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles and CSS variables
│   │   ├── layout.tsx            # Root layout with Space Grotesk font
│   │   ├── page.tsx              # Landing page with hero, features, etc.
│   │   ├── icon.png              # Favicon (PULSE logo)
│   │   └── favicon.ico           # Legacy favicon
│   ├── components/
│   │   ├── ConnectButton.tsx     # Wallet connection button
│   │   ├── QuestDashboard.tsx    # Main quest dashboard
│   │   └── EngagementCard.tsx    # Individual quest cards
│   ├── config/
│   │   └── index.tsx             # AppKit & network configuration
│   └── context/
│       └── index.tsx             # AppKit context provider
├── public/                       # Static assets
├── .env.local                    # Environment variables (not committed)
├── next.config.ts                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── package.json                  # Project dependencies
```

## 🎨 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Web3**: 
  - [Reown AppKit](https://reown.com/) (formerly WalletConnect)
  - [Wagmi](https://wagmi.sh/)
- **Font**: Space Grotesk (Google Fonts)

## 🎮 How to Use

1. **Connect Your Wallet**
   - Click "Connect Wallet" in the navigation
   - Choose your preferred network from 20+ options
   - Approve the connection in your wallet

2. **Complete Daily Rituals**
   - View 10 available daily quests
   - Click on any quest to complete it
   - Earn Pulse Points for each action

3. **Build Your Streak**
   - Complete quests daily to maintain your streak
   - Unlock combo multipliers by completing specific quest combinations
   - Friends can save your streak if you miss a day

4. **Earn Rewards**
   - Collect time-stamped NFT badges
   - Unlock exclusive milestone rewards
   - Open mystery capsules for rare items

## 🔧 Configuration

### Network Configuration

Edit `/src/config/index.tsx` to modify supported networks:

```typescript
export const networks = [
  mainnet,
  polygon,
  optimism,
  // Add or remove networks as needed
]
```

### Styling

- **Global styles**: `/src/app/globals.css`
- **Color palette**: Defined in CSS variables
- **Primary color**: `#FF6B00` (Orange)
- **Font**: Space Grotesk

## 📱 Responsive Design

PULSE is fully responsive and optimized for:
- 📱 Mobile devices (375px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1920px+)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- **Documentation**: [Coming Soon]
- **Discord**: [Coming Soon]
- **Twitter**: [Coming Soon]
- **GitHub**: [Repository URL]

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Reown AppKit](https://reown.com/)
- Icons by [Lucide](https://lucide.dev/)
- Font by [Google Fonts](https://fonts.google.com/)

---

**© 2025 PULSE. All rights reserved. Built with ❤️ for the global community.**
