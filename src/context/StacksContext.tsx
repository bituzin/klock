'use client'

import React, { createContext, useContext, useCallback, useState, useEffect, ReactNode } from 'react'
import { showConnect, openContractCall, UserSession, AppConfig } from '@stacks/connect'
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network'
import {
    uintCV,
    stringAsciiCV,
    principalCV,
    cvToJSON,
    ClarityType,
} from '@stacks/transactions'
import { STACKS_CONTRACTS } from '@/config/contracts'

// App configuration
const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig })

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

interface StacksContextType {
    // Connection
    isConnected: boolean
    address: string | null
    isMainnet: boolean
    connect: () => void
    disconnect: () => void

    // Contract info
    contractInfo: {
        network: 'testnet' | 'mainnet'
        contractAddress: string
        contractName: string
        fullContractId: string
        explorerUrl: string
    }

    // User data
    userProfile: StacksUserProfile | null
    isLoading: boolean
    error: string | null

    // Quest actions
    dailyCheckin: () => Promise<{ success: boolean; txId?: string; error?: string }>
    relaySignal: () => Promise<{ success: boolean; txId?: string; error?: string }>
    updateAtmosphere: (weatherCode: number) => Promise<{ success: boolean; txId?: string; error?: string }>
    nudgeFriend: (friendAddress: string) => Promise<{ success: boolean; txId?: string; error?: string }>
    commitMessage: (message: string) => Promise<{ success: boolean; txId?: string; error?: string }>
    predictPulse: (level: number) => Promise<{ success: boolean; txId?: string; error?: string }>
    claimDailyCombo: () => Promise<{ success: boolean; txId?: string; error?: string }>

    // Utilities
    refreshData: () => Promise<void>
    isQuestCompleted: (questId: number) => boolean
}

const StacksContext = createContext<StacksContextType | undefined>(undefined)

export function StacksProvider({ children }: { children: ReactNode }) {
    const [isConnected, setIsConnected] = useState(false)
    const [address, setAddress] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [userProfile, setUserProfile] = useState<StacksUserProfile | null>(null)

    // Determine network from address
    const isMainnet = address?.startsWith('SP') ?? false

    // Get contract info
    const contractInfo = isMainnet ? STACKS_CONTRACTS.mainnet : STACKS_CONTRACTS.testnet

    // Get network
    const network = isMainnet ? STACKS_MAINNET : STACKS_TESTNET

    // Check if already connected on mount
    useEffect(() => {
        if (userSession.isUserSignedIn()) {
            const userData = userSession.loadUserData()
            const userAddress = userData.profile?.stxAddress?.mainnet || userData.profile?.stxAddress?.testnet
            if (userAddress) {
                setAddress(userAddress)
                setIsConnected(true)
            }
        }
    }, [])

    // Connect to Stacks wallet
    const connect = useCallback(() => {
        showConnect({
            appDetails: {
                name: 'PULSE - Social Ritual dApp',
                icon: 'https://avatars.githubusercontent.com/u/179229932',
            },
            onFinish: () => {
                const userData = userSession.loadUserData()
                const userAddress = userData.profile?.stxAddress?.mainnet || userData.profile?.stxAddress?.testnet
                if (userAddress) {
                    setAddress(userAddress)
                    setIsConnected(true)
                }
            },
            userSession,
        })
    }, [])

    // Disconnect
    const disconnect = useCallback(() => {
        userSession.signUserOut()
        setAddress(null)
        setIsConnected(false)
        setUserProfile(null)
    }, [])

    // Execute contract call helper
    const executeContractCall = useCallback(async (
        functionName: string,
        functionArgs: any[] = [],
        postConditions: any[] = []
    ): Promise<{ success: boolean; txId?: string; error?: string }> => {
        if (!isConnected || !address) {
            return { success: false, error: 'Wallet not connected' }
        }

        setIsLoading(true)
        setError(null)

        return new Promise((resolve) => {
            openContractCall({
                network,
                contractAddress: contractInfo.contractAddress,
                contractName: contractInfo.contractName,
                functionName,
                functionArgs,
                postConditions,
                onFinish: (data) => {
                    console.log('[Stacks] Transaction submitted:', data.txId)
                    setIsLoading(false)
                    resolve({ success: true, txId: data.txId })
                },
                onCancel: () => {
                    console.log('[Stacks] Transaction cancelled')
                    setIsLoading(false)
                    resolve({ success: false, error: 'Transaction cancelled' })
                },
            })
        })
    }, [isConnected, address, network, contractInfo])

    // Quest functions
    const dailyCheckin = useCallback(() =>
        executeContractCall('daily-checkin', []),
        [executeContractCall]
    )

    const relaySignal = useCallback(() =>
        executeContractCall('relay-signal', []),
        [executeContractCall]
    )

    const updateAtmosphere = useCallback((weatherCode: number) =>
        executeContractCall('update-atmosphere', [uintCV(weatherCode)]),
        [executeContractCall]
    )

    const nudgeFriend = useCallback((friendAddress: string) =>
        executeContractCall('nudge-friend', [principalCV(friendAddress)]),
        [executeContractCall]
    )

    const commitMessage = useCallback((message: string) =>
        executeContractCall('commit-message', [stringAsciiCV(message)]),
        [executeContractCall]
    )

    const predictPulse = useCallback((level: number) =>
        executeContractCall('predict-pulse', [uintCV(level)]),
        [executeContractCall]
    )

    const claimDailyCombo = useCallback(() =>
        executeContractCall('claim-daily-combo-bonus', []),
        [executeContractCall]
    )

    // Check if quest is completed
    const isQuestCompleted = useCallback((questId: number): boolean => {
        if (!userProfile) return false
        return (userProfile.questBitmap & (1 << (questId - 1))) !== 0
    }, [userProfile])

    // Fetch user profile
    const refreshData = useCallback(async () => {
        if (!address) return

        try {
            setIsLoading(true)

            const response = await fetch(
                `${contractInfo.apiUrl}/v2/contracts/call-read/${contractInfo.contractAddress}/${contractInfo.contractName}/get-user-profile`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sender: address,
                        arguments: [
                            `0x${Buffer.from(address).toString('hex')}`
                        ],
                    }),
                }
            )

            if (response.ok) {
                const data = await response.json()
                if (data.okay && data.result) {
                    console.log('[Stacks] User profile raw:', data.result)
                    // TODO: Parse Clarity tuple response
                }
            }
        } catch (err) {
            console.error('[Stacks] Error fetching profile:', err)
        } finally {
            setIsLoading(false)
        }
    }, [address, contractInfo])

    // Fetch data when connected
    useEffect(() => {
        if (isConnected && address) {
            refreshData()
        }
    }, [isConnected, address, refreshData])

    return (
        <StacksContext.Provider value={{
            isConnected,
            address,
            isMainnet,
            connect,
            disconnect,
            contractInfo: {
                ...contractInfo,
                network: isMainnet ? 'mainnet' : 'testnet',
            },
            userProfile,
            isLoading,
            error,
            dailyCheckin,
            relaySignal,
            updateAtmosphere,
            nudgeFriend,
            commitMessage,
            predictPulse,
            claimDailyCombo,
            refreshData,
            isQuestCompleted,
        }}>
            {children}
        </StacksContext.Provider>
    )
}

export function useStacks() {
    const context = useContext(StacksContext)
    if (context === undefined) {
        throw new Error('useStacks must be used within a StacksProvider')
    }
    return context
}
