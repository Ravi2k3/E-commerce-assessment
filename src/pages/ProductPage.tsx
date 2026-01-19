import { useParams, Link } from "react-router-dom"
import { getProductById } from "@/data/products"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, ArrowLeft, Plus, Minus, Heart, Truck, Shield, RotateCcw } from "lucide-react"
import { useState } from "react"

import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function ProductPage() {
    const { id } = useParams<{ id: string }>()
    const product = getProductById(Number(id))
    const [quantity, setQuantity] = useState(1)

    const addToCart = (product: any, quantity: number) => {
        console.log("Adding to cart (placeholder):", product.name, "Quantity:", quantity)
    }

    if (!product) {
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
                {/* Breadcrumb */}
                <nav className="mb-6">
                    <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <ArrowLeft className="h-4 w-4" /> Back to products
                    </Link>
                </nav>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 border">
                        {product.sale && (
                            <Badge className="absolute left-4 top-4 z-10 bg-red-500 hover:bg-red-600 text-sm px-3 py-1">
                                Sale
                            </Badge>
                        )}
                        <img
                            src={product.image}
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

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-2">
                            <span className="text-sm text-muted-foreground">{product.category}</span>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight mb-4">
                            {product.name}
                        </h1>

                        {/* Rating */}
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

                        {/* Price */}
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

                        {/* Description */}
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Quantity & Add to Cart */}
                        <div className="flex items-center gap-4 mb-6">
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
                            <Button
                                size="lg"
                                className="flex-1 gap-2"
                                onClick={() => addToCart(product, quantity)}
                            >
                                <ShoppingCart className="h-5 w-5" /> Add to Cart
                            </Button>
                        </div>

                        {/* Stock Info */}
                        <p className="text-sm text-muted-foreground mb-6">
                            {product.stock > 10
                                ? <span className="text-green-600">In Stock</span>
                                : <span className="text-orange-500">Only {product.stock} left</span>
                            }
                        </p>

                        {/* Features */}
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

                        {/* Policies */}
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
