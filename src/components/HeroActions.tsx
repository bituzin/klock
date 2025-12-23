'use client'

import { useAuth } from '@/context/AuthContext'
import ConnectButton from './ConnectButton'
import { ArrowRight, LogIn } from 'lucide-react'

export default function HeroActions() {
    const { isConnected, isLoggedIn, login } = useAuth()

    const scrollToDashboard = () => {
        const dashboard = document.getElementById('dashboard')
        if (dashboard) {
            dashboard.scrollIntoView({ behavior: 'smooth' })
        }
    }

    // State 3: Logged in - show Enter App button
    if (isLoggedIn) {
        return (
            <button
                onClick={scrollToDashboard}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white rounded-full font-semibold hover:shadow-xl transition-all duration-200 shadow-lg transform hover:-translate-y-0.5"
            >
                Enter App
                <ArrowRight size={20} />
            </button>
        )
    }

    // State 2: Connected but not logged in - show Login to App button
    if (isConnected) {
        return (
            <button
                onClick={login}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white rounded-full font-semibold hover:shadow-xl transition-all duration-200 shadow-lg transform hover:-translate-y-0.5"
            >
                <LogIn size={20} />
                Login to App
            </button>
        )
    }

    // State 1: Not connected - show Connect Wallet button
    return <ConnectButton />
}
