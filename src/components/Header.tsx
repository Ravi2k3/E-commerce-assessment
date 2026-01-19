import { Link } from "react-router-dom"
import { ShoppingCart, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeaderProps {
    searchQuery?: string
    onSearchChange?: (query: string) => void
    showSearch?: boolean
}

export default function Header({ searchQuery, onSearchChange, showSearch = false }: HeaderProps) {
    const itemCount = 0 // Placeholder until backend is connected

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
                <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xl font-bold tracking-tight">E-Shop</span>
                </Link>

                {showSearch && onSearchChange && (
                    <div className="flex-1 max-w-md mx-auto hidden sm:block">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search products..."
                                className="w-full pl-9 bg-muted/50"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <nav className="flex gap-4 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-medium">
                                {itemCount}
                            </span>
                        )}
                        <span className="sr-only">Cart</span>
                    </Button>
                </nav>
            </div>
            {/* Mobile Search Bar */}
            {showSearch && onSearchChange && (
                <div className="sm:hidden px-4 pb-3">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="w-full pl-9 bg-muted/50"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                </div>
            )}
        </header>
    )
}
