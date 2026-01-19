from typing import List, Dict, Optional
from .models import User, Item, Order, DiscountCode, Cart

class InMemoryStore:
    def __init__(self):
        # Initialize in-memory storage
        self.users: Dict[str, User] = {}
        self.items: Dict[int, Item] = {}
        self.carts: Dict[str, Cart] = {}
        self.orders: List[Order] = []
        self.discount_codes: Dict[str, DiscountCode] = {}
        self.order_count: int = 0
        
    def seed_data(self):
        # Create some initial users and products
        pass

    def get_user(self, username: str) -> Optional[User]:
        pass
        
    def add_to_cart(self, user_id: str, item_id: int, quantity: int):
        pass
        
    def get_cart(self, user_id: str) -> Cart:
        pass
        
    def create_order(self, user_id: str, discount_code: Optional[str] = None) -> Order:
        pass
        
    def generate_discount_code(self) -> Optional[str]:
        # Logic for nth order
        pass
        
    def get_stats(self) -> Dict:
        pass

# Global store instance
store = InMemoryStore()
