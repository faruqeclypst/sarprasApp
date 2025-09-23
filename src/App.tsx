import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import InventoryLayout from "./components/layout/InventoryLayout";
import LoadingScreen from "./components/layout/LoadingScreen";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import { ToastProvider } from "./components/ui/toast";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const InventoryPage = lazy(() => import("./pages/InventoryPage"));
const RoomsPage = lazy(() => import("./pages/RoomsPage"));
const LandsPage = lazy(() => import("./pages/LandsPage"));
const LoansPage = lazy(() => import("./pages/LoansPage"));

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ToastProvider>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
          <Route path="/change-password" element={user ? <ChangePasswordPage /> : <Navigate to="/login" replace />} />
          <Route
            element={user ? <InventoryLayout /> : <Navigate to="/login" replace />}
          >
            <Route index element={<DashboardPage />} />
            <Route path="/inventaris" element={<InventoryPage />} />
            <Route path="/ruangan" element={<RoomsPage />} />
            <Route path="/tanah" element={<LandsPage />} />
            <Route path="/peminjaman" element={<LoansPage />} />
          </Route>
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
        </Routes>
      </Suspense>
    </ToastProvider>
  );
};

export default App;
