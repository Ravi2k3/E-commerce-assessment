import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api, type Cart, type Order } from "@/lib/api"

interface CartContextType {
    cart: Cart | null
    isLoading: boolean
    isCartOpen: boolean
    setIsCartOpen: (open: boolean) => void
    addToCart: (itemId: number, quantity?: number) => Promise<void>
    removeFromCart: (itemId: number) => Promise<void>
    refreshCart: () => Promise<void>
    checkout: (discountCode?: string) => Promise<Order>
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isCartOpen, setIsCartOpen] = useState(false)

    const refreshCart = async () => {
        try {
            const data = await api.getCart()
            setCart(data)
        } catch (err) {
            console.error("Failed to fetch cart:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const addToCart = async (itemId: number, quantity: number = 1) => {
        try {
            const result = await api.addToCart(itemId, quantity)
            setCart(result.cart)
        } catch (err) {
            console.error("Failed to add to cart:", err)
            throw err
        }
    }

    const removeFromCart = async (itemId: number) => {
        try {
            const result = await api.removeFromCart(itemId)
            setCart(result.cart)
        } catch (err) {
            console.error("Failed to remove from cart:", err)
            throw err
        }
    }

    const checkout = async (discountCode?: string): Promise<Order> => {
        const order = await api.checkout(discountCode)
        // Clear cart after successful checkout
        await refreshCart()
        return order
    }

    // Load cart on mount
    useEffect(() => {
        refreshCart()
    }, [])

    return (
        <CartContext.Provider value={{
            cart,
            isLoading,
            isCartOpen,
            setIsCartOpen,
            addToCart,
            removeFromCart,
            refreshCart,
            checkout
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
