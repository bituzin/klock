'use client'

import { useAuth } from '@/context/AuthContext'
import { useStacks } from '@/context/StacksContext'
import { useRouter } from 'next/navigation'
import ConnectButton from './ConnectButton'
import StacksConnectButton from './StacksConnectButton'
import { ArrowRight, LogIn } from 'lucide-react'

export default function HeroActions() {
    const { isConnected: isEvmConnected, isLoggedIn } = useAuth()
    const { isConnected: isStacksConnected, address: stacksAddress } = useStacks()
    const router = useRouter()

    const goToDashboard = () => {
        router.push('/dashboard')
    }

    // If user is logged in (either EVM or Stacks), show Enter Dashboard
    if (isLoggedIn || isStacksConnected) {
        return (
            <button
                onClick={goToDashboard}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white rounded-full font-semibold hover:shadow-xl transition-all duration-200 shadow-lg transform hover:-translate-y-0.5"
            >
                Enter Dashboard
                <ArrowRight size={20} />
            </button>
        )
    }

    // Not connected - show both wallet options
    return (
        <div className="flex flex-col sm:flex-row gap-3">
            {/* EVM/Base wallet via AppKit */}
            <ConnectButton />

            {/* Stacks wallet via @stacks/connect */}
            <StacksConnectButton />
        </div>
    )
}
