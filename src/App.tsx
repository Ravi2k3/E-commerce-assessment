import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StorePage from './pages/storePage'
import ProductPage from './pages/ProductPage'
import LoginPage from './pages/login'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<StorePage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
