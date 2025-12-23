'use client'

import { useAccount } from 'wagmi'
import ConnectButton from './ConnectButton'
import { ArrowRight } from 'lucide-react'

export default function HeroActions() {
    const { isConnected } = useAccount()

    const scrollToDashboard = () => {
        const dashboard = document.getElementById('dashboard')
        if (dashboard) {
            dashboard.scrollIntoView({ behavior: 'smooth' })
        }
    }

    if (isConnected) {
        return (
            <button
                onClick={scrollToDashboard}
                className="flex items-center gap-2 px-6 py-3 bg-[#FF6B00] text-white rounded-full font-semibold hover:bg-[#FF8533] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
                Enter App
                <ArrowRight size={20} />
            </button>
        )
    }

    return <ConnectButton />
}
