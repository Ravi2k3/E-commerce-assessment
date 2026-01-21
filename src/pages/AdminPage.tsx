import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { Link } from "react-router-dom"
import {
    ArrowLeft,
    Package,
    DollarSign,
    Tag,
    Percent,
    Loader2,
    RefreshCw,
    ShoppingBag,
    TrendingUp,
    Award
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Stats {
    total_orders: number
    total_items_purchased: number
    total_purchase_amount: number
    discount_codes: string[]
    total_discount_amount: number
}

/**
 * Admin dashboard page.
 * Displays sales statistics including orders, items sold, revenue, and discount usage.
 */
export default function AdminPage() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchStats = async () => {
        setIsLoading(true)
        try {
            const data = await api.getStats()
            setStats(data as Stats)
        } catch (err) {
            console.error("Failed to fetch stats:", err)
            toast.error("Failed to load statistics")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    // Calculate average order value
    const avgOrderValue = stats && stats.total_orders > 0
        ? stats.total_purchase_amount / stats.total_orders
        : 0

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-950">
            {/* Header */}
            <header className="border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm px-4 py-4 sticky top-0 z-10">
                <div className="mx-auto max-w-6xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold">Admin Dashboard</h1>
                            <p className="text-xs text-muted-foreground">Store Analytics & Overview</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchStats}
                        disabled={isLoading}
                        className="gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8">
                {isLoading && !stats ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : stats ? (
                    <>
                        {/* Main Stats Grid */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                            {/* Total Orders */}
                            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                                        <ShoppingBag className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded-full">
                                        Orders
                                    </span>
                                </div>
                                <p className="text-4xl font-bold mb-1">{stats.total_orders}</p>
                                <p className="text-sm text-muted-foreground">Total orders placed</p>
                            </div>

                            {/* Total Revenue */}
                            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                                        <DollarSign className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-full">
                                        Revenue
                                    </span>
                                </div>
                                <p className="text-4xl font-bold mb-1">${stats.total_purchase_amount.toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">Total revenue generated</p>
                            </div>

                            {/* Items Sold */}
                            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl">
                                        <Package className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-xs font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950 px-2 py-1 rounded-full">
                                        Items
                                    </span>
                                </div>
                                <p className="text-4xl font-bold mb-1">{stats.total_items_purchased}</p>
                                <p className="text-sm text-muted-foreground">Total items sold</p>
                            </div>
                        </div>

                        {/* Secondary Stats */}
                        <div className="grid gap-6 md:grid-cols-2 mb-8">
                            {/* Average Order Value */}
                            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 border shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
                                        <TrendingUp className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Avg. Order Value</p>
                                        <p className="text-3xl font-bold">${avgOrderValue.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Total Discounts Given */}
                            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 border shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl">
                                        <Percent className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Total Discounts</p>
                                        <p className="text-3xl font-bold">${stats.total_discount_amount.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Discount Codes Section */}
                        <div className="bg-white dark:bg-zinc-800 rounded-2xl border shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b bg-slate-50 dark:bg-zinc-900/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg">
                                        <Tag className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold">Discount Codes Used</h2>
                                        <p className="text-xs text-muted-foreground">
                                            {stats.discount_codes.length} code{stats.discount_codes.length !== 1 ? 's' : ''} redeemed
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                {stats.discount_codes.length > 0 ? (
                                    <div className="flex flex-wrap gap-3">
                                        {stats.discount_codes.map((code, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-zinc-700 dark:to-zinc-800 rounded-xl border"
                                            >
                                                <Award className="h-4 w-4 text-amber-500" />
                                                <span className="font-mono text-sm font-medium">{code}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-700 mb-3">
                                            <Tag className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <p className="text-muted-foreground text-sm">No discount codes have been used yet</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info Banner */}
                        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200 dark:border-blue-800 rounded-2xl p-5">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mt-0.5">
                                    <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Discount System</h3>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        A new 10% discount code is automatically generated every 3rd order.
                                        Each code can only be used once before it expires.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Failed to load statistics</p>
                    </div>
                )}
            </main>
        </div>
    )
}
