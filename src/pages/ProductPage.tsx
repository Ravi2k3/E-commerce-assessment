import { useParams, Link } from "react-router-dom"
import { api, type Product, getImageUrl } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, ArrowLeft, Plus, Minus, Heart, Truck, Shield, RotateCcw, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useCart } from "@/context/CartContext"

/**
 * Product detail page.
 * Fetches a single product by ID from the backend and displays full details
 * including description, features, and add-to-cart functionality.
 */
export default function ProductPage() {
    const { id } = useParams<{ id: string }>()
    const [product, setProduct] = useState<Product | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const { cart, addToCart } = useCart()

    // Fetch product from backend when component mounts or ID changes
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await api.getProductById(Number(id))
                setProduct(data)
            } catch {
                setNotFound(true)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProduct()
    }, [id])

    const handleAddToCart = async () => {
        if (!product) return

        try {
            await addToCart(product.id, quantity)
            toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart`, {
                description: product.name,
            })
            setQuantity(1)
        } catch {
            toast.error("Failed to add to cart")
        }
    }

    // Get current quantity of this product in the user's cart
    const quantityInCart = product
        ? cart?.items.find(item => item.item_id === product.id)?.quantity || 0
        : 0

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (notFound || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                    <Link to="/">
                        <Button>
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Store
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-900 flex flex-col">
            <Header showSearch={false} />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 w-full">
                {/* Breadcrumb navigation */}
                <nav className="mb-6">
                    <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <ArrowLeft className="h-4 w-4" /> Back to products
                    </Link>
                </nav>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Product image section */}
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 border">
                        {product.sale && (
                            <Badge className="absolute left-4 top-4 z-10 bg-red-500 hover:bg-red-600 text-sm px-3 py-1">
                                Sale
                            </Badge>
                        )}
                        <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute top-4 right-4 rounded-full bg-white/80 hover:bg-white"
                        >
                            <Heart className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Product details section */}
                    <div className="flex flex-col">
                        <div className="mb-2">
                            <span className="text-sm text-muted-foreground">{product.category}</span>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight mb-4">
                            {product.name}
                        </h1>

                        {/* Star rating display */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-1 text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-none'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {product.rating} ({product.reviewCount.toLocaleString()} reviews)
                            </span>
                        </div>

                        {/* Price with sale indicator */}
                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                            {product.originalPrice && (
                                <span className="text-xl text-muted-foreground line-through">
                                    ${product.originalPrice.toFixed(2)}
                                </span>
                            )}
                            {product.sale && product.originalPrice && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                    Save ${(product.originalPrice - product.price).toFixed(2)}
                                </Badge>
                            )}
                        </div>

                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Cart status indicator */}
                        {quantityInCart > 0 && (
                            <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 mb-4">
                                <p className="text-sm text-primary font-medium">
                                    ✓ You have {quantityInCart} of this item in your cart
                                </p>
                            </div>
                        )}

                        {/* Quantity selector and add to cart */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">Quantity to add:</span>
                                <div className="flex items-center border rounded-lg">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setQuantity(quantity + 1)}
                                        disabled={quantity >= product.stock}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <Button
                                size="lg"
                                className="flex-1 gap-2"
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {quantityInCart > 0 ? `Add ${quantity} More` : "Add to Cart"}
                            </Button>
                        </div>

                        {/* Stock availability */}
                        <p className="text-sm text-muted-foreground mb-6">
                            {product.stock > 10
                                ? <span className="text-green-600">In Stock</span>
                                : <span className="text-orange-500">Only {product.stock} left</span>
                            }
                        </p>

                        {/* Product features list */}
                        <div className="border-t pt-6">
                            <h3 className="font-semibold mb-3">Key Features</h3>
                            <ul className="space-y-2">
                                {product.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm">
                                        <span className="text-primary mt-1">•</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Shipping and warranty policies */}
                        <div className="border-t mt-6 pt-6 grid grid-cols-3 gap-4">
                            <div className="flex flex-col items-center text-center gap-2">
                                <Truck className="h-6 w-6 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Free Shipping</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <Shield className="h-6 w-6 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">2 Year Warranty</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <RotateCcw className="h-6 w-6 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">30-Day Returns</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
