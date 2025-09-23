import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopNavigation from "./TopNavigation";

interface InventoryLayoutProps {
  children: ReactNode;
}

const InventoryLayout = ({ children }: InventoryLayoutProps) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full bg-muted/30 text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopNavigation />
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex-1 overflow-y-auto p-6"
        >
          {children ?? <Outlet />}
        </motion.main>
      </div>
    </div>
  );
};

export default InventoryLayout;
