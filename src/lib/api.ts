// API service for backend communication

export const BASE_URL = "http://localhost:8000"
const USER_ID = "demo_user" // Simplified - no auth per assessment

// Helper to get full image URL from backend
export function getImageUrl(path: string): string {
    return `${BASE_URL}${path}`
}

interface CartItem {
    item_id: number
    quantity: number
}

interface Cart {
    user_id: string
    items: CartItem[]
}

interface Order {
    id: number
    user_id: string
    items: CartItem[]
    total_amount: number
    discount_amount: number
    final_amount: number
    discount_code_used: string | null
}

interface Product {
    id: number
    name: string
    price: number
    originalPrice?: number
    image: string
    category: string
    rating: number
    reviewCount: number
    description: string
    features: string[]
    stock: number
    sale?: boolean
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Request failed" }))
        throw new Error(error.detail || "Request failed")
    }
    return response.json()
}

export const api = {
    // Get all products
    async getProducts(): Promise<Product[]> {
        const response = await fetch(`${BASE_URL}/products`)
        return handleResponse<Product[]>(response)
    },

    // Get single product by ID
    async getProductById(id: number): Promise<Product> {
        const response = await fetch(`${BASE_URL}/products/${id}`)
        return handleResponse<Product>(response)
    },

    // Get the current cart
    async getCart(): Promise<Cart> {
        const response = await fetch(`${BASE_URL}/cart?user_id=${USER_ID}`)
        return handleResponse<Cart>(response)
    },

    // Add item to cart
    async addToCart(itemId: number, quantity: number = 1): Promise<{ message: string; cart: Cart }> {
        const response = await fetch(
            `${BASE_URL}/cart/add?item_id=${itemId}&quantity=${quantity}&user_id=${USER_ID}`,
            { method: "POST" }
        )
        return handleResponse(response)
    },

    // Checkout with optional discount code
    async checkout(discountCode?: string): Promise<Order> {
        const params = new URLSearchParams({ user_id: USER_ID })
        if (discountCode) {
            params.append("discount_code", discountCode)
        }
        const response = await fetch(`${BASE_URL}/checkout?${params}`, { method: "POST" })
        return handleResponse<Order>(response)
    },

    // Remove item from cart
    async removeFromCart(itemId: number): Promise<{ message: string; cart: Cart }> {
        const response = await fetch(
            `${BASE_URL}/cart/remove?item_id=${itemId}&user_id=${USER_ID}`,
            { method: "DELETE" }
        )
        return handleResponse(response)
    },

    // Check if user is eligible for a discount code (nth order winner)
    async checkForDiscount(): Promise<string | null> {
        const response = await fetch(`${BASE_URL}/admin/generate-discount`, { method: "POST" })
        const data = await handleResponse<{ message: string; code?: string }>(response)
        return data.code || null
    },

    // Validate a discount code
    async validateDiscount(code: string): Promise<boolean> {
        const response = await fetch(`${BASE_URL}/discount/validate?code=${encodeURIComponent(code)}`)
        const data = await handleResponse<{ code: string; valid: boolean }>(response)
        return data.valid
    },

    // Get admin stats
    async getStats() {
        const response = await fetch(`${BASE_URL}/admin/stats`)
        return handleResponse(response)
    }
}

export type { Cart, CartItem, Order, Product }
