from fastapi import FastAPI, HTTPException, Depends, status
from typing import List, Optional
from .models import LoginRequest, Cart, Order, Stats
from .store import store
from .config import settings

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

@app.on_event("startup")
async def startup_event():
    store.seed_data()

@app.get("/")
def read_root():
    return {"message": "Welcome to the E-commerce Assessment API"}

# Auth
@app.post("/login")
def login(request: LoginRequest):
    pass

# Cart
@app.post("/cart/add")
def add_to_cart(item_id: int, quantity: int = 1, user_id: str = "demo_user"):
    pass

@app.get("/cart")
def get_cart(user_id: str = "demo_user"):
    pass

# Checkout
@app.post("/checkout")
def checkout(discount_code: Optional[str] = None, user_id: str = "demo_user"):
    pass

# Admin
@app.post("/admin/generate-discount")
def generate_discount():
    pass

@app.get("/admin/stats")
def get_stats():
    pass
