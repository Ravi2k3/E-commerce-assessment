// Shared product data for the store

export interface Product {
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

export const products: Product[] = [
    {
        id: 1,
        name: "Wireless Noise-Canceling Headphones",
        price: 299.99,
        originalPrice: 349.99,
        image: "/image.png",
        category: "Electronics",
        rating: 4.8,
        reviewCount: 2847,
        description: "Experience immersive sound with our premium wireless headphones featuring advanced noise-canceling technology. Perfect for music lovers, travelers, and remote workers who demand crystal-clear audio.",
        features: [
            "Active Noise Cancellation",
            "40-hour battery life",
            "Bluetooth 5.2",
            "Premium memory foam ear cushions",
            "Foldable design for travel"
        ],
        stock: 45,
        sale: true,
    },
    {
        id: 2,
        name: "Smart Fitness Watch Pro",
        price: 199.50,
        image: "/image.png",
        category: "Electronics",
        rating: 4.5,
        reviewCount: 1523,
        description: "Track your health and fitness goals with precision. This advanced smartwatch monitors heart rate, sleep patterns, and over 100 workout modes.",
        features: [
            "Heart rate monitoring",
            "GPS tracking",
            "Water resistant to 50m",
            "7-day battery life",
            "Compatible with iOS and Android"
        ],
        stock: 78,
    },
    {
        id: 3,
        name: "Ergonomic Office Chair",
        price: 450.00,
        image: "/image.png",
        category: "Furniture",
        rating: 4.9,
        reviewCount: 892,
        description: "Designed for all-day comfort, this ergonomic chair features adjustable lumbar support, breathable mesh back, and customizable armrests.",
        features: [
            "Adjustable lumbar support",
            "Breathable mesh back",
            "4D armrests",
            "Recline up to 135 degrees",
            "Supports up to 300 lbs"
        ],
        stock: 23,
    },
    {
        id: 4,
        name: "Premium Cotton T-Shirt",
        price: 25.00,
        image: "/image.png",
        category: "Clothing",
        rating: 4.2,
        reviewCount: 3421,
        description: "Ultra-soft 100% organic cotton t-shirt with a modern fit. Pre-shrunk and machine washable for easy care.",
        features: [
            "100% organic cotton",
            "Pre-shrunk fabric",
            "Reinforced seams",
            "Available in 12 colors",
            "Sizes XS-3XL"
        ],
        stock: 156,
    },
    {
        id: 5,
        name: "Stainless Steel Water Bottle",
        price: 35.00,
        image: "/image.png",
        category: "Accessories",
        rating: 4.7,
        reviewCount: 2156,
        description: "Double-walled vacuum insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and eco-friendly.",
        features: [
            "24-hour cold / 12-hour hot",
            "Double-wall insulation",
            "BPA-free",
            "Leak-proof lid",
            "32 oz capacity"
        ],
        stock: 234,
    },
    {
        id: 6,
        name: "Leather Weekend Bag",
        price: 150.00,
        originalPrice: 199.00,
        image: "/image.png",
        category: "Accessories",
        rating: 4.6,
        reviewCount: 678,
        description: "Handcrafted genuine leather weekend bag with spacious interior and multiple compartments. Perfect for short trips and gym sessions.",
        features: [
            "Genuine full-grain leather",
            "Padded laptop sleeve",
            "Multiple pockets",
            "Detachable shoulder strap",
            "Brass hardware"
        ],
        stock: 34,
        sale: true,
    },
    {
        id: 7,
        name: "4K Ultra HD Monitor",
        price: 399.99,
        image: "/image.png",
        category: "Electronics",
        rating: 4.4,
        reviewCount: 1892,
        description: "27-inch 4K UHD monitor with HDR support, perfect for content creators, gamers, and professionals who demand accurate colors.",
        features: [
            "27-inch 4K UHD display",
            "HDR10 support",
            "99% sRGB color accuracy",
            "USB-C with 65W charging",
            "Height adjustable stand"
        ],
        stock: 56,
    },
    {
        id: 8,
        name: "Mechanical Gaming Keyboard",
        price: 129.99,
        image: "/image.png",
        category: "Electronics",
        rating: 4.8,
        reviewCount: 3567,
        description: "Premium mechanical keyboard with hot-swappable switches, per-key RGB lighting, and aircraft-grade aluminum frame.",
        features: [
            "Hot-swappable switches",
            "Per-key RGB lighting",
            "Aluminum frame",
            "N-key rollover",
            "Detachable USB-C cable"
        ],
        stock: 89,
    },
    {
        id: 9,
        name: "Organic Face Serum",
        price: 45.00,
        image: "/image.png",
        category: "Beauty",
        rating: 4.9,
        reviewCount: 4521,
        description: "Luxurious organic face serum with vitamin C and hyaluronic acid. Brightens skin, reduces fine lines, and provides deep hydration.",
        features: [
            "Vitamin C and hyaluronic acid",
            "100% organic ingredients",
            "Cruelty-free",
            "Suitable for all skin types",
            "1 oz bottle"
        ],
        stock: 167,
    },
    {
        id: 10,
        name: "Running Shoes Gen 2",
        price: 89.95,
        image: "/image.png",
        category: "Footwear",
        rating: 4.3,
        reviewCount: 2789,
        description: "Lightweight running shoes with responsive cushioning and breathable mesh upper. Designed for comfort on long runs.",
        features: [
            "Responsive foam cushioning",
            "Breathable mesh upper",
            "Rubber outsole for grip",
            "Reflective details",
            "Available in 8 colors"
        ],
        stock: 145,
    },
]

export function getProductById(id: number): Product | undefined {
    return products.find(p => p.id === id)
}
