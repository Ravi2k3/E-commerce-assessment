from typing import List, Dict, Optional
from models import Item, Order, DiscountCode, Cart, CartItem

class InMemoryStore:
    """
    In-memory storage for the app state.
    
    Since the requirements said we don't need a real database, I'm using
    basic dictionaries to hold everything. It's faster to implement and 
    easier to run locally.
    
    couple things to note:
    1. if you restart the server, data is gone.
    2. not thread-safe, so wouldn't work well with multiple workers.
    """
    def __init__(self):
        self.items: Dict[int, Item] = {}
        
        # using a simple user_id string as the key here.
        # usually this would be linked to a real user table/auth token.
        self.carts: Dict[str, Cart] = {}
        self.orders: List[Order] = []
        self.discount_codes: Dict[str, DiscountCode] = {}
        
        # tracking order counts to trigger the nth order discount
        self.order_count: int = 0
        self.nth_order_trigger: int = 3 # generating a code every 3rd order for testing
        
    def seed_data(self):
        """
        Loading up default products with full details.
        Image paths match user-uploaded files in public/products/.
        """
        products = [
            {
                "id": 1,
                "name": "Wireless Noise-Canceling Headphones",
                "price": 299.99,
                "originalPrice": 349.99,
                "image": "/products/Headphones.png",
                "category": "Electronics",
                "rating": 4.8,
                "reviewCount": 2847,
                "description": "Experience immersive sound with our premium wireless headphones featuring advanced noise-canceling technology. Perfect for music lovers, travelers, and remote workers who demand crystal-clear audio.",
                "features": ["Active Noise Cancellation", "40-hour battery life", "Bluetooth 5.2", "Premium memory foam ear cushions", "Foldable design for travel"],
                "stock": 45,
                "sale": True
            },
            {
                "id": 2,
                "name": "Smart Fitness Watch Pro",
                "price": 199.50,
                "image": "/products/Smartwatch.png",
                "category": "Electronics",
                "rating": 4.5,
                "reviewCount": 1523,
                "description": "Track your health and fitness goals with precision. This advanced smartwatch monitors heart rate, sleep patterns, and over 100 workout modes.",
                "features": ["Heart rate monitoring", "GPS tracking", "Water resistant to 50m", "7-day battery life", "Compatible with iOS and Android"],
                "stock": 78
            },
            {
                "id": 3,
                "name": "Ergonomic Office Chair",
                "price": 450.00,
                "image": "/products/Chair.png",
                "category": "Furniture",
                "rating": 4.9,
                "reviewCount": 892,
                "description": "Designed for all-day comfort, this ergonomic chair features adjustable lumbar support, breathable mesh back, and customizable armrests.",
                "features": ["Adjustable lumbar support", "Breathable mesh back", "4D armrests", "Recline up to 135 degrees", "Supports up to 300 lbs"],
                "stock": 23
            },
            {
                "id": 4,
                "name": "Premium Cotton T-Shirt",
                "price": 25.00,
                "image": "/products/Shirt.png",
                "category": "Clothing",
                "rating": 4.2,
                "reviewCount": 3421,
                "description": "Ultra-soft 100% organic cotton t-shirt with a modern fit. Pre-shrunk and machine washable for easy care.",
                "features": ["100% organic cotton", "Pre-shrunk fabric", "Reinforced seams", "Available in 12 colors", "Sizes XS-3XL"],
                "stock": 156
            },
            {
                "id": 5,
                "name": "Stainless Steel Water Bottle",
                "price": 35.00,
                "image": "/products/Bottle.png",
                "category": "Accessories",
                "rating": 4.7,
                "reviewCount": 2156,
                "description": "Double-walled vacuum insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and eco-friendly.",
                "features": ["24-hour cold / 12-hour hot", "Double-wall insulation", "BPA-free", "Leak-proof lid", "32 oz capacity"],
                "stock": 234
            },
            {
                "id": 6,
                "name": "Leather Weekend Bag",
                "price": 150.00,
                "originalPrice": 199.00,
                "image": "/products/Bag.png",
                "category": "Accessories",
                "rating": 4.6,
                "reviewCount": 678,
                "description": "Handcrafted genuine leather weekend bag with spacious interior and multiple compartments. Perfect for short trips and gym sessions.",
                "features": ["Genuine full-grain leather", "Padded laptop sleeve", "Multiple pockets", "Detachable shoulder strap", "Brass hardware"],
                "stock": 34,
                "sale": True
            },
            {
                "id": 7,
                "name": "4K Ultra HD Monitor",
                "price": 399.99,
                "image": "/products/Monitor.png",
                "category": "Electronics",
                "rating": 4.4,
                "reviewCount": 1892,
                "description": "27-inch 4K UHD monitor with HDR support, perfect for content creators, gamers, and professionals who demand accurate colors.",
                "features": ["27-inch 4K UHD display", "HDR10 support", "99% sRGB color accuracy", "USB-C with 65W charging", "Height adjustable stand"],
                "stock": 56
            },
            {
                "id": 8,
                "name": "Mechanical Gaming Keyboard",
                "price": 129.99,
                "image": "/products/Keyboard.png",
                "category": "Electronics",
                "rating": 4.8,
                "reviewCount": 3567,
                "description": "Premium mechanical keyboard with hot-swappable switches, per-key RGB lighting, and aircraft-grade aluminum frame.",
                "features": ["Hot-swappable switches", "Per-key RGB lighting", "Aluminum frame", "N-key rollover", "Detachable USB-C cable"],
                "stock": 89
            },
            {
                "id": 9,
                "name": "Organic Face Serum",
                "price": 45.00,
                "image": "/products/Serum.png",
                "category": "Beauty",
                "rating": 4.9,
                "reviewCount": 4521,
                "description": "Luxurious organic face serum with vitamin C and hyaluronic acid. Brightens skin, reduces fine lines, and provides deep hydration.",
                "features": ["Vitamin C and hyaluronic acid", "100% organic ingredients", "Cruelty-free", "Suitable for all skin types", "1 oz bottle"],
                "stock": 167
            },
            {
                "id": 10,
                "name": "Running Shoes Gen 2",
                "price": 89.95,
                "image": "/products/Shoe.png",
                "category": "Footwear",
                "rating": 4.3,
                "reviewCount": 2789,
                "description": "Lightweight running shoes with responsive cushioning and breathable mesh upper. Designed for comfort on long runs.",
                "features": ["Responsive foam cushioning", "Breathable mesh upper", "Rubber outsole for grip", "Reflective details", "Available in 8 colors"],
                "stock": 145
            },
        ]
        
        for p in products:
            self.items[p["id"]] = Item(**p)

    def get_cart(self, user_id: str) -> Cart:
        # creates a new cart if this user id hasn't been seen before
        if user_id not in self.carts:
            self.carts[user_id] = Cart(items=[])
        return self.carts[user_id]
        
    def add_to_cart(self, user_id: str, item_id: int, quantity: int):
        """
        Add item logic.
        Just checking if the item exists, then updating quantity.
        Skipping inventory checks for now to keep it simple.
        """
        cart = self.get_cart(user_id)
        
        if item_id not in self.items:
            raise ValueError(f"Item {item_id} not found")
            
        existing_item = next((item for item in cart.items if item.item_id == item_id), None)
        
        if existing_item:
            existing_item.quantity += quantity
            # remove it if quantity goes to zero or less
            if existing_item.quantity <= 0:
                cart.items.remove(existing_item)
        else:
            if quantity > 0:
                cart.items.append(CartItem(item_id=item_id, quantity=quantity))

    def remove_from_cart(self, user_id: str, item_id: int):
        """
        Remove an item completely from the cart.
        """
        cart = self.get_cart(user_id)
        existing_item = next((item for item in cart.items if item.item_id == item_id), None)
        
        if not existing_item:
            raise ValueError(f"Item {item_id} not in cart")
        
        cart.items.remove(existing_item)
                
    def checkout(self, user_id: str, discount_code: Optional[str] = None) -> Order:
        """
        Validation and order creation.
        Calculates the final total, applies any discounts, transfers the 
        items to an Order object, and then wipes the cart.
        """
        cart = self.get_cart(user_id)
        if not cart.items:
            raise ValueError("Cart is empty")
            
        total_amount = 0.0
        for cart_item in cart.items:
            item = self.items[cart_item.item_id]
            total_amount += item.price * cart_item.quantity
            
        discount_amount = 0.0
        if discount_code:
            if discount_code in self.discount_codes and self.discount_codes[discount_code].is_valid:
                discount_amount = total_amount * 0.10 # 10% off
                
                # requirements said code can be used once.
                # easiest way to enforce that is to just delete it after use.
                del self.discount_codes[discount_code]
            else:
                raise ValueError("Invalid discount code")
                
        final_amount = total_amount - discount_amount
        
        order = Order(
            id=len(self.orders) + 1,
            user_id=user_id,
            items=list(cart.items), # copy the list so we have a snapshot
            total_amount=total_amount,
            discount_code=discount_code,
            discount_amount=discount_amount,
            final_amount=final_amount
        )
        
        self.orders.append(order)
        self.order_count += 1
        
        # empty the cart now that order is placed
        cart.items = []
        
        return order
        
    def generate_discount_code(self) -> Optional[str]:
        """
        Checks if we hit the nth order milestone.
        If we did, we generate a new code and store it.
        """
        if self.order_count > 0 and self.order_count % self.nth_order_trigger == 0:
            code = f"DISCOUNT10-{self.order_count}"
            self.discount_codes[code] = DiscountCode(code=code)
            return code
        return None

    def validate_discount_code(self, code: str) -> bool:
        """
        Check if a discount code exists and is valid.
        """
        return code in self.discount_codes and self.discount_codes[code].is_valid
        
    def get_stats(self) -> Dict:
        """
        Simple aggregation for the admin view.
        """
        total_items = sum(sum(item.quantity for item in order.items) for order in self.orders)
        total_purchase = sum(order.final_amount for order in self.orders)
        discount_list = [order.discount_code for order in self.orders if order.discount_code]
        total_discount = sum(order.discount_amount for order in self.orders)
        
        return {
            "total_orders": len(self.orders),
            "total_items_purchased": total_items,
            "total_purchase_amount": total_purchase,
            "discount_codes": discount_list,
            "total_discount_amount": total_discount
        }

store = InMemoryStore()
