// src/main.tsx
import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import RequireAuth from "./components/auth/RequireAuth";
import SessionBootstrap from "./components/auth/SessionBootstrap";

const Login = lazy(() => import("./routes/Login"));
const Register = lazy(() => import("./routes/Register"));
const Topic = lazy(() => import("./routes/Topic"));
const Step = lazy(() => import("./routes/Step"));
const Quiz = lazy(() => import("./routes/Quiz"));
const Dashboard = lazy(() => import("./routes/Dashboard"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SessionBootstrap>
        <Suspense fallback={<div className="p-6">Loading…</div>}>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Private */}
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Navigate to="/topic/pecahan-dasar" replace />
                </RequireAuth>
              }
            />
            <Route
              path="/topic/:slug"
              element={
                <RequireAuth>
                  <Topic />
                </RequireAuth>
              }
            />
            <Route
              path="/topic/:slug/step/:n"
              element={
                <RequireAuth>
                  <Step />
                </RequireAuth>
              }
            />
            <Route
              path="/quiz/:id"
              element={
                <RequireAuth>
                  <Quiz />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </SessionBootstrap>
    </BrowserRouter>
  </StrictMode>
);
