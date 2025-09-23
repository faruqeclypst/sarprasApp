import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopNavigation from "./TopNavigation";

interface InventoryLayoutProps {
  children?: ReactNode;
}

const InventoryLayout = ({ children }: InventoryLayoutProps) => {
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-muted/30 text-foreground overflow-hidden">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onClose={closeMobileSidebar}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <TopNavigation onMenuClick={toggleMobileSidebar} />
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex-1 overflow-y-auto overflow-x-hidden p-6"
        >
          <div className="w-full overflow-hidden">
            {children ?? <Outlet />}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default InventoryLayout;
