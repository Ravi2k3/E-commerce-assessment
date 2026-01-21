import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StorePage from './pages/storePage'
import ProductPage from './pages/ProductPage'
import AdminPage from './pages/AdminPage'
import { CartProvider } from '@/context/CartContext'
import { CartDrawer } from '@/components/CartDrawer'
import { Toaster } from '@/components/ui/sonner'

function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <Toaster position="top-center" />
                <CartDrawer />
                <Routes>
                    <Route path="/" element={<StorePage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
            </BrowserRouter>
        </CartProvider>
    )
}

export default App
