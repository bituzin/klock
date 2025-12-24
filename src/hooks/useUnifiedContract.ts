'use client'

import { useCallback, useMemo } from 'react'
import { useAppKitAccount } from '@reown/appkit/react'
import { usePulseContract } from './usePulseContract'
import { useStacksWallet } from './useStacksWallet'
import { QUEST_IDS, QUEST_POINTS, STACKS_CONTRACTS } from '@/config/contracts'

// Re-export types
export type { UserProfile, GlobalStats, ContractInfo } from './usePulseContract'

// Unified user profile type
export interface UnifiedUserProfile {
    totalPoints: number
    currentStreak: number
    longestStreak: number
    level: number
    totalCheckins: number
    exists: boolean
}

// Unified contract info
export interface UnifiedContractInfo {
    chainType: 'base' | 'stacks' | 'unknown'
    network: 'testnet' | 'mainnet'
    contractAddress: string
    explorerUrl: string
}

/**
 * Unified hook that automatically routes to the correct contract (Base or Stacks)
 * based on the connected wallet's network
 * 
 * For Base (EVM): Uses AppKit + wagmi hooks
 * For Stacks: Uses Reown's stx_callContract RPC method via WalletConnect
 */
export function useUnifiedContract() {
    const { isConnected: isAppKitConnected, address: appKitAddress } = useAppKitAccount()

    // Get both contract systems
    const baseContract = usePulseContract()
    const stacksWallet = useStacksWallet()

    // Determine which contract to use based on address prefix
    const activeContract = useMemo(() => {
        // Check if connected with a Stacks address (SP/ST prefix)
        if (stacksWallet.isConnected) return 'stacks'

        // Check if connected to Base EVM network
        if (isAppKitConnected && baseContract.isBaseNetwork) return 'base'

        return 'none'
    }, [stacksWallet.isConnected, isAppKitConnected, baseContract.isBaseNetwork])

    // Determine the Stacks address
    const stacksAddress = stacksWallet.address

    // Unified user profile
    const userProfile: UnifiedUserProfile | null = useMemo(() => {
        if (activeContract === 'base' && baseContract.userProfile) {
            return {
                totalPoints: Number(baseContract.userProfile.totalPoints),
                currentStreak: Number(baseContract.userProfile.currentStreak),
                longestStreak: Number(baseContract.userProfile.longestStreak),
                level: Number(baseContract.userProfile.level),
                totalCheckins: Number(baseContract.userProfile.totalCheckins),
                exists: baseContract.userProfile.exists,
            }
        }
        if (activeContract === 'stacks' && stacksWallet.userProfile) {
            return {
                totalPoints: stacksWallet.userProfile.totalPoints,
                currentStreak: stacksWallet.userProfile.currentStreak,
                longestStreak: stacksWallet.userProfile.longestStreak,
                level: stacksWallet.userProfile.level,
                totalCheckins: stacksWallet.userProfile.totalCheckins,
                exists: true,
            }
        }
        return null
    }, [activeContract, baseContract.userProfile, stacksWallet.userProfile])

    // Unified contract info
    const contractInfo: UnifiedContractInfo = useMemo(() => {
        if (activeContract === 'base') {
            return {
                chainType: 'base' as const,
                network: baseContract.isTestnet ? 'testnet' as const : 'mainnet' as const,
                contractAddress: baseContract.contractAddress || '',
                explorerUrl: baseContract.contractInfo.explorerUrl,
            }
        }
        if (activeContract === 'stacks') {
            return {
                chainType: 'stacks' as const,
                network: stacksWallet.contractInfo.network,
                contractAddress: stacksWallet.contractInfo.contractAddress,
                explorerUrl: stacksWallet.contractInfo.explorerUrl,
            }
        }
        return {
            chainType: 'unknown' as const,
            network: 'testnet' as const,
            contractAddress: '',
            explorerUrl: '',
        }
    }, [activeContract, baseContract, stacksWallet])

    // Unified loading state
    const isLoading = baseContract.isLoading || stacksWallet.isLoading

    // Unified error state
    const error = baseContract.error || stacksWallet.error

    // Unified quest execution - routes to correct contract
    const dailyCheckin = useCallback(async () => {
        if (activeContract === 'base') return baseContract.dailyCheckin()
        if (activeContract === 'stacks') return stacksWallet.dailyCheckin()
        return { success: false, error: 'No supported network connected' }
    }, [activeContract, baseContract, stacksWallet])

    const relaySignal = useCallback(async () => {
        if (activeContract === 'base') return baseContract.relaySignal()
        if (activeContract === 'stacks') return stacksWallet.relaySignal()
        return { success: false, error: 'No supported network connected' }
    }, [activeContract, baseContract, stacksWallet])

    const updateAtmosphere = useCallback(async (weatherCode: number) => {
        if (activeContract === 'base') return baseContract.updateAtmosphere(weatherCode)
        if (activeContract === 'stacks') return stacksWallet.updateAtmosphere(weatherCode)
        return { success: false, error: 'No supported network connected' }
    }, [activeContract, baseContract, stacksWallet])

    const nudgeFriend = useCallback(async (friendAddress: string) => {
        if (activeContract === 'base') return baseContract.nudgeFriend(friendAddress)
        if (activeContract === 'stacks') return stacksWallet.nudgeFriend(friendAddress)
        return { success: false, error: 'No supported network connected' }
    }, [activeContract, baseContract, stacksWallet])

    const commitMessage = useCallback(async (message: string) => {
        if (activeContract === 'base') return baseContract.commitMessage(message)
        if (activeContract === 'stacks') return stacksWallet.commitMessage(message)
        return { success: false, error: 'No supported network connected' }
    }, [activeContract, baseContract, stacksWallet])

    const predictPulse = useCallback(async (level: number) => {
        if (activeContract === 'base') return baseContract.predictPulse(level)
        if (activeContract === 'stacks') return stacksWallet.predictPulse(level)
        return { success: false, error: 'No supported network connected' }
    }, [activeContract, baseContract, stacksWallet])

    const claimDailyCombo = useCallback(async () => {
        if (activeContract === 'base') return baseContract.claimDailyCombo()
        if (activeContract === 'stacks') return stacksWallet.claimDailyCombo()
        return { success: false, error: 'No supported network connected' }
    }, [activeContract, baseContract, stacksWallet])

    // Unified refresh
    const refreshData = useCallback(async () => {
        if (activeContract === 'base') return baseContract.refreshData()
        if (activeContract === 'stacks') return stacksWallet.refreshData()
    }, [activeContract, baseContract, stacksWallet])

    // Check if quest is completed
    const isQuestCompleted = useCallback((questId: number): boolean => {
        if (activeContract === 'base') return baseContract.isQuestCompleted(questId)
        if (activeContract === 'stacks') return stacksWallet.isQuestCompleted(questId)
        return false
    }, [activeContract, baseContract, stacksWallet])

    // Check combo availability
    const checkComboAvailable = useCallback(async (): Promise<boolean> => {
        if (activeContract === 'base') return baseContract.checkComboAvailable()
        // For Stacks, check locally based on completed quests
        if (activeContract === 'stacks') {
            const hasCheckin = stacksWallet.isQuestCompleted(QUEST_IDS.DAILY_CHECKIN)
            const hasAtmosphere = stacksWallet.isQuestCompleted(QUEST_IDS.UPDATE_ATMOSPHERE)
            const hasMessage = stacksWallet.isQuestCompleted(QUEST_IDS.COMMIT_MESSAGE)
            return hasCheckin && hasAtmosphere && hasMessage
        }
        return false
    }, [activeContract, baseContract, stacksWallet])

    return {
        // Connection state
        isConnected: activeContract !== 'none',
        activeContract,
        chainType: activeContract === 'base' ? 'evm' : activeContract === 'stacks' ? 'stacks' : 'unknown',

        // Stacks address
        stacksAddress,

        // Contract info
        contractInfo,

        // User data
        userProfile,
        globalStats: baseContract.globalStats, // Only available on Base for now

        // Loading/error states
        isLoading,
        error,

        // Quest actions
        dailyCheckin,
        relaySignal,
        updateAtmosphere,
        nudgeFriend,
        commitMessage,
        predictPulse,
        claimDailyCombo,

        // Utilities
        refreshData,
        isQuestCompleted,
        checkComboAvailable,

        // Raw contract instances (for advanced use)
        baseContract,
        stacksWallet,

        // Quest metadata
        QUEST_IDS,
        QUEST_POINTS,
    }
}
