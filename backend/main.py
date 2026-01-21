from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.staticfiles import StaticFiles
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from models import Cart, Order, Stats
from store import store
from config import settings

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for the FastAPI app.
    Handles startup and shutdown events.
    """
    # Startup: Load initial data
    store.seed_data()
    yield
    # Shutdown: Clean up resources if needed (none for in-memory)

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION, lifespan=lifespan)

# Serve product images from the backend
# Images will be accessible at http://localhost:8000/static/products/Headphones.png
app.mount("/static", StaticFiles(directory="."), name="static")

# enabling CORS because the frontend is on port 5173 (or 5174 if 5173 is busy) and backend is on 8000.
# need this for local dev communication.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the E-commerce Assessment API"}

# Product Endpoints

@app.get("/products")
def get_products():
    """
    Get all products.
    """
    return list(store.items.values())

@app.get("/products/{product_id}")
def get_product(product_id: int):
    """
    Get a single product by ID.
    """
    if product_id not in store.items:
        raise HTTPException(status_code=404, detail="Product not found")
    return store.items[product_id]

# Cart Endpoints

# I'm using a user_id param here to simulate different users.
# allows me to test multiple carts without needing a full login system.
# defaults to "demo_user" so simple calls just work.

@app.post("/cart/add")
def add_to_cart(item_id: int, quantity: int = 1, user_id: str = "demo_user"):
    """
    Add item to cart or update quantity if it's already there.
    """
    try:
        store.add_to_cart(user_id, item_id, quantity)
        return {"message": "Item added to cart", "cart": store.get_cart(user_id)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/cart")
def get_cart(user_id: str = "demo_user"):
    return store.get_cart(user_id)

@app.delete("/cart/remove")
def remove_from_cart(item_id: int, user_id: str = "demo_user"):
    """
    Remove an item completely from the cart.
    """
    try:
        store.remove_from_cart(user_id, item_id)
        return {"message": "Item removed from cart", "cart": store.get_cart(user_id)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/discount/validate")
def validate_discount_code(code: str):
    """
    Check if a discount code is valid (exists and hasn't been used).
    """
    is_valid = store.validate_discount_code(code)
    return {"code": code, "valid": is_valid}

# Checkout

@app.post("/checkout")
def checkout(discount_code: Optional[str] = None, user_id: str = "demo_user"):
    """
    Submits the order.
    Calculates totals, applies discount if the code is valid, and records the order.
    Checks the nth order condition internally to see if a new code should be generated next.
    """
    try:
        order = store.checkout(user_id, discount_code)
        return order
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Admin

@app.post("/admin/generate-discount")
def generate_discount():
    """
    Endpoint to manually trigger the discount generation check.
    If the order count condition is met, it spits out a new code.
    """
    code = store.generate_discount_code()
    if code:
        return {"message": "Discount code generated", "code": code}
    return {"message": "No discount code generated. Condition not met."}

@app.get("/admin/stats")
def get_stats():
    """
    Basic sales stats for the admin.
    """
    return store.get_stats()
