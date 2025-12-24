/**
 * Leaderboard API utilities
 * Fetches user data from Base and Stacks contracts to build leaderboard
 */

import { BASE_CONTRACTS, STACKS_CONTRACTS, PULSE_ABI } from '@/config/contracts'
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import { cvToHex, principalCV, hexToCV, ClarityType } from '@stacks/transactions'

export interface LeaderboardEntry {
    rank: number
    address: string
    displayAddress: string
    totalPoints: number
    level: number
    streak: number
    network: 'base' | 'stacks'
}

export interface GlobalStats {
    totalUsers: number
    totalPoints: number
    highestStreak: number
    avgLevel: number
}

// Known active addresses for demo (in production, you'd get these from events/indexer)
// These are example addresses - replace with actual active users from your contracts
const KNOWN_BASE_ADDRESSES: string[] = [
    '0xcF0A164b64b92Fa6262e312cDB60a12c302e8F1c', // Contract deployer
]

const KNOWN_STACKS_ADDRESSES: string[] = [
    'SP2KZ109PC2HRFH8T37ZDBVAQF2DK38RTXQSBK80T', // Example user
]

// Create Base public client for reading contract
const baseClient = createPublicClient({
    chain: base,
    transport: http(BASE_CONTRACTS.mainnet.rpcUrl),
})

/**
 * Fetch user profile from Base contract
 */
async function fetchBaseUserProfile(address: string): Promise<LeaderboardEntry | null> {
    try {
        const result = await baseClient.readContract({
            address: BASE_CONTRACTS.mainnet.address,
            abi: PULSE_ABI,
            functionName: 'getUserProfile',
            args: [address as `0x${string}`],
        }) as any

        if (!result || !result.exists) return null

        return {
            rank: 0, // Will be assigned after sorting
            address: address,
            displayAddress: `${address.slice(0, 6)}...${address.slice(-4)}`,
            totalPoints: Number(result.totalPoints || 0),
            level: Number(result.level || 1),
            streak: Number(result.currentStreak || 0),
            network: 'base',
        }
    } catch (err) {
        console.error(`[Leaderboard] Error fetching Base profile for ${address}:`, err)
        return null
    }
}

/**
 * Fetch user profile from Stacks contract
 */
async function fetchStacksUserProfile(address: string): Promise<LeaderboardEntry | null> {
    try {
        const contractInfo = STACKS_CONTRACTS.mainnet
        const response = await fetch(
            `${contractInfo.apiUrl}/v2/contracts/call-read/${contractInfo.contractAddress}/${contractInfo.contractName}/get-user-profile`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender: address,
                    arguments: [cvToHex(principalCV(address))],
                }),
            }
        )

        if (!response.ok) return null

        const data = await response.json()
        if (!data.okay || data.result === '0x09') return null // None

        const cv = hexToCV(data.result) as any
        if ((cv.type === 'some' || cv.type === ClarityType.OptionalSome) && cv.value) {
            const tuple = cv.value
            const profileData = tuple.value || tuple.data

            if (profileData) {
                return {
                    rank: 0,
                    address: address,
                    displayAddress: `${address.slice(0, 6)}...${address.slice(-4)}`,
                    totalPoints: Number(profileData['total-points']?.value ?? 0),
                    level: Number(profileData['level']?.value ?? 1),
                    streak: Number(profileData['current-streak']?.value ?? 0),
                    network: 'stacks',
                }
            }
        }

        return null
    } catch (err) {
        console.error(`[Leaderboard] Error fetching Stacks profile for ${address}:`, err)
        return null
    }
}

/**
 * Fetch Base global stats
 */
async function fetchBaseGlobalStats(): Promise<{ totalUsers: number; totalPoints: number } | null> {
    try {
        const result = await baseClient.readContract({
            address: BASE_CONTRACTS.mainnet.address,
            abi: PULSE_ABI,
            functionName: 'getGlobalStats',
            args: [],
        }) as any

        return {
            totalUsers: Number(result[0] || 0),
            totalPoints: Number(result[2] || 0),
        }
    } catch (err) {
        console.error('[Leaderboard] Error fetching Base global stats:', err)
        return null
    }
}

/**
 * Fetch top users from contract events (simplified - in production use an indexer)
 * For now, we'll fetch from a curated list + the current connected user
 */
export async function fetchLeaderboard(
    network: 'all' | 'base' | 'stacks',
    connectedAddress?: string
): Promise<{ entries: LeaderboardEntry[]; stats: GlobalStats }> {
    const entries: LeaderboardEntry[] = []

    // Fetch Base users
    if (network === 'all' || network === 'base') {
        const baseAddresses = [...KNOWN_BASE_ADDRESSES]

        // Add connected address if it's a Base address
        if (connectedAddress && connectedAddress.startsWith('0x') && !baseAddresses.includes(connectedAddress as any)) {
            baseAddresses.push(connectedAddress)
        }

        const baseProfiles = await Promise.all(
            baseAddresses.map(addr => fetchBaseUserProfile(addr))
        )
        entries.push(...baseProfiles.filter((p): p is LeaderboardEntry => p !== null && p.totalPoints > 0))
    }

    // Fetch Stacks users
    if (network === 'all' || network === 'stacks') {
        const stacksAddresses = [...KNOWN_STACKS_ADDRESSES]

        // Add connected address if it's a Stacks address
        if (connectedAddress && connectedAddress.startsWith('SP') && !stacksAddresses.includes(connectedAddress as any)) {
            stacksAddresses.push(connectedAddress)
        }

        const stacksProfiles = await Promise.all(
            stacksAddresses.map(addr => fetchStacksUserProfile(addr))
        )
        entries.push(...stacksProfiles.filter((p): p is LeaderboardEntry => p !== null && p.totalPoints > 0))
    }

    // Sort by total points descending
    entries.sort((a, b) => b.totalPoints - a.totalPoints)

    // Assign ranks
    entries.forEach((entry, idx) => {
        entry.rank = idx + 1
    })

    // Calculate stats
    const stats: GlobalStats = {
        totalUsers: entries.length,
        totalPoints: entries.reduce((sum, e) => sum + e.totalPoints, 0),
        highestStreak: Math.max(...entries.map(e => e.streak), 0),
        avgLevel: entries.length > 0
            ? Math.round((entries.reduce((sum, e) => sum + e.level, 0) / entries.length) * 10) / 10
            : 0,
    }

    // Try to get actual global stats from Base
    const baseStats = await fetchBaseGlobalStats()
    if (baseStats) {
        stats.totalUsers = Math.max(stats.totalUsers, baseStats.totalUsers)
        stats.totalPoints = Math.max(stats.totalPoints, baseStats.totalPoints)
    }

    return { entries, stats }
}

/**
 * Format large numbers for display
 */
export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`
    }
    return num.toLocaleString()
}
