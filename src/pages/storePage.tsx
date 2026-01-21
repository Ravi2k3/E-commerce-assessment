import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { api, type Product, getImageUrl } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, Plus, Loader2 } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useCart } from "@/context/CartContext"
import { toast } from "sonner"

export default function StorePage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { cart, addToCart } = useCart()

    // Fetch products from backend on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.getProducts()
                setProducts(data)
            } catch (err) {
                console.error("Failed to fetch products:", err)
                toast.error("Failed to load products")
            } finally {
                setIsLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const handleAddToCart = async (productId: number) => {
        try {
            await addToCart(productId)
            const product = products.find(p => p.id === productId)
            toast.success("Added to cart", {
                description: product?.name || "Item added",
            })
        } catch {
            toast.error("Failed to add to cart")
        }
    }

    // Get quantity of a specific product in cart
    const getCartQuantity = (productId: number): number => {
        const item = cart?.items.find(item => item.item_id === productId)
        return item?.quantity || 0
    }

    const toggleFavorite = (productId: number) => {
        console.log("Toggling favorite (placeholder):", productId)
    }

    const isFavorite = (_productId: number) => false

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-900 flex flex-col">
            <Header
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                showSearch={true}
            />

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1">
                <div className="mb-8 flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">New Arrivals</h1>
                    <p className="text-muted-foreground">
                        {searchQuery
                            ? `Showing ${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''} for "${searchQuery}"`
                            : "Check out our latest collection of premium products."
                        }
                    </p>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        {/* Product Grid - Walmart Style */}
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {filteredProducts.map((product) => {
                                const quantityInCart = getCartQuantity(product.id)

                                return (
                                    <div key={product.id} className="group relative flex flex-col">
                                        {/* Product Image */}
                                        <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden rounded-lg bg-white dark:bg-zinc-800 mb-3">
                                            {product.sale && (
                                                <Badge className="absolute left-1.5 top-1.5 z-10 bg-red-500 hover:bg-red-600 text-xs px-1.5 py-0.5">
                                                    Rollback
                                                </Badge>
                                            )}
                                            {/* Show quantity badge if item is in cart */}
                                            {quantityInCart > 0 && (
                                                <div className="absolute bottom-1.5 right-1.5 z-10 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                                                    {quantityInCart} in cart
                                                </div>
                                            )}
                                            <img
                                                src={getImageUrl(product.image)}
                                                alt={product.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    toggleFavorite(product.id)
                                                }}
                                                className={`absolute top-1.5 right-1.5 p-1.5 rounded-full transition-all ${isFavorite(product.id)
                                                    ? 'bg-red-500 text-white opacity-100'
                                                    : 'bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100'
                                                    }`}
                                            >
                                                <Heart className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                                            </button>
                                        </Link>

                                        {/* Add Button - Shows quantity if in cart */}
                                        {quantityInCart > 0 ? (
                                            <button
                                                onClick={() => handleAddToCart(product.id)}
                                                className="mb-2 flex items-center justify-center gap-2 text-xs h-8 px-4 rounded-full border-2 border-primary text-primary font-medium bg-primary/10 hover:bg-primary/20 transition-colors"
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                                Add More ({quantityInCart})
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleAddToCart(product.id)}
                                                className="mb-2 flex items-center justify-center gap-1 text-xs h-8 px-4 rounded-full border border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary transition-colors bg-white dark:bg-zinc-800"
                                            >
                                                <Plus className="h-3.5 w-3.5" /> Add
                                            </button>
                                        )}

                                        {/* Price */}
                                        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                                            {product.sale && product.originalPrice ? (
                                                <>
                                                    <span className="text-sm text-green-600 font-medium">Now</span>
                                                    <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                                                    <span className="text-xs text-muted-foreground line-through">
                                                        ${product.originalPrice.toFixed(2)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                                            )}
                                        </div>

                                        {/* Product Name */}
                                        <Link to={`/product/${product.id}`}>
                                            <h3 className="text-sm text-muted-foreground leading-snug line-clamp-2 hover:text-foreground transition-colors">
                                                {product.name}
                                            </h3>
                                        </Link>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1 mt-1">
                                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                            <span className="text-xs text-muted-foreground">
                                                {product.rating}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No products found matching "{searchQuery}"</p>
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    )
}