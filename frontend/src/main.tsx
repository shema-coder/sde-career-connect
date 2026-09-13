import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./index.css";
import App from "./App.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminNews from "./pages/admin/AdminNews.tsx";
import AdminApplications from "./pages/admin/AdminApplications.tsx";
import ArticlePage from "./pages/ArticlePage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/news" element={<AdminNews />} />
        <Route path="/admin/applications" element={<AdminApplications />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
