'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ProductGrid } from '@/components/cash-register/ProductGrid'
import { Cart } from '@/components/cash-register/Cart'
import { CategoryTabs } from '@/components/cash-register/CategoryTabs'
import { PaymentModal } from '@/components/cash-register/PaymentModal'
import { useCartStore } from '@/lib/store/cart-store'
import { useSessionStore } from '@/lib/store/session-store'
import { Product } from '@/types'

const categories = [
    { id: 'all', name: 'Todo', slug: 'all' },
    { id: 'comida', name: 'Comida', slug: 'Comida' },
    { id: 'bebida', name: 'Bebida', slug: 'Bebida' },
    { id: 'otros', name: 'Otros', slug: 'Otros' },
]

export default function CashRegisterPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const { currentSession, setSession } = useSessionStore()
    const { clearCart } = useCartStore()

    // Check auth and permissions
    useEffect(() => {
        if (status === 'loading') return

        if (!session || (!session.user.isAdmin && !session.user.isCashier)) {
            router.push('/login')
        }
    }, [session, status, router])

    // Fetch or create cash session
    useQuery({
        queryKey: ['cash-session'],
        queryFn: async () => {
            const res = await fetch('/api/cash-sessions/current')
            if (!res.ok) {
                if (res.status === 404) {
                    // No active session, redirect to start session
                    router.push('/cash-session/start')
                    return null
                }
                throw new Error('Failed to fetch session')
            }
            const data = await res.json()
            setSession(data)
            return data
        },
        enabled: !!session,
    })

    // Fetch products
    const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
        queryKey: ['products', selectedCategory],
        queryFn: async () => {
            const url = selectedCategory === 'all'
                ? '/api/products'
                : `/api/products?category=${selectedCategory}`
            const res = await fetch(url)
            if (!res.ok) throw new Error('Failed to fetch products')
            return res.json()
        },
        enabled: !!currentSession,
    })

    const handlePaymentComplete = () => {
        clearCart()
        setShowPaymentModal(false)
        toast.success('Orden completada exitosamente')
    }

    if (status === 'loading' || !currentSession) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Cargando...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Category Tabs */}
                <div className="bg-card border-b p-4">
                    <CategoryTabs
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />
                </div>

                {/* Product Grid */}
                <div className="flex-1 overflow-auto p-4">
                    {isLoadingProducts ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <ProductGrid products={products} />
                    )}
                </div>
            </div>

            {/* Cart Sidebar */}
            <div className="w-96 bg-card border-l flex flex-col">
                <Cart onCheckout={() => setShowPaymentModal(true)} />
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <PaymentModal
                    onClose={() => setShowPaymentModal(false)}
                    onComplete={handlePaymentComplete}
                />
            )}
        </div>
    )
}