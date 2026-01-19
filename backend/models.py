from typing import List, Optional, Dict
from pydantic import BaseModel

class User(BaseModel):
    username: str
    password: str  # In production, never store plain text passwords

class LoginRequest(BaseModel):
    username: str
    password: str

class Item(BaseModel):
    id: int
    name: str
    price: float

class CartItem(BaseModel):
    item_id: int
    quantity: int = 1

class Cart(BaseModel):
    items: List[CartItem] = []
    
class Order(BaseModel):
    id: int
    user_id: str
    items: List[CartItem]
    total_amount: float
    discount_code: Optional[str] = None
    final_amount: float

class DiscountCode(BaseModel):
    code: str
    is_valid: bool = True

class Stats(BaseModel):
    total_orders: int
    total_purchase_amount: float
    discount_codes: List[str]
    total_discount_amount: float
