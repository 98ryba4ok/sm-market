import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import { Layout } from "./components/layout/Layout/Layout";
import { ToastProvider } from "./contexts/ToastContext";
import { CartPage } from "./pages/CartPage/CartPage";
import { HomePage } from "./pages/HomePage/HomePage";
import { ProductDetailPage } from "./pages/ProductDetailPage/ProductDetailPage";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="*" element={<div className="not-found-page"><h1 className="not-found-page__title">404 - Страница не найдена</h1></div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
