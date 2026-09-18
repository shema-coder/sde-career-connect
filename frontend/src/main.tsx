import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./index.css";
import App from "./App.tsx";

const ArticlePage = lazy(() => import("./pages/ArticlePage.tsx"));
const OpportunityFinder = lazy(() => import("./pages/OpportunityFinder.tsx"));
const WritingHelp = lazy(() => import("./pages/WritingHelp.tsx"));
const URApplicationSupport = lazy(
  () => import("./pages/URApplicationSupport.tsx"),
);

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.tsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const AdminNews = lazy(() => import("./pages/admin/AdminNews.tsx"));
const AdminApplications = lazy(
  () => import("./pages/admin/AdminApplications.tsx"),
);
const AdminMembers = lazy(() => import("./pages/admin/AdminMembers.tsx"));

function PageLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#ffffff",
      }}
      aria-label="Loading page"
    >
      <div
        style={{
          width: 42,
          height: 42,
          border: "4px solid rgba(10, 35, 66, 0.15)",
          borderTopColor: "#0a2342",
          borderRadius: "50%",
          animation: "sde-page-spin 0.8s linear infinite",
        }}
      />
      <style>
        {`
          @keyframes sde-page-spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        <Route
          path="/articles/:slug"
          element={
            <LazyPage>
              <ArticlePage />
            </LazyPage>
          }
        />

        <Route
          path="/find-opportunities"
          element={
            <LazyPage>
              <OpportunityFinder />
            </LazyPage>
          }
        />

        <Route
          path="/writing-help"
          element={
            <LazyPage>
              <WritingHelp />
            </LazyPage>
          }
        />

        <Route
          path="/apply/ur"
          element={
            <LazyPage>
              <URApplicationSupport />
            </LazyPage>
          }
        />

        <Route
          path="/admin"
          element={
            <LazyPage>
              <AdminLogin />
            </LazyPage>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <LazyPage>
              <AdminDashboard />
            </LazyPage>
          }
        />

        <Route
          path="/admin/news"
          element={
            <LazyPage>
              <AdminNews />
            </LazyPage>
          }
        />

        <Route
          path="/admin/applications"
          element={
            <LazyPage>
              <AdminApplications />
            </LazyPage>
          }
        />

        <Route
          path="/admin/members"
          element={
            <LazyPage>
              <AdminMembers />
            </LazyPage>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
