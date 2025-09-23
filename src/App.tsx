import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import InventoryLayout from "./components/layout/InventoryLayout";
import LoadingScreen from "./components/layout/LoadingScreen";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";

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
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
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
  );
};

export default App;
