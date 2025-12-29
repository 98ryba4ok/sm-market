# Диаграммы архитектуры SM-Market

## 1. Структура базы данных (ER-диаграмма)

```mermaid
erDiagram
    User ||--o{ Order : places
    User ||--o{ Cart : has
    User ||--o{ ProductReview : writes
    User ||--o{ Wishlist : has
    
    Category ||--o{ Category : "has subcategories"
    Category ||--o{ Product : contains
    
    Product ||--o{ ProductImage : has
    Product ||--o{ ProductReview : receives
    Product ||--o{ CartItem : "added to"
    Product ||--o{ OrderItem : "ordered in"
    Product }o--o{ Wishlist : "saved in"
    
    Cart ||--o{ CartItem : contains
    
    Order ||--o{ OrderItem : contains
    
    User {
        int id PK
        string email UK
        string phone UK
        boolean is_active
        boolean is_staff
        datetime date_joined
    }
    
    Category {
        int id PK
        string name
        string slug UK
        text description
        int parent_id FK
        string image
        boolean is_active
        datetime created_at
        datetime updated_at
    }
    
    Product {
        int id PK
        string name
        string slug UK
        text description
        int category_id FK
        decimal price
        decimal discount_price
        int stock_quantity
        boolean is_active
        int views_count
        datetime created_at
        datetime updated_at
    }
    
    ProductImage {
        int id PK
        int product_id FK
        string image
        boolean is_main
        int order
        string alt_text
    }
    
    ProductReview {
        int id PK
        int product_id FK
        int user_id FK
        int rating
        text comment
        boolean is_verified_purchase
        datetime created_at
        datetime updated_at
    }
    
    Cart {
        int id PK
        int user_id FK
        string session_key
        datetime created_at
        datetime updated_at
    }
    
    CartItem {
        int id PK
        int cart_id FK
        int product_id FK
        int quantity
        datetime added_at
    }
    
    Order {
        int id PK
        int user_id FK
        string order_number UK
        string status
        decimal total_amount
        text delivery_address
        string delivery_city
        string delivery_postal_code
        string phone
        string email
        string payment_status
        string payment_method
        string payment_id
        datetime created_at
        datetime updated_at
    }
    
    OrderItem {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal price_at_purchase
        string product_name
    }
    
    Wishlist {
        int id PK
        int user_id FK
        datetime created_at
    }
```

## 2. Архитектура приложения (High-level)

```mermaid
graph TB
    subgraph Client["Client Browser"]
        React["React App<br/>TypeScript + Vite"]
        Router["React Router"]
        Query["TanStack Query"]
        Zustand["Zustand Stores"]
    end
    
    subgraph Backend["Django Backend"]
        API["Django REST Framework"]
        Auth["JWT Authentication"]
        Models["Django Models"]
        Admin["Django Admin"]
    end
    
    subgraph External["External Services"]
        YooKassa["ЮKassa Payment"]
        Storage["Media Storage"]
    end
    
    subgraph Database["Database Layer"]
        Postgres["PostgreSQL"]
    end
    
    React --> Router
    React --> Query
    React --> Zustand
    
    Query -->|HTTP/REST| API
    Zustand -->|State| React
    
    API --> Auth
    API --> Models
    Models --> Postgres
    Admin --> Models
    
    API -->|Payment API| YooKassa
    YooKassa -->|Webhook| API
    
    Models -->|Images| Storage
    
    style React fill:#61dafb
    style API fill:#092e20
    style Postgres fill:#336791
    style YooKassa fill:#ffd700
```

## 3. Поток данных при покупке товара

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant API
    participant Database
    participant YooKassa
    
    User->>Frontend: Просмотр товара
    Frontend->>API: GET /api/products/{id}
    API->>Database: SELECT product
    Database-->>API: Product data
    API-->>Frontend: Product JSON
    Frontend-->>User: Отображение товара
    
    User->>Frontend: Добавить в корзину
    Frontend->>API: POST /api/cart/items/
    API->>Database: INSERT cart_item
    Database-->>API: Success
    API-->>Frontend: Cart updated
    Frontend-->>User: Уведомление
    
    User->>Frontend: Перейти к оформлению
    Frontend->>API: GET /api/cart/
    API->>Database: SELECT cart with items
    Database-->>API: Cart data
    API-->>Frontend: Cart JSON
    
    User->>Frontend: Заполнить форму доставки
    User->>Frontend: Подтвердить заказ
    Frontend->>API: POST /api/orders/
    API->>Database: BEGIN TRANSACTION
    API->>Database: INSERT order
    API->>Database: INSERT order_items
    API->>Database: UPDATE product stock
    API->>Database: DELETE cart_items
    API->>Database: COMMIT
    Database-->>API: Order created
    API-->>Frontend: Order JSON
    
    Frontend->>API: POST /api/payments/create/
    API->>YooKassa: Create payment
    YooKassa-->>API: Payment URL
    API-->>Frontend: Confirmation URL
    Frontend-->>User: Redirect to payment
    
    User->>YooKassa: Оплата
    YooKassa->>API: POST /api/payments/webhook/
    API->>Database: UPDATE order status
    Database-->>API: Success
    API-->>YooKassa: 200 OK
    
    YooKassa-->>User: Redirect to success page
    User->>Frontend: Проверить статус
    Frontend->>API: GET /api/orders/{id}/
    API->>Database: SELECT order
    Database-->>API: Order data
    API-->>Frontend: Order JSON
    Frontend-->>User: Заказ оплачен
```

## 4. Структура Frontend приложения

```mermaid
graph TD
    App[App.tsx]
    Router[React Router]
    
    App --> Router
    
    Router --> Home[HomePage]
    Router --> Products[ProductsPage]
    Router --> ProductDetail[ProductDetailPage]
    Router --> Cart[CartPage]
    Router --> Checkout[CheckoutPage]
    Router --> Orders[OrdersPage]
    Router --> Wishlist[WishlistPage]
    
    subgraph Features
        AuthFeature[auth/]
        CatalogFeature[catalog/]
        CartFeature[cart/]
        OrdersFeature[orders/]
        WishlistFeature[wishlist/]
    end
    
    subgraph Shared
        UIComponents[components/ui/]
        LayoutComponents[components/layout/]
        Hooks[shared/hooks/]
        API[shared/api/]
        Types[types/]
    end
    
    subgraph State
        AuthStore[authStore]
        CartStore[cartStore]
        WishlistStore[wishlistStore]
        ReactQuery[React Query Cache]
    end
    
    Products --> CatalogFeature
    ProductDetail --> CatalogFeature
    Cart --> CartFeature
    Checkout --> OrdersFeature
    Orders --> OrdersFeature
    Wishlist --> WishlistFeature
    
    CatalogFeature --> UIComponents
    CartFeature --> UIComponents
    OrdersFeature --> UIComponents
    
    CatalogFeature --> API
    CartFeature --> API
    OrdersFeature --> API
    
    CartFeature --> CartStore
    AuthFeature --> AuthStore
    WishlistFeature --> WishlistStore
    
    API --> ReactQuery
    
    style App fill:#61dafb
    style State fill:#ffd700
    style Shared fill:#90ee90
```

## 5. API Endpoints структура

```mermaid
graph LR
    API["/api/"]
    
    API --> Auth["/auth/"]
    API --> Products["/products/"]
    API --> Categories["/categories/"]
    API --> Cart["/cart/"]
    API --> Orders["/orders/"]
    API --> Wishlist["/wishlist/"]
    API --> Payments["/payments/"]
    
    Auth --> Login["/login/ POST"]
    Auth --> Register["/register/ POST"]
    Auth --> Refresh["/refresh/ POST"]
    Auth --> Logout["/logout/ POST"]
    
    Products --> ProductList["/GET"]
    Products --> ProductDetail["/{id}/ GET"]
    Products --> ProductReviews["/{id}/reviews/ GET,POST"]
    
    Categories --> CategoryList["/GET"]
    Categories --> CategoryProducts["/{id}/products/ GET"]
    
    Cart --> GetCart["/GET"]
    Cart --> AddItem["/items/ POST"]
    Cart --> UpdateItem["/items/{id}/ PATCH"]
    Cart --> RemoveItem["/items/{id}/ DELETE"]
    
    Orders --> CreateOrder["/POST"]
    Orders --> OrderList["/GET"]
    Orders --> OrderDetail["/{id}/ GET"]
    Orders --> CancelOrder["/{id}/cancel/ POST"]
    
    Wishlist --> GetWishlist["/GET"]
    Wishlist --> AddToWishlist["/add/ POST"]
    Wishlist --> RemoveFromWishlist["/remove/{id}/ DELETE"]
    
    Payments --> CreatePayment["/create/ POST"]
    Payments --> PaymentWebhook["/webhook/ POST"]
    Payments --> PaymentStatus["/{id}/status/ GET"]
    
    style API fill:#092e20
    style Auth fill:#ff6b6b
    style Products fill:#4ecdc4
    style Cart fill:#95e1d3
    style Orders fill:#f38181
    style Payments fill:#ffd700
```

## 6. Состояния заказа (State Machine)

```mermaid
stateDiagram-v2
    [*] --> Pending: Order Created
    
    Pending --> Processing: Payment Confirmed
    Pending --> Cancelled: Payment Failed/Timeout
    
    Processing --> Shipped: Order Shipped
    Processing --> Cancelled: User Cancellation
    
    Shipped --> Delivered: Delivery Confirmed
    Shipped --> Processing: Return to Processing
    
    Delivered --> [*]
    Cancelled --> [*]
    
    note right of Pending
        Ожидание оплаты
        payment_status: pending
    end note
    
    note right of Processing
        Заказ обрабатывается
        payment_status: paid
    end note
    
    note right of Shipped
        Заказ отправлен
        Tracking available
    end note
    
    note right of Delivered
        Заказ доставлен
        Final state
    end note
    
    note right of Cancelled
        Заказ отменен
        Refund if paid
    end note
```

## 7. Аутентификация и авторизация

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant API
    participant Database
    
    User->>Frontend: Login (email, password)
    Frontend->>API: POST /api/auth/login/
    API->>Database: Verify credentials
    Database-->>API: User found
    API->>API: Generate JWT tokens
    API-->>Frontend: access_token, refresh_token
    Frontend->>Frontend: Store tokens
    Frontend-->>User: Redirect to home
    
    Note over Frontend,API: Access token expires after 30 min
    
    User->>Frontend: Request protected resource
    Frontend->>API: GET /api/orders/<br/>Authorization: Bearer {access_token}
    API->>API: Verify token
    API-->>Frontend: 401 Unauthorized
    
    Frontend->>API: POST /api/auth/refresh/<br/>{refresh_token}
    API->>API: Verify refresh token
    API->>API: Generate new access token
    API-->>Frontend: new access_token
    
    Frontend->>API: GET /api/orders/<br/>Authorization: Bearer {new_access_token}
    API->>Database: Fetch orders
    Database-->>API: Orders data
    API-->>Frontend: Orders JSON
    Frontend-->>User: Display orders
```

## 8. Компонентная структура страницы товара

```mermaid
graph TD
    ProductDetailPage[ProductDetailPage]
    
    ProductDetailPage --> Breadcrumbs[Breadcrumbs]
    ProductDetailPage --> ImageGallery[ProductImageGallery]
    ProductDetailPage --> ProductInfo[ProductInfo]
    ProductDetailPage --> Reviews[ProductReviews]
    ProductDetailPage --> Related[RelatedProducts]
    
    ProductInfo --> Price[Price Display]
    ProductInfo --> Stock[Stock Status]
    ProductInfo --> AddToCart[AddToCartButton]
    ProductInfo --> WishlistBtn[WishlistButton]
    ProductInfo --> Description[Description]
    
    Reviews --> ReviewsList[ReviewsList]
    Reviews --> ReviewForm[ReviewForm]
    
    ReviewsList --> ReviewCard1[ReviewCard]
    ReviewsList --> ReviewCard2[ReviewCard]
    ReviewsList --> ReviewCard3[ReviewCard]
    
    ReviewForm --> RatingInput[Rating Selector]
    ReviewForm --> CommentInput[Comment Textarea]
    ReviewForm --> SubmitBtn[Submit Button]
    
    Related --> ProductCard1[ProductCard]
    Related --> ProductCard2[ProductCard]
    Related --> ProductCard3[ProductCard]
    
    style ProductDetailPage fill:#61dafb
    style ImageGallery fill:#4ecdc4
    style ProductInfo fill:#95e1d3
    style Reviews fill:#f38181
```

## 9. Управление состоянием корзины

```mermaid
graph TB
    User[User Action]
    
    User -->|Add to Cart| AddAction[addToCart]
    User -->|Update Quantity| UpdateAction[updateQuantity]
    User -->|Remove Item| RemoveAction[removeItem]
    User -->|Clear Cart| ClearAction[clearCart]
    
    AddAction --> CartStore[Cart Store<br/>Zustand]
    UpdateAction --> CartStore
    RemoveAction --> CartStore
    ClearAction --> CartStore
    
    CartStore -->|Sync| LocalStorage[localStorage]
    CartStore -->|Sync| API[Backend API]
    
    LocalStorage -->|Load on mount| CartStore
    API -->|Response| CartStore
    
    CartStore -->|Subscribe| CartIcon[Cart Icon<br/>Badge Count]
    CartStore -->|Subscribe| CartPage[Cart Page]
    CartStore -->|Subscribe| Checkout[Checkout Page]
    
    CartStore -->|Calculate| TotalPrice[Total Price]
    CartStore -->|Calculate| ItemCount[Items Count]
    
    style CartStore fill:#ffd700
    style LocalStorage fill:#90ee90
    style API fill:#092e20
```

## 10. Deployment архитектура

```mermaid
graph TB
    subgraph Internet
        User[Users]
        CDN[CDN<br/>Static Assets]
    end
    
    subgraph Load_Balancer
        LB[Load Balancer<br/>Nginx]
    end
    
    subgraph Frontend_Servers
        FE1[Frontend Server 1<br/>React Build]
        FE2[Frontend Server 2<br/>React Build]
    end
    
    subgraph Backend_Servers
        BE1[Backend Server 1<br/>Django + Gunicorn]
        BE2[Backend Server 2<br/>Django + Gunicorn]
    end
    
    subgraph Database_Layer
        PG_Master[PostgreSQL<br/>Master]
        PG_Replica[PostgreSQL<br/>Replica]
    end
    
    subgraph Cache_Layer
        Redis[Redis<br/>Session + Cache]
    end
    
    subgraph Storage
        S3[S3 Storage<br/>Media Files]
    end
    
    subgraph External
        YK[ЮKassa API]
    end
    
    User --> CDN
    User --> LB
    
    LB --> FE1
    LB --> FE2
    
    FE1 --> LB
    FE2 --> LB
    
    LB --> BE1
    LB --> BE2
    
    BE1 --> PG_Master
    BE2 --> PG_Master
    
    PG_Master --> PG_Replica
    
    BE1 --> Redis
    BE2 --> Redis
    
    BE1 --> S3
    BE2 --> S3
    
    BE1 --> YK
    BE2 --> YK
    
    style User fill:#61dafb
    style LB fill:#ff6b6b
    style PG_Master fill:#336791
    style Redis fill:#dc382d
    style S3 fill:#ff9900
    style YK fill:#ffd700
```

## Заключение

Эти диаграммы помогают визуализировать:
- Структуру базы данных и связи между таблицами
- Архитектуру приложения на высоком уровне
- Потоки данных при ключевых операциях
- Организацию кода frontend
- API endpoints структуру
- Состояния заказов
- Процесс аутентификации
- Компонентную структуру
- Управление состоянием
- Deployment архитектуру

Используйте эти диаграммы как справочный материал при разработке и для онбординга новых разработчиков.