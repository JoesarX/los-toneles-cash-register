'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
    Menu,
    LogOut,
    FileText,
    Settings,
    DollarSign,
    Clock,
    User,
} from 'lucide-react'
import { useState } from 'react'
import { useSessionStore } from '@/lib/store/session-store'

export function Navbar() {
    const { data: session } = useSession()
    const router = useRouter()
    const { currentSession } = useSessionStore()
    const [showMenu, setShowMenu] = useState(false)

    const handleSignOut = async () => {
        await signOut({ redirect: false })
        router.push('/login')
    }

    const menuItems = [
        { href: '/', label: 'Caja', icon: DollarSign },
        { href: '/orders', label: 'Órdenes', icon: FileText },
        { href: '/reports', label: 'Reportes', icon: FileText },
        { href: '/cash-session', label: 'Sesión de Caja', icon: Clock },
    ]

    if (session?.user.isAdmin) {
        menuItems.push({ href: '/settings', label: 'Configuración', icon: Settings })
    }

    return (
        <nav className="bg-primary text-primary-foreground h-16 flex items-center px-4 shadow-lg relative">
            <div className="flex items-center justify-between w-full">
                {/* Logo / Title */}
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold">Los Toneles - Caja</h1>
                    {currentSession && (
                        <span className="text-sm opacity-80">
                            Sesión activa desde {new Date(currentSession.startTime).toLocaleTimeString()}
                        </span>
                    )}
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                        >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                        </Link>
                    ))}

                    <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-primary-foreground/20">
                        <span className="text-sm">
                            {session?.user.name || session?.user.email}
                        </span>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Salir</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden"
                    onClick={() => setShowMenu(!showMenu)}
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Menu */}
            {showMenu && (
                <div className="absolute top-16 left-0 right-0 bg-primary shadow-lg md:hidden z-50">
                    <div className="flex flex-col p-4 space-y-3">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center space-x-2 hover:opacity-80 transition-opacity py-2"
                                onClick={() => setShowMenu(false)}
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </Link>
                        ))}

                        <div className="border-t border-primary-foreground/20 pt-3 mt-3">
                            <div className="flex items-center space-x-2 mb-3">
                                <User className="w-4 h-4" />
                                <span className="text-sm">
                                    {session?.user.name || session?.user.email}
                                </span>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center space-x-2 hover:opacity-80 transition-opacity w-full"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Salir</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}