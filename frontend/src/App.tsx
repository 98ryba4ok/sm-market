import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { Layout } from "./components/layout/Layout/Layout";
import { ToastProvider } from "./contexts/ToastContext";
import { CartPage } from "./pages/CartPage/CartPage";
import { CatalogPage } from "./pages/CatalogPage/CatalogPage";
import { HomePage } from "./pages/HomePage/HomePage";
import { OrdersPage } from "./pages/OrdersPage/OrdersPage";
import { PasswordResetPage } from "./pages/PasswordResetPage/PasswordResetPage";
import { ProductDetailPage } from "./pages/ProductDetailPage/ProductDetailPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import { WishlistPage } from "./pages/WishlistPage/WishlistPage";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/password-reset/:token" element={<PasswordResetPage />} />
            <Route path="*" element={<div className="not-found-page"><h1 className="not-found-page__title">404 - Страница не найдена</h1></div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
