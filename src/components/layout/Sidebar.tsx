import { NavLink } from "react-router-dom";
import { Building2, ClipboardList, Home, Layers, MapPin, X, Lock, Mail, MailOpen } from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Logo from "./logo";
import AppGuide from "../guide/AppGuide";
import { useAuth } from "../../context/AuthContext";

const navigation = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/inventaris", label: "Barang", icon: ClipboardList },
  { to: "/ruangan", label: "Ruang", icon: Building2 },
  { to: "/tanah", label: "Tanah", icon: MapPin },
  { to: "/peminjaman", label: "Peminjaman", icon: Layers },
  { to: "/surat-masuk", label: "Surat Masuk", icon: Mail },
  { to: "/surat-keluar", label: "Surat Keluar", icon: MailOpen },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isMobileOpen = false, onClose }: SidebarProps) => {
  const [showGuide, setShowGuide] = React.useState(false);
  const { user, usernameFromEmail } = useAuth();

  const displayName = user?.displayName?.trim() || usernameFromEmail(user?.email) || "Pengguna";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2) || "PG";

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 flex h-screen w-80 flex-col border-r bg-card/80 p-6 shadow-lg backdrop-blur-sm transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 md:hidden"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="mb-8">
          <Logo />
        </div>

        {/* Profile Section */}
        {/* <div className="mb-8 flex items-center gap-3 rounded-xl bg-muted/30 p-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.photoURL || undefined} alt={displayName} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email ?? ""}</p>
          </div>
        </div> */}

        <nav className="flex flex-1 flex-col gap-1">
          <div className="mb-4">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Menu Utama
            </h3>
          </div>
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-4 rounded-xl px-4 py-4 text-sm font-medium transition-all duration-200 ease-in-out",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md transform scale-[1.02]"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:shadow-sm hover:transform hover:scale-[1.01]"
                )
              }
              end
            >
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                "group-hover:bg-background/50",
                "bg-muted/30"
              )}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="flex-1">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t border-border/50 space-y-3">
          <NavLink
            to="/change-password"
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md transform scale-[1.02]"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:shadow-sm hover:transform hover:scale-[1.01]"
              )
            }
          >
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
              "group-hover:bg-background/50",
              "bg-muted/30"
            )}>
              <Lock className="h-5 w-5" />
            </div>
            <span className="flex-1">Ubah Password</span>
          </NavLink>

          <Button
            variant="outline"
            className="w-full h-12 text-sm font-medium hover:bg-muted/80 transition-colors"
            onClick={() => setShowGuide(true)}
          >
            Panduan Aplikasi
          </Button>
        </div>
      </aside>

      <AppGuide
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </>
  );
};

export default Sidebar;
