import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/CartContext"
import { api, type Product } from "@/lib/api"
import { useState, useEffect } from "react"
import { Loader2, ShoppingBag, Tag, Sparkles, Gift, X, Trash2, Check } from "lucide-react"
import { toast } from "sonner"

/**
 * Slide-out cart drawer component.
 * Displays cart items, handles discount code validation, and processes checkout.
 * Products are fetched from the backend and cached locally for cart item display.
 */
export function CartDrawer() {
    const { cart, isCartOpen, setIsCartOpen, checkout, removeFromCart } = useCart()

    // Product cache - fetched when drawer opens
    const [products, setProducts] = useState<Product[]>([])
    const [isLoadingProducts, setIsLoadingProducts] = useState(false)

    // Discount code state
    const [discountCode, setDiscountCode] = useState("")
    const [isDiscountValid, setIsDiscountValid] = useState(false)
    const [isValidatingDiscount, setIsValidatingDiscount] = useState(false)

    // Checkout state
    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const [checkoutError, setCheckoutError] = useState<string | null>(null)
    const [orderSuccess, setOrderSuccess] = useState<any | null>(null)
    const [wonDiscountCode, setWonDiscountCode] = useState<string | null>(null)

    // UI state
    const [isCheckingEligibility, setIsCheckingEligibility] = useState(false)
    const [removingItemId, setRemovingItemId] = useState<number | null>(null)

    // Fetch products when cart opens (for displaying item details)
    useEffect(() => {
        if (isCartOpen && products.length === 0) {
            setIsLoadingProducts(true)
            api.getProducts()
                .then(setProducts)
                .catch(err => console.error("Failed to load products:", err))
                .finally(() => setIsLoadingProducts(false))
        }
    }, [isCartOpen, products.length])

    // Reset order success state when drawer closes
    useEffect(() => {
        if (!isCartOpen) {
            setOrderSuccess(null)
            setWonDiscountCode(null)
            setDiscountCode("")
            setIsDiscountValid(false)
            setCheckoutError(null)
        }
    }, [isCartOpen])

    // Helper to find product by ID from cached products
    const getProductById = (id: number): Product | undefined => {
        return products.find(p => p.id === id)
    }

    // Check if the current user is eligible for a discount (nth order winner)
    const checkDiscountEligibility = async () => {
        setIsCheckingEligibility(true)
        try {
            const code = await api.checkForDiscount()
            if (code) {
                setDiscountCode(code)
                setIsDiscountValid(true)
                toast.success("You're eligible for a discount!", {
                    description: `Code ${code} has been applied`,
                })
            } else {
                toast.info("Not eligible yet", {
                    description: "Complete more orders to unlock discounts",
                })
            }
        } catch (err) {
            console.error("Failed to check discount eligibility:", err)
            toast.error("Failed to check eligibility")
        } finally {
            setIsCheckingEligibility(false)
        }
    }

    // Validate and apply a manually entered discount code
    const validateAndApplyDiscount = async () => {
        if (!discountCode.trim()) {
            toast.error("Please enter a discount code")
            return
        }

        setIsValidatingDiscount(true)
        try {
            const isValid = await api.validateDiscount(discountCode)
            if (isValid) {
                setIsDiscountValid(true)
                toast.success("Discount code applied!", {
                    description: "10% discount will be applied at checkout",
                })
            } else {
                setIsDiscountValid(false)
                toast.error("Invalid discount code", {
                    description: "This code doesn't exist or has been used",
                })
            }
        } catch {
            setIsDiscountValid(false)
            toast.error("Failed to validate code")
        } finally {
            setIsValidatingDiscount(false)
        }
    }

    // Reset validation state when discount code input changes
    const handleDiscountCodeChange = (value: string) => {
        setDiscountCode(value)
        if (isDiscountValid) {
            setIsDiscountValid(false)
        }
    }

    // Remove a single item from the cart
    const handleRemoveItem = async (itemId: number, productName: string) => {
        setRemovingItemId(itemId)
        try {
            await removeFromCart(itemId)
            toast.success("Removed from cart", { description: productName })
        } catch {
            toast.error("Failed to remove item")
        } finally {
            setRemovingItemId(null)
        }
    }

    // Process the checkout
    const handleCheckout = async () => {
        setIsCheckingOut(true)
        setCheckoutError(null)
        setOrderSuccess(null)
        setWonDiscountCode(null)

        try {
            const order = await checkout(isDiscountValid ? discountCode : undefined)
            setOrderSuccess(order)
            toast.success("Order placed successfully!", {
                description: `Order #${order.id} - $${order.final_amount.toFixed(2)}`,
            })

            // Check if this order made the user eligible for a future discount
            const newCode = await api.checkForDiscount()
            if (newCode) {
                setWonDiscountCode(newCode)
            }
        } catch (err: any) {
            setCheckoutError(err.message || "Checkout failed")
            toast.error("Checkout failed", {
                description: err.message || "Please try again",
            })
        } finally {
            setIsCheckingOut(false)
        }
    }

    // Calculate cart subtotal from cached product prices
    const calculateSubtotal = () => {
        if (!cart?.items) return 0
        return cart.items.reduce((total, item) => {
            const product = getProductById(item.item_id)
            return total + (product ? product.price * item.quantity : 0)
        }, 0)
    }

    const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0

    // Order success view
    if (orderSuccess) {
        return (
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
                    <SheetHeader className="px-6 py-4 border-b bg-green-50">
                        <SheetTitle className="flex items-center gap-2 text-green-700">
                            <Sparkles className="h-5 w-5" />
                            Order Complete!
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto px-6 py-8">
                        <div className="text-center mb-8">
                            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                <ShoppingBag className="h-10 w-10 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-1">Thank you for your order!</h3>
                            <p className="text-muted-foreground">Order #{orderSuccess.id}</p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-5 space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${orderSuccess.total_amount.toFixed(2)}</span>
                            </div>
                            {orderSuccess.discount_amount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount Applied</span>
                                    <span>-${orderSuccess.discount_amount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-lg pt-3 border-t">
                                <span>Total Paid</span>
                                <span>${orderSuccess.final_amount.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Special discount won notification */}
                        {wonDiscountCode && (
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 text-center">
                                <div className="text-4xl mb-3">🎉</div>
                                <h3 className="font-bold text-amber-800 text-lg mb-2">You're a Lucky Customer!</h3>
                                <p className="text-amber-700 text-sm mb-4">
                                    Here's a 10% discount code for your next order:
                                </p>
                                <div className="bg-white border-2 border-dashed border-amber-300 px-4 py-3 rounded-lg font-mono font-bold text-xl text-amber-800 select-all">
                                    {wonDiscountCode}
                                </div>
                            </div>
                        )}
                    </div>

                    <SheetFooter className="px-6 py-4 border-t bg-gray-50">
                        <Button
                            className="w-full h-12 text-base"
                            onClick={() => {
                                setOrderSuccess(null)
                                setDiscountCode("")
                                setIsDiscountValid(false)
                                setIsCartOpen(false)
                            }}
                        >
                            Continue Shopping
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        )
    }

    // Main cart view
    return (
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
                <SheetHeader className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="flex items-center gap-2 text-lg">
                            <ShoppingBag className="h-5 w-5" />
                            Your Cart
                            {itemCount > 0 && (
                                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </SheetTitle>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto">
                    {isLoadingProducts ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : !cart?.items?.length ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
                            <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                                <ShoppingBag className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                            <p className="text-muted-foreground text-sm">Add some items to get started</p>
                        </div>
                    ) : (
                        <div className="px-6 py-4 space-y-4">
                            {cart.items.map((item) => {
                                const product = getProductById(item.item_id)
                                if (!product) return null
                                const isRemoving = removingItemId === item.item_id

                                return (
                                    <div key={item.item_id} className={`flex gap-4 p-4 bg-gray-50 rounded-xl ${isRemoving ? 'opacity-50' : ''}`}>
                                        <div className="h-20 w-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border">
                                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm line-clamp-2 mb-2">{product.name}</h4>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground bg-white px-2 py-1 rounded">
                                                    Qty: {item.quantity}
                                                </span>
                                                <span className="font-bold text-lg">
                                                    ${(product.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => handleRemoveItem(item.item_id, product.name)}
                                            disabled={isRemoving}
                                        >
                                            {isRemoving ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Checkout section - only shown when cart has items */}
                {cart?.items?.length ? (
                    <div className="border-t bg-gray-50 px-6 py-5 space-y-5">
                        {/* Discount code section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Tag className="h-4 w-4" /> Discount Code
                                </label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-xs"
                                    onClick={checkDiscountEligibility}
                                    disabled={isCheckingEligibility}
                                >
                                    {isCheckingEligibility ? (
                                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                    ) : (
                                        <Gift className="h-3 w-3 mr-1" />
                                    )}
                                    Check Eligibility
                                </Button>
                            </div>

                            {isDiscountValid && (
                                <div className="text-sm text-green-700 bg-green-100 px-3 py-2 rounded-lg flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" />
                                    <span>Discount code applied: <strong className="font-mono">{discountCode}</strong></span>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter discount code"
                                    value={discountCode}
                                    onChange={(e) => handleDiscountCodeChange(e.target.value)}
                                    className="h-11 flex-1"
                                    disabled={isDiscountValid}
                                />
                                <Button
                                    variant={isDiscountValid ? "outline" : "default"}
                                    className="h-11 px-4"
                                    onClick={validateAndApplyDiscount}
                                    disabled={isValidatingDiscount || isDiscountValid || !discountCode.trim()}
                                >
                                    {isValidatingDiscount ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : isDiscountValid ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        "Apply"
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Order summary */}
                        <div className="bg-white rounded-xl p-4 space-y-3 border">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${calculateSubtotal().toFixed(2)}</span>
                            </div>
                            {isDiscountValid && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount (10%)</span>
                                    <span>-${(calculateSubtotal() * 0.1).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-lg pt-3 border-t">
                                <span>Total</span>
                                <span>${(isDiscountValid ? calculateSubtotal() * 0.9 : calculateSubtotal()).toFixed(2)}</span>
                            </div>
                        </div>

                        {checkoutError && (
                            <div className="text-red-700 text-sm bg-red-50 px-4 py-3 rounded-lg border border-red-200 flex items-center gap-2">
                                <X className="h-4 w-4" />
                                {checkoutError}
                            </div>
                        )}

                        <Button
                            className="w-full h-12 text-base font-medium"
                            onClick={handleCheckout}
                            disabled={!cart?.items.length || isCheckingOut}
                        >
                            {isCheckingOut ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                                </>
                            ) : (
                                `Checkout · $${(isDiscountValid ? calculateSubtotal() * 0.9 : calculateSubtotal()).toFixed(2)}`
                            )}
                        </Button>
                    </div>
                ) : null}
            </SheetContent>
        </Sheet>
    )
}
