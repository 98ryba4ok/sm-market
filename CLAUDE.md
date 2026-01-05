# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SM Market is a full-stack e-commerce application with Django REST Framework backend and React + TypeScript frontend. The project uses PostgreSQL database and is containerized with Docker.

**Stack:**
- Backend: Django 6.0 + DRF + PostgreSQL + JWT authentication
- Frontend: React 19 + TypeScript + Vite + React Router v7
- State Management: Frontend uses plain React (no Zustand/TanStack Query yet implemented)
- Styling: vanila CSS

## Development Commands

### Docker (Recommended)

```bash
# Start all services
docker-compose up --build

# Run migrations in Docker
docker-compose exec backend python manage.py migrate

# Create sample data in Docker
docker-compose exec backend python manage.py create_sample_data

# Create superuser in Docker
docker-compose exec backend python manage.py createsuperuser

# Stop all services
docker-compose down
```

**Services:**
- Backend: http://localhost:8000
- Frontend: http://localhost:5173
- Admin: http://localhost:8000/admin

## Architecture & Code Organization

### Backend Structure

The backend follows Django's app-based architecture with three main apps:

**1. `apps/catalog/` - Product Catalog**
- Models: `Category`, `Product`, `ProductImage`, `ProductReview`, `Wishlist`, `Banner`
- Categories support nesting (parent/subcategories)
- Products have slug auto-generation with Cyrillic transliteration
- Product images support galleries with main image flag
- Reviews have unique constraint (one review per user per product)
- Wishlist is OneToOne with User using ManyToMany for products

**2. `apps/orders/` - Orders and Cart**
- Models: `Cart`, `CartItem`, `Order`, `OrderItem`
- Cart supports both authenticated users and guest sessions (via session_key)
- Orders auto-generate unique order numbers (format: `ORD-{12_char_hex}`)
- OrderItem stores product snapshot (price_at_purchase, product_name) for historical accuracy
- Stock is validated before adding to cart (CartItem.clean method)

**3. `apps/users/` - Authentication**
- Custom User model with email as username (no username field)
- Email-based authentication via `EmailBackend`
- JWT tokens: access (30min lifetime), refresh (1 day lifetime)
- Token blacklist enabled for logout functionality

**URL Routing:**
- `/api/auth/*` - User authentication endpoints
- `/api/catalog/*` - Products and categories endpoints
- `/api/*` - Orders, cart, wishlist, reviews endpoints
- `/admin/` - Django admin panel
- `/media/*` - Media files (DEBUG mode only)

**Key Backend Patterns:**
- Models use properties for computed fields (`final_price`, `discount_percentage`, `in_stock`)
- Cyrillic slugs auto-transliterate to Latin on save
- Custom management command `create_sample_data` for test data generation
- JWT auto-refresh implemented via axios interceptors in frontend (backend just provides endpoints)

### Frontend Structure

The frontend is organized in a feature-based architecture:

**`src/api/`** - API layer
- `axios.ts` - Configured axios instance with JWT interceptors
- Auto-refresh access tokens on 401 responses
- Auto-redirect to /login if refresh fails
- Queue system prevents duplicate refresh requests
- Individual API modules: `authApi`, `productsApi`, `categoriesApi`, `cartApi`, `ordersApi`, `reviewsApi`, `wishlistApi`, `bannersApi`

**`src/types/`** - TypeScript definitions
- All API request/response types are strictly typed
- Common types: `PaginatedResponse<T>`, `ApiError`, `MessageResponse`
- Use `import type` for type-only imports

**`src/components/`** - React components
- `ui/` - Basic UI primitives (Button, Card, Input, Modal, etc.)
- `layout/` - Layout components (Header, Footer, Layout)
- `shared/` - Shared components used across features
- `features/` - Feature-specific components (auth, products, cart, orders, reviews, wishlist)

**`src/pages/`** - Page components
- Each page represents a route in the application
- Pages compose components from `components/` directory

**Current State:** The frontend is partially implemented:
- Basic routing structure in `App.tsx` (only HomePage route exists currently)
- API layer is fully implemented with proper TypeScript types
- Component structure is defined but many components are placeholders
- No state management library integrated yet (planned: Zustand + TanStack Query per README)

### Authentication Flow

1. User logs in via `POST /api/auth/login/` with email + password
2. Backend returns `{access: string, refresh: string}` JWT tokens
3. Frontend stores tokens in localStorage
4. Axios interceptor adds `Authorization: Bearer {access}` to all requests
5. On 401 error, interceptor automatically calls `POST /api/auth/refresh/` with refresh token
6. New access token saved to localStorage and original request retried
7. If refresh fails, user redirected to /login and tokens cleared

### Database Models Overview

**Key Relationships:**
- `User` (1) → (many) `Order`, `ProductReview`, `Cart`
- `User` (1) → (1) `Wishlist` → (many) `Product`
- `Category` (self-referential) → (many) `Category` (subcategories)
- `Category` (1) → (many) `Product`
- `Product` (1) → (many) `ProductImage`, `ProductReview`, `CartItem`, `OrderItem`
- `Cart` (1) → (many) `CartItem`
- `Order` (1) → (many) `OrderItem`

**Important Model Behaviors:**
- Product/Category slugs auto-generate with Cyrillic → Latin transliteration
- ProductImage: setting `is_main=True` automatically unsets other images for that product
- Order: generates unique order number on creation, tracks stock changes on cancellation
- CartItem: validates stock availability in `clean()` method

## API Endpoints Reference

**Authentication** (`/api/auth/`)
- `POST /register/` - Register new user
- `POST /login/` - Login (returns access + refresh tokens)
- `POST /logout/` - Logout (blacklist refresh token)
- `POST /refresh/` - Refresh access token
- `GET /me/` - Get current user info

**Catalog** (`/api/catalog/`)
- `GET /categories/` - List categories
- `GET /categories/{slug}/` - Category detail
- `GET /categories/{slug}/products/` - Products in category
- `GET /products/` - List products (supports filtering: category, min_price, max_price, in_stock, on_sale, min_rating, search, ordering)
- `GET /products/{slug_or_id}/` - Product detail
- `GET /products/{id}/reviews/` - Product reviews
- `GET /banners/` - List active banners

**Orders** (`/api/`)
- `GET /cart/` - Get current user's cart
- `POST /cart/add/` - Add item to cart
- `PUT /cart/items/{id}/` - Update cart item quantity
- `DELETE /cart/items/{id}/` - Remove item from cart
- `POST /cart/clear/` - Clear entire cart
- `GET /orders/` - List user's orders
- `POST /orders/` - Create order from cart
- `GET /orders/{id}/` - Order detail
- `POST /orders/{id}/cancel/` - Cancel order
- `GET /wishlist/` - Get wishlist
- `POST /wishlist/add/` - Add to wishlist
- `DELETE /wishlist/remove/{product_id}/` - Remove from wishlist
- `GET /reviews/` - List user's reviews
- `POST /reviews/` - Create review
- `PATCH /reviews/{id}/` - Update review
- `DELETE /reviews/{id}/` - Delete review

## Environment Setup

**Backend `.env`** (in `backend/` directory):
```env
SECRET_KEY=your-secret-key
DEBUG=1
ALLOWED_HOSTS=*
POSTGRES_DB=sm_market
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

**Frontend `.env`** (in `frontend/` directory):
```env
VITE_API_URL=/api
```

## Important Implementation Notes

1. **Cyrillic Support**: Category and Product models have custom `save()` methods that transliterate Cyrillic names to Latin for URL-safe slugs. Don't remove this logic.

2. **JWT Token Management**: The axios interceptor handles token refresh automatically. When working with auth, ensure you understand the queue mechanism that prevents duplicate refresh requests.

3. **Order Snapshots**: OrderItem stores product price and name at purchase time. Don't create foreign key relationships that assume current product data matches order data.

4. **Stock Management**: When implementing cart operations, stock validation happens in `CartItem.clean()`. Order cancellation automatically returns stock via `Order.cancel()` method.

5. **Media Files**: In production, configure proper media file storage. Currently media files are served by Django in DEBUG mode only.

6. **Permissions**: Default DRF permission is `IsAuthenticated` globally. Individual endpoints may override this.

7. **CORS**: Currently set to `CORS_ALLOW_ALL_ORIGINS = True` for development. Restrict this in production.

8. **Frontend State**: The README mentions Zustand + TanStack Query but these are NOT yet implemented. The current frontend is minimal with only basic routing.

## Testing


**Sample Data:**
The `create_sample_data` management command creates:
- 5 test users (password: `testpass123`)
- 4 parent categories with subcategories
- ~29 products across categories
- Product images (placeholder URLs)
- Random reviews on products
- Sample orders for first 3 users

Use `--clear` flag to reset all data before creating new samples.

## Current Development Status

Based on git status, the project is actively being developed:
- Branch: `marketV1`
- Recent work: Backend catalog/orders models, admin configuration, serializers, views
- Frontend: API layer complete, basic component structure, minimal routing
- Untracked: Many new frontend files (components, pages, API modules, types)
- Migration pending: `backend/apps/catalog/migrations/0002_banner.py`

The frontend appears to be in early development stage - API integration is ready but most UI components and pages need implementation.
