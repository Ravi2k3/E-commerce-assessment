from typing import List, Optional
from pydantic import BaseModel

# keeping the models simple for this assessment.
# we don't need full user auth or complex database schemas,
# just enough structure to handle the cart and checkout flow.

class Item(BaseModel):
    """
    Product definition. 
    Full product data to match frontend display requirements.
    """
    id: int
    name: str
    price: float
    originalPrice: Optional[float] = None
    image: str
    category: str
    rating: float
    reviewCount: int
    description: str
    features: List[str]
    stock: int
    sale: bool = False

class CartItem(BaseModel):
    """
    Simple link between a product and how many of it the user wants.
    """
    item_id: int
    quantity: int = 1

class Cart(BaseModel):
    """
    The user's cart. 
    Just a list of items for now. In a real app we'd probably have 
    timestamps and other metadata here.
    """
    items: List[CartItem] = []
    
class Order(BaseModel):
    """
    Snapshot of a completed order.
    We verify and store the final price calculations here so that if 
    product prices change later, old orders stay accurate.
    """
    id: int
    user_id: str
    items: List[CartItem]
    total_amount: float
    discount_code: Optional[str] = None
    discount_amount: float = 0
    final_amount: float

class DiscountCode(BaseModel):
    """
    Used to validate if a code exists and is still usable.
    """
    code: str
    is_valid: bool = True

class Stats(BaseModel):
    """
    What the admin dashboard sees.
    """
    total_items_purchased: int
    total_purchase_amount: float
    discount_codes: List[str]
    total_discount_amount: float
