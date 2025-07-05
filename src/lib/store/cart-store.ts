import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, CartState, ProductOption } from '@/types'

interface CartActions {
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
    removeItem: (id: string, options?: ProductOption | null) => void
    updateQuantity: (id: string, quantity: number, options?: ProductOption | null) => void
    clearCart: () => void
    getItemKey: (productId: string, options?: ProductOption | null) => string
}

type CartStore = CartState & CartActions

const getItemKey = (productId: string, options?: ProductOption | null): string => {
    if (!options) return productId
    return `${productId}-${options.title}`
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            totalAmount: 0,
            totalItems: 0,

            getItemKey,

            addItem: (item) => {
                set((state) => {
                    const itemKey = getItemKey(item.productId, item.options)
                    const existingItemIndex = state.items.findIndex(
                        (i) => getItemKey(i.productId, i.options) === itemKey
                    )

                    // eslint-disable-next-line prefer-const
                    let newItems = [...state.items]

                    if (existingItemIndex > -1) {
                        // Update existing item quantity
                        newItems[existingItemIndex] = {
                            ...newItems[existingItemIndex],
                            quantity: newItems[existingItemIndex].quantity + (item.quantity || 1)
                        }
                    } else {
                        // Add new item with unique id
                        newItems.push({
                            ...item,
                            id: itemKey,
                            quantity: item.quantity || 1
                        })
                    }

                    const totalAmount = newItems.reduce(
                        (sum, i) => sum + i.price * i.quantity,
                        0
                    )
                    const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0)

                    return {
                        items: newItems,
                        totalAmount,
                        totalItems
                    }
                })
            },

            removeItem: (id, options) => {
                set((state) => {
                    const itemKey = getItemKey(id, options)
                    const newItems = state.items.filter(
                        (item) => getItemKey(item.productId, item.options) !== itemKey
                    )

                    const totalAmount = newItems.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                    )
                    const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)

                    return {
                        items: newItems,
                        totalAmount,
                        totalItems
                    }
                })
            },

            updateQuantity: (id, quantity, options) => {
                if (quantity <= 0) {
                    get().removeItem(id, options)
                    return
                }

                set((state) => {
                    const itemKey = getItemKey(id, options)
                    const newItems = state.items.map((item) =>
                        getItemKey(item.productId, item.options) === itemKey
                            ? { ...item, quantity }
                            : item
                    )

                    const totalAmount = newItems.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                    )
                    const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)

                    return {
                        items: newItems,
                        totalAmount,
                        totalItems
                    }
                })
            },

            clearCart: () => {
                set({
                    items: [],
                    totalAmount: 0,
                    totalItems: 0
                })
            }
        }),
        {
            name: 'cash-register-cart'
        }
    )
)