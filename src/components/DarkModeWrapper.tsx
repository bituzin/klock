"use client"
import { useState, useEffect } from 'react'

export default function DarkModeWrapper({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const saved = localStorage.getItem('pulse-dark')
    if (saved === 'true') setDark(true)
  }, [])
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('pulse-dark', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('pulse-dark', 'false')
    }
  }, [dark])
  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center text-2xl"
        style={{
          background: dark ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' : 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)',
          border: dark ? '2px solid #404040' : '2px solid rgba(255,107,0,0.3)',
          boxShadow: dark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(255,107,0,0.3)'
        }}
        onClick={()=>setDark(d=>!d)}
        aria-label="Toggle dark mode"
        title={dark ? 'Tryb dzienny' : 'Tryb nocny'}
      >
        {dark ? '☀️' : '🌙'}
      </button>
      {children}
    </>
  )
}
