/**
 * PULSE Contract Configuration
 * 
 * This file contains all deployed contract addresses for both networks and chains.
 * The application automatically selects the correct contract based on the connected network.
 */

// Base (Ethereum L2) Contract Addresses
export const BASE_CONTRACTS = {
    // Base Sepolia Testnet (Chain ID: 84532)
    testnet: {
        chainId: 84532,
        address: '0x22E7AA46aDDF743c99322212852dB2FA17b404b2' as const,
        explorerUrl: 'https://sepolia.basescan.org/address/0x22E7AA46aDDF743c99322212852dB2FA17b404b2',
        rpcUrl: 'https://sepolia.base.org',
    },
    // Base Mainnet (Chain ID: 8453)
    mainnet: {
        chainId: 8453,
        address: '0xcF0A164b64b92Fa6262e312cDB60a12c302e8F1c' as const,
        explorerUrl: 'https://basescan.org/address/0xcF0A164b64b92Fa6262e312cDB60a12c302e8F1c',
        rpcUrl: 'https://mainnet.base.org',
    },
} as const;

// Stacks Contract Addresses
export const STACKS_CONTRACTS = {
    // Stacks Testnet
    testnet: {
        network: 'testnet',
        contractAddress: 'ST31DP8F8CF2GXSZBHHHK5J6Y061744E1TP7FRGHT',
        contractName: 'pulse',
        fullContractId: 'ST31DP8F8CF2GXSZBHHHK5J6Y061744E1TP7FRGHT.pulse',
        explorerUrl: 'https://explorer.hiro.so/txid/ST31DP8F8CF2GXSZBHHHK5J6Y061744E1TP7FRGHT.pulse?chain=testnet',
        apiUrl: 'https://api.testnet.hiro.so',
    },
    // Stacks Mainnet
    mainnet: {
        network: 'mainnet',
        contractAddress: 'SP31DP8F8CF2GXSZBHHHK5J6Y061744E1TNFGYWYV',
        contractName: 'pulse',
        fullContractId: 'SP31DP8F8CF2GXSZBHHHK5J6Y061744E1TNFGYWYV.pulse',
        explorerUrl: 'https://explorer.hiro.so/txid/SP31DP8F8CF2GXSZBHHHK5J6Y061744E1TNFGYWYV.pulse?chain=mainnet',
        apiUrl: 'https://api.mainnet.hiro.so',
    },
} as const;

// Chain IDs for network detection
export const CHAIN_IDS = {
    // EVM Chains
    BASE_MAINNET: 8453,
    BASE_SEPOLIA: 84532,
    ETHEREUM_MAINNET: 1,
    ETHEREUM_SEPOLIA: 11155111,
    // Note: Stacks uses different network detection (not chain IDs)
} as const;

// Testnet chain IDs for automatic detection
export const TESTNET_CHAIN_IDS: number[] = [
    CHAIN_IDS.BASE_SEPOLIA,
    CHAIN_IDS.ETHEREUM_SEPOLIA,
];

// Mainnet chain IDs
export const MAINNET_CHAIN_IDS: number[] = [
    CHAIN_IDS.BASE_MAINNET,
    CHAIN_IDS.ETHEREUM_MAINNET,
];

/**
 * Get the appropriate Base contract based on the connected chain ID
 */
export function getBaseContract(chainId: number) {
    if (chainId === BASE_CONTRACTS.mainnet.chainId) {
        return BASE_CONTRACTS.mainnet;
    }
    // Default to testnet for any other chain (including testnets)
    return BASE_CONTRACTS.testnet;
}

/**
 * Get the appropriate Stacks contract based on the network
 */
export function getStacksContract(isMainnet: boolean) {
    return isMainnet ? STACKS_CONTRACTS.mainnet : STACKS_CONTRACTS.testnet;
}

/**
 * Determine if the connected chain is a testnet
 */
export function isTestnet(chainId: number): boolean {
    return TESTNET_CHAIN_IDS.includes(chainId);
}

/**
 * Determine if the chain is a Base network
 */
export function isBaseNetwork(chainId: number): boolean {
    return chainId === CHAIN_IDS.BASE_MAINNET || chainId === CHAIN_IDS.BASE_SEPOLIA;
}

// Contract ABI (shared between testnet and mainnet)
export const PULSE_ABI = [
    // Quest Functions
    {
        name: 'dailyCheckin',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [],
        outputs: [{ name: 'pointsEarned', type: 'uint256' }],
    },
    {
        name: 'relaySignal',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [],
        outputs: [{ name: 'pointsEarned', type: 'uint256' }],
    },
    {
        name: 'updateAtmosphere',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'weatherCode', type: 'uint8' }],
        outputs: [{ name: 'pointsEarned', type: 'uint256' }],
    },
    {
        name: 'nudgeFriend',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'friend', type: 'address' }],
        outputs: [{ name: 'pointsEarned', type: 'uint256' }],
    },
    {
        name: 'commitMessage',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'message', type: 'string' }],
        outputs: [{ name: 'pointsEarned', type: 'uint256' }],
    },
    {
        name: 'predictPulse',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'predictedLevel', type: 'uint8' }],
        outputs: [{ name: 'pointsEarned', type: 'uint256' }],
    },
    {
        name: 'claimDailyCombo',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [],
        outputs: [{ name: 'bonusPoints', type: 'uint256' }],
    },
    // View Functions
    {
        name: 'getUserProfile',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'user', type: 'address' }],
        outputs: [
            {
                name: '',
                type: 'tuple',
                components: [
                    { name: 'totalPoints', type: 'uint256' },
                    { name: 'currentStreak', type: 'uint256' },
                    { name: 'longestStreak', type: 'uint256' },
                    { name: 'lastCheckinTime', type: 'uint256' },
                    { name: 'totalCheckins', type: 'uint256' },
                    { name: 'level', type: 'uint256' },
                    { name: 'stakedAmount', type: 'uint256' },
                    { name: 'joinedTime', type: 'uint256' },
                    { name: 'exists', type: 'bool' },
                ],
            },
        ],
    },
    {
        name: 'getCurrentDay',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        name: 'getGlobalStats',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [
            { name: '_totalUsers', type: 'uint256' },
            { name: '_totalCheckins', type: 'uint256' },
            { name: '_totalPointsDistributed', type: 'uint256' },
        ],
    },
    {
        name: 'hasCompletedQuestToday',
        type: 'function',
        stateMutability: 'view',
        inputs: [
            { name: 'user', type: 'address' },
            { name: 'questId', type: 'uint8' },
        ],
        outputs: [{ name: '', type: 'bool' }],
    },
    {
        name: 'isComboAvailable',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'user', type: 'address' }],
        outputs: [{ name: '', type: 'bool' }],
    },
    // Events
    {
        name: 'UserJoined',
        type: 'event',
        inputs: [
            { name: 'user', type: 'address', indexed: true },
            { name: 'timestamp', type: 'uint256', indexed: false },
        ],
    },
    {
        name: 'QuestCompleted',
        type: 'event',
        inputs: [
            { name: 'user', type: 'address', indexed: true },
            { name: 'questId', type: 'uint8', indexed: true },
            { name: 'pointsEarned', type: 'uint256', indexed: false },
            { name: 'day', type: 'uint256', indexed: false },
        ],
    },
    {
        name: 'StreakUpdated',
        type: 'event',
        inputs: [
            { name: 'user', type: 'address', indexed: true },
            { name: 'newStreak', type: 'uint256', indexed: false },
            { name: 'longestStreak', type: 'uint256', indexed: false },
        ],
    },
    {
        name: 'ComboActivated',
        type: 'event',
        inputs: [
            { name: 'user', type: 'address', indexed: true },
            { name: 'bonusPoints', type: 'uint256', indexed: false },
            { name: 'day', type: 'uint256', indexed: false },
        ],
    },
] as const;

// Quest IDs (matching contract constants)
export const QUEST_IDS = {
    DAILY_CHECKIN: 1,
    RELAY_SIGNAL: 2,
    UPDATE_ATMOSPHERE: 3,
    NUDGE_FRIEND: 4,
    MINT_HOUR_BADGE: 5,
    COMMIT_MESSAGE: 6,
    STAKE_STREAK: 7,
    CLAIM_MILESTONE: 8,
    PREDICT_PULSE: 9,
    OPEN_CAPSULE: 10,
} as const;

// Points per quest (matching contract constants)
export const QUEST_POINTS = {
    [QUEST_IDS.DAILY_CHECKIN]: 50,
    [QUEST_IDS.RELAY_SIGNAL]: 100,
    [QUEST_IDS.UPDATE_ATMOSPHERE]: 30,
    [QUEST_IDS.NUDGE_FRIEND]: 40,
    [QUEST_IDS.MINT_HOUR_BADGE]: 60,
    [QUEST_IDS.COMMIT_MESSAGE]: 20,
    [QUEST_IDS.STAKE_STREAK]: 200,
    [QUEST_IDS.CLAIM_MILESTONE]: 500,
    [QUEST_IDS.PREDICT_PULSE]: 80,
    [QUEST_IDS.OPEN_CAPSULE]: 1000,
} as const;
