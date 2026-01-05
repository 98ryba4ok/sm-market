import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Layout } from "./components/layout/Layout/Layout";
import { HomePage } from "./pages/HomePage/HomePage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="*" element={<div className="not-found-page"><h1 className="not-found-page__title">404 - Страница не найдена</h1></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
