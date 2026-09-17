import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./index.css";
import App from "./App.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminNews from "./pages/admin/AdminNews.tsx";
import AdminApplications from "./pages/admin/AdminApplications.tsx";
import AdminMembers from "./pages/admin/AdminMembers.tsx";
import ArticlePage from "./pages/ArticlePage.tsx";
import OpportunityFinder from "./pages/OpportunityFinder";

import WritingHelp from "./pages/WritingHelp";
import URApplicationSupport from "./pages/URApplicationSupport";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route
            path="/find-opportunities"
            element={<OpportunityFinder />}
          />
          <Route
            path="/writing-help"
            element={<WritingHelp />}
          />
        <Route path="/apply/ur" element={<URApplicationSupport />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/news" element={<AdminNews />} />
        <Route path="/admin/applications" element={<AdminApplications />} />
        <Route path="/admin/members" element={<AdminMembers />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
