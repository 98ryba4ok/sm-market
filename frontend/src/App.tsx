import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { Layout } from "./components/layout/Layout/Layout";
import { ToastProvider } from "./contexts/ToastContext";
import { AboutPage } from "./pages/AboutPage/AboutPage";
import { OfferPage } from "./pages/OfferPage/OfferPage";
import { PrivacyPage } from "./pages/PrivacyPage/PrivacyPage";
import { AccountCompromisedPage } from "./pages/AccountCompromisedPage/AccountCompromisedPage";
import { CancelEmailChangePage } from "./pages/CancelEmailChangePage";
import { CartPage } from "./pages/CartPage/CartPage";
import { CatalogPage } from "./pages/CatalogPage/CatalogPage";
import { CheckoutPage } from "./pages/CheckoutPage/CheckoutPage";
import { CompanyReviewsPage } from "./pages/CompanyReviewsPage/CompanyReviewsPage";
import { ConfirmNewEmailPage } from "./pages/ConfirmNewEmailPage";
import { ConfirmOldEmailPage } from "./pages/ConfirmOldEmailPage";
import { DeliveryPage } from "./pages/DeliveryPage/DeliveryPage";
import { FeedbackPage } from "./pages/FeedbackPage/FeedbackPage";
import { HomePage } from "./pages/HomePage/HomePage";
import { OrdersPage } from "./pages/OrdersPage/OrdersPage";
import { OrderSuccessPage } from "./pages/OrderSuccessPage/OrderSuccessPage";
import { PasswordResetPage } from "./pages/PasswordResetPage/PasswordResetPage";
import { PaymentInfoPage } from "./pages/PaymentInfoPage/PaymentInfoPage";
import { PaymentReturnPage } from "./pages/PaymentReturnPage/PaymentReturnPage";
import { ProductDetailPage } from "./pages/ProductDetailPage/ProductDetailPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import { WarrantyPage } from "./pages/WarrantyPage/WarrantyPage";
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
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
            <Route path="/payment/return" element={<PaymentReturnPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/offer" element={<OfferPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/company" element={<CompanyReviewsPage />} />
            <Route path="/delivery" element={<DeliveryPage />} />
            <Route path="/payment" element={<PaymentInfoPage />} />
            <Route path="/warranty" element={<WarrantyPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/password-reset/:token" element={<PasswordResetPage />} />
            <Route path="/account-compromised/:token" element={<AccountCompromisedPage />} />
            <Route path="/email-change/confirm-old/:token" element={<ConfirmOldEmailPage />} />
            <Route path="/email-change/confirm-new/:token" element={<ConfirmNewEmailPage />} />
            <Route path="/email-change/cancel/:token" element={<CancelEmailChangePage />} />
            <Route path="*" element={<div className="not-found-page"><h1 className="not-found-page__title">404 - Страница не найдена</h1></div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
