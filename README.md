# E-commerce Store

A full-stack e-commerce application I built for an assessment. It demonstrates cart management, checkout flow, and a discount code system where every nth customer gets a 10% off coupon.

![React](https://img.shields.io/badge/React-18-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-Python-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## What It Does

- 🛒 **Shopping Cart** — Add items, adjust quantities, remove stuff
- 💳 **Checkout** — Place orders, cart clears automatically after
- 🎟️ **Discount Codes** — Every 3rd order gets a 10% discount code
- 📊 **Admin Dashboard** — See total orders, revenue, and which codes were used
- 🔍 **Product Search** — Filter by name or category
- 📱 **Responsive** — Works on phones too

---

## Getting Started

You'll need Node.js 18+ and Python 3.10+.

### Start the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Start the Frontend

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and you're good to go!

---

## API Reference

Base URL: `http://localhost:8000`

### Products

| Endpoint | Method | What it does |
|----------|--------|--------------|
| `/products` | GET | Get all products |
| `/products/{id}` | GET | Get one product |

### Cart

| Endpoint | Method | What it does |
|----------|--------|--------------|
| `/cart` | GET | Get current cart |
| `/cart/add` | POST | Add item (or increase qty) |
| `/cart/remove` | DELETE | Remove item completely |

**Add to Cart Params:**
- `item_id` — which product
- `quantity` — how many (defaults to 1)
- `user_id` — simulated user (defaults to "demo_user")

### Checkout

```
POST /checkout?user_id=demo_user&discount_code=DISCOUNT10-3
```

Returns something like:
```json
{
  "id": 1,
  "total_amount": 299.99,
  "discount_amount": 30.00,
  "final_amount": 269.99
}
```

### Discount Validation

```
GET /discount/validate?code=DISCOUNT10-3
```

Returns `{ "valid": true }` or `{ "valid": false }`.

### Admin Endpoints

| Endpoint | Method | What it does |
|----------|--------|--------------|
| `/admin/generate-discount` | POST | Generates a code if nth order condition is met |
| `/admin/stats` | GET | Sales overview for admin |

**Stats response:**
```json
{
  "total_orders": 6,
  "total_items_purchased": 15,
  "total_purchase_amount": 1500.00,
  "discount_codes": ["DISCOUNT10-3", "DISCOUNT10-6"],
  "total_discount_amount": 60.00
}
```

### Frontend Pages

| Route | What's there |
|-------|--------------|
| `/` | Product grid with search |
| `/product/:id` | Product details page |
| `/admin` | Admin dashboard |

---

## How It's Built

```
Frontend (React + Vite)  →  Backend (FastAPI)
        ↓                           ↓
   CartContext              InMemoryStore
   (React state)            (Python dict)
```

**Frontend:** React 18, TypeScript, Tailwind CSS, shadcn/ui, Sonner for toasts

**Backend:** FastAPI, Pydantic, Pytest

---

## Design Decisions

### Why no login system?

I decided to skip full authentication for this assessment. Here's my thinking:

1. **Focus** — The requirements are about cart logic and discount codes, not auth flows
2. **Simulated sessions** — The API accepts a `user_id` param (defaults to "demo_user"), so you can still test multi-user scenarios by passing different IDs
3. **Easy to add later** — In production, you'd just swap the `user_id` param for the actual authenticated user from a JWT or session

### Why in-memory storage?

The requirements said I could use an in-memory store, so I did. It's simpler and there's no database setup needed. The trade-off is data disappears when you restart the server, but that's fine for a demo.

### How the discount codes work

Based on the FAQ in the assignment:
- Every **3rd order** (configurable) generates a new code
- Each code works **once** — after someone uses it, it's gone
- The discount is **10% off the entire order**, not individual items

### Thread Safety

Even though this uses an in-memory store, I implemented **thread safety** using `threading.RLock` (Reentrant Lock). This ensures that concurrent requests to critical endpoints (like `add_to_cart` or `checkout`) don't cause race conditions or data corruption, mimicking how a real database would handle transactions.

### Asset Management

Product images are hosted by the **FastAPI backend** (served as static files) rather than the frontend. The frontend uses a helper `getImageUrl()` to construct the full URL. This keeps asset management centralized in the backend, similar to how a cloud storage bucket would work in production.

---

## Running Tests

```bash
cd backend
pytest tests.py -v
```

The tests cover:
- Adding items to cart
- Handling invalid products
- Full checkout flow
- Nth order discount generation
- Applying/rejecting discount codes
- Admin statistics

---

## Does It Meet the Requirements?

| Requirement | Done? | Where |
|-------------|-------|-------|
| Add to cart API | ✅ | `POST /cart/add` |
| Checkout API | ✅ | `POST /checkout` |
| Validate discount at checkout | ✅ | Checked before applying |
| Nth order gets discount | ✅ | Every 3rd order |
| Admin: generate discount | ✅ | `POST /admin/generate-discount` |
| Admin: list stats | ✅ | `GET /admin/stats` |
| UI (stretch goal) | ✅ | Full React app |
| In-memory store | ✅ | `InMemoryStore` class (Thread-safe!) |
| Code quality | ✅ | TypeScript + typed Python |
| Comments & docs | ✅ | You're reading them! |
| Unit tests | ✅ | Pytest suite |

---

## Project Structure

```
backend/
├── main.py          # API endpoints
├── models.py        # Data models
├── store.py         # In-memory storage + business logic
├── config.py        # Settings
├── tests.py         # Unit tests
└── products/        # Product images (served via /static)

src/
├── components/
│   ├── CartDrawer.tsx
│   ├── Header.tsx
│   └── ui/          # shadcn components
├── pages/
│   ├── storePage.tsx
│   ├── ProductPage.tsx
│   └── AdminPage.tsx
├── context/
│   └── CartContext.tsx
├── lib/
│   └── api.ts       # API calls
└── App.tsx

public/
└── vite.svg         # Frontend assets
```

---

Built for an assessment. Thanks for checking it out!
