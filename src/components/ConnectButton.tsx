'use client'

import { useAppKit } from '@reown/appkit/react'
import { useAccount, useDisconnect } from 'wagmi'
import { LogOut, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ConnectButton() {
    const { open } = useAppKit()
    const { address, isConnected } = useAccount()
    const { disconnect } = useDisconnect()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse" />

    if (isConnected && address) {
        return (
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                <Wallet size={16} className="text-blue-600" />
                <button onClick={() => open()} className="text-sm font-medium text-blue-900 hover:underline">
                    {address.slice(0, 6)}...{address.slice(-4)}
                </button>
                <button
                    onClick={() => disconnect()}
                    className="p-1 rounded-full text-blue-400 hover:text-blue-600 hover:bg-blue-100 transition-colors"
                    title="Disconnect"
                >
                    <LogOut size={14} />
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={() => open()}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FF6B00] to-[#ff8533] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-200"
        >
            <Wallet size={18} />
            Connect Wallet
        </button>
    )
}
