from fastapi.testclient import TestClient
from main import app
from store import store
import pytest

# using TestClient which comes with FastAPI (via Starlette).
# it lets us make requests against the app without actually running the server.
# super fast for these kinds of unit tests.
client = TestClient(app)

# FIXTURE EXPLANATION:
# since we are using an in-memory store (just a global python object),
# the state persists between tests. this means if test A adds an item,
# test B will see it, which causes flaky tests.
#
# this fixture runs automatically before every single test function to
# wipe the slate clean. gives us a fresh store every time.
@pytest.fixture(autouse=True)
def run_around_tests():
    # Setup: Reset everything to default
    store.carts = {}
    store.orders = []
    store.discount_codes = {}
    store.order_count = 0
    store.items = {}
    # re-seed the items so we have products to buy
    store.seed_data()
    yield
    # Teardown: nothing needed here since we just reset at the start of the next one

def test_read_main():
    """
    Sanity check. Just making sure the app actually starts and responds.
    """
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the E-commerce Assessment API"}

def test_add_to_cart():
    """
    Happy path for adding an item.
    Verifies that the item actually shows up in the user's cart
    with the right quantity.
    """
    # buying headphones (id 1)
    response = client.post("/cart/add?item_id=1&quantity=1&user_id=test_user")
    assert response.status_code == 200
    data = response.json()
    
    # check that it's in the return payload
    assert len(data["cart"]["items"]) == 1
    assert data["cart"]["items"][0]["item_id"] == 1
    assert data["cart"]["items"][0]["quantity"] == 1

def test_add_invalid_item():
    """
    Sad path. Trying to buy something that doesn't exist.
    Should yell at us with a 400 error.
    """
    response = client.post("/cart/add?item_id=999&quantity=1&user_id=test_user")
    assert response.status_code == 400
    assert "Item 999 not found" in response.json()["detail"]

def test_checkout_flow():
    """
    Full lifecycle test: Add -> Checkout -> Verify.
    This simulates what a real user does.
    """
    # 1. Add item to cart for a specific user
    client.post("/cart/add?item_id=1&quantity=1&user_id=checkout_user")
    
    # 2. Hit checkout
    response = client.post("/checkout?user_id=checkout_user")
    assert response.status_code == 200
    order = response.json()
    
    # 3. Validation
    assert order["user_id"] == "checkout_user"
    assert order["total_amount"] == 299.99
    # no discount applied here, so final should match total
    assert order["final_amount"] == 299.99
    assert order["discount_amount"] == 0
    
    # 4. Critical check: Cart should be empty after buying
    cart_response = client.get("/cart?user_id=checkout_user")
    assert len(cart_response.json()["items"]) == 0

def test_nth_order_discount_generation():
    """
    Testing the 'Every Nth Order' rule.
    Our config is set to N=3 for testing.
    So we place 3 orders and check if the code appears only on the 3rd one.
    """
    
    # Order 1: Should be boring, no code
    client.post("/cart/add?item_id=1&quantity=1&user_id=u1")
    client.post("/checkout?user_id=u1")
    
    gen_response = client.post("/admin/generate-discount")
    assert "No discount code generated" in gen_response.json()["message"]
    
    # Order 2: Still boring
    client.post("/cart/add?item_id=1&quantity=1&user_id=u2")
    client.post("/checkout?user_id=u2")
    
    # Order 3: Bingo! This should trigger the condition
    client.post("/cart/add?item_id=1&quantity=1&user_id=u3")
    client.post("/checkout?user_id=u3")
    
    # Check admin endpoint now
    gen_response = client.post("/admin/generate-discount")
    assert gen_response.status_code == 200
    data = gen_response.json()
    
    # Verify we got a code and it matches our pattern
    assert "Discount code generated" in data["message"]
    assert "DISCOUNT10-3" == data["code"]

def test_apply_discount_code():
    """
    Testing that a valid code actually reduces the price.
    """
    # Manually injecting a valid code into the store to test logic
    # independent of the generation rule.
    code = "TESTCODE"
    from models import DiscountCode
    store.discount_codes[code] = DiscountCode(code=code)
    
    # Buy headphones ($299.99)
    client.post("/cart/add?item_id=1&quantity=1&user_id=disc_user")
    
    # Checkout WITH the code
    response = client.post(f"/checkout?user_id=disc_user&discount_code={code}")
    assert response.status_code == 200
    order = response.json()
    
    # Math check: 10% of 299.99 is ~30.00
    expected_discount = 299.99 * 0.10
    
    assert order["discount_code"] == code
    assert order["discount_amount"] == expected_discount
    assert order["final_amount"] == 299.99 - expected_discount

def test_invalid_discount_code():
    """
    Trying to use a fake code. Should default to 400.
    """
    client.post("/cart/add?item_id=1&quantity=1&user_id=bad_code_user")
    response = client.post("/checkout?user_id=bad_code_user&discount_code=FAKE")
    assert response.status_code == 400
    assert "Invalid discount code" in response.json()["detail"]

def test_admin_stats():
    """
    Verifying that the admin dashboard sees the right numbers.
    """
    # Create some history: 1 order with 2 headphones
    client.post("/cart/add?item_id=1&quantity=2&user_id=stats_user") 
    client.post("/checkout?user_id=stats_user")
    
    response = client.get("/admin/stats")
    assert response.status_code == 200
    stats = response.json()
    
    # Should see 2 items total
    assert stats["total_items_purchased"] == 2
    # Total revenue should match price * 2
    assert stats["total_purchase_amount"] == 299.99 * 2


def test_concurrency_checkout():
    """
    Concurrency Test:
    Simulates 10 users checking out simultaneously.
    Verifies that order count increments correctly and no race conditions occur.
    """
    import concurrent.futures
    
    # 1. Setup: Add items to 10 different user carts
    dataset = [f"conc_user_{i}" for i in range(10)]
    
    for uid in dataset:
        client.post(f"/cart/add?item_id=1&quantity=1&user_id={uid}")
        
    initial_orders = len(store.orders)
    
    # 2. Parallel Execution: 10 threads hitting /checkout at once
    def perform_checkout(uid):
        return client.post(f"/checkout?user_id={uid}")
        
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(perform_checkout, dataset))
        
    # 3. Verification
    
    # All 10 requests should succeed
    for res in results:
        assert res.status_code == 200
        
    # Order count should have increased EXACTLY by 10
    final_orders = len(store.orders)
    assert final_orders == initial_orders + 10
    
    # Verify unique Order IDs
    order_ids = [res.json()['id'] for res in results]
    assert len(set(order_ids)) == 10
