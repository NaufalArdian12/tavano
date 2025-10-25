import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import Auth from "./routes/Auth";
import Topic from "./routes/Topic";
import Step from "./routes/Step";
import Quiz from "./routes/Quiz";
import Dashboard from "./routes/Dashboard";
import RequireAuth from "./components/auth/RequireAuth";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/auth" element={<Auth />} />

        {/* Private (guarded) */}
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
