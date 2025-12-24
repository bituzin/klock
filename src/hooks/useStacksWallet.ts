'use client'

import { useCallback, useState, useMemo, useEffect } from 'react'
import { useAppKitAccount, modal } from '@reown/appkit/react'
import { STACKS_CONTRACTS } from '@/config/contracts'

// Types
export interface StacksUserProfile {
    totalPoints: number
    currentStreak: number
    longestStreak: number
    lastCheckinDay: number
    questBitmap: number
    level: number
    totalCheckins: number
}

export interface StacksContractInfo {
    network: 'testnet' | 'mainnet'
    contractAddress: string
    contractName: string
    fullContractId: string
    explorerUrl: string
}

/**
 * Helper to detect if an address is a Stacks address
 */
function isStacksAddress(address: string | undefined): boolean {
    if (!address) return false
    return address.startsWith('SP') || address.startsWith('ST')
}

/**
 * Helper to detect if address is mainnet Stacks
 */
function isStacksMainnet(address: string | undefined): boolean {
    if (!address) return false
    return address.startsWith('SP')
}

/**
 * Hook for Stacks contract interaction via Reown AppKit
 * Uses the Universal Provider to send stx_callContract RPC requests
 * 
 * Xverse/Leather connect via WalletConnect and support Stacks RPC methods
 */
export function useStacksWallet() {
    const { address, isConnected } = useAppKitAccount()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [userProfile, setUserProfile] = useState<StacksUserProfile | null>(null)

    // Check if this is a Stacks connection (address starts with SP/ST)
    const isStacksConnected = isConnected && isStacksAddress(address)
    const isMainnet = isStacksMainnet(address)

    // Get contract info based on network
    const contractInfo: StacksContractInfo = useMemo(() => {
        const contract = isMainnet ? STACKS_CONTRACTS.mainnet : STACKS_CONTRACTS.testnet
        return {
            ...contract,
            network: isMainnet ? 'mainnet' as const : 'testnet' as const,
        }
    }, [isMainnet])

    /**
     * Execute a contract call using the Universal Provider
     * This sends stx_callContract through the WalletConnect session
     */
    const executeContractCall = useCallback(async (
        functionName: string,
        functionArgs: string[] = []
    ): Promise<{ success: boolean; txId?: string; error?: string }> => {
        if (!isStacksConnected || !address) {
            return { success: false, error: 'Stacks wallet not connected' }
        }

        if (!modal) {
            return { success: false, error: 'AppKit not initialized' }
        }

        const contract = isMainnet ? STACKS_CONTRACTS.mainnet : STACKS_CONTRACTS.testnet

        setIsLoading(true)
        setError(null)

        console.log('[Stacks] Executing contract call via Universal Provider:', {
            contract: contract.fullContractId,
            functionName,
            functionArgs,
        })

        try {
            // Get the Universal Provider from AppKit
            const universalProvider = await modal.getUniversalProvider()

            if (!universalProvider) {
                throw new Error('Universal Provider not available')
            }

            console.log('[Stacks] Universal Provider obtained')
            console.log('[Stacks] Session:', universalProvider.session)

            // Get the active session topic
            const session = universalProvider.session
            if (!session) {
                throw new Error('No active WalletConnect session')
            }

            // Determine the chain ID for Stacks
            // Stacks mainnet: "stacks:1", testnet: "stacks:2147483648"
            const chainId = isMainnet ? 'stacks:1' : 'stacks:2147483648'

            console.log('[Stacks] Sending request to chain:', chainId)

            // Send the stx_callContract request through the session
            const result = await universalProvider.request({
                method: 'stx_callContract',
                params: {
                    contract: contract.fullContractId,
                    functionName,
                    functionArgs,
                }
            }, chainId)

            console.log('[Stacks] Transaction result:', result)
            setIsLoading(false)

            const txResult = result as { txid?: string; transaction?: string }
            if (txResult && txResult.txid) {
                return { success: true, txId: txResult.txid }
            }

            return { success: true, txId: txResult?.transaction }
        } catch (err: any) {
            const errorMessage = err?.message || err?.toString() || 'Transaction failed'
            console.error('[Stacks] Contract call error:', err)
            console.error('[Stacks] Error details:', JSON.stringify(err, null, 2))
            setError(errorMessage)
            setIsLoading(false)
            return { success: false, error: errorMessage }
        }
    }, [isStacksConnected, address, isMainnet])

    // Quest functions - pass Clarity-formatted arguments
    const dailyCheckin = useCallback(() =>
        executeContractCall('daily-checkin', []), [executeContractCall])

    const relaySignal = useCallback(() =>
        executeContractCall('relay-signal', []), [executeContractCall])

    const updateAtmosphere = useCallback((weatherCode: number) =>
        executeContractCall('update-atmosphere', [`u${weatherCode}`]), [executeContractCall])

    const nudgeFriend = useCallback((friendAddress: string) =>
        executeContractCall('nudge-friend', [`'${friendAddress}`]), [executeContractCall])

    const commitMessage = useCallback((message: string) =>
        executeContractCall('commit-message', [`"${message}"`]), [executeContractCall])

    const predictPulse = useCallback((level: number) =>
        executeContractCall('predict-pulse', [`u${level}`]), [executeContractCall])

    const claimDailyCombo = useCallback(() =>
        executeContractCall('claim-daily-combo-bonus', []), [executeContractCall])

    // Check if quest is completed (using bitmap)
    const isQuestCompleted = useCallback((questId: number): boolean => {
        if (!userProfile) return false
        return (userProfile.questBitmap & (1 << (questId - 1))) !== 0
    }, [userProfile])

    // Fetch user profile from Stacks API
    const refreshData = useCallback(async () => {
        if (!address || !isStacksConnected) return

        const contract = isMainnet ? STACKS_CONTRACTS.mainnet : STACKS_CONTRACTS.testnet

        try {
            setIsLoading(true)

            const response = await fetch(
                `${contract.apiUrl}/v2/contracts/call-read/${contract.contractAddress}/${contract.contractName}/get-user-profile`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sender: address,
                        arguments: [`0x${Buffer.from(address).toString('hex')}`],
                    }),
                }
            )

            if (response.ok) {
                const data = await response.json()
                if (data.okay && data.result) {
                    console.log('[Stacks] User profile:', data.result)
                    // TODO: Parse Clarity tuple response into StacksUserProfile
                }
            }
        } catch (err) {
            console.error('[Stacks] Error fetching user profile:', err)
        } finally {
            setIsLoading(false)
        }
    }, [address, isStacksConnected, isMainnet])

    return {
        // Connection state
        isConnected: isStacksConnected,
        isMainnet,
        address: isStacksConnected ? address : null,

        // Contract info
        contractInfo,

        // User data
        userProfile,

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
    }
}
