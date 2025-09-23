import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import InventoryLayout from "./components/layout/InventoryLayout";
import LoadingScreen from "./components/layout/LoadingScreen";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const InventoryPage = lazy(() => import("./pages/InventoryPage"));
const RoomsPage = lazy(() => import("./pages/RoomsPage"));
const LandsPage = lazy(() => import("./pages/LandsPage"));
const LoansPage = lazy(() => import("./pages/LoansPage"));

const App = () => {
  return (
    <InventoryLayout>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="/inventaris" element={<InventoryPage />} />
          <Route path="/ruangan" element={<RoomsPage />} />
          <Route path="/tanah" element={<LandsPage />} />
          <Route path="/peminjaman" element={<LoansPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </InventoryLayout>
  );
};

export default App;
