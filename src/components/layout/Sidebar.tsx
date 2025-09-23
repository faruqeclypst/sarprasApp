import { NavLink } from "react-router-dom";
import { Building2, ClipboardList, Home, Layers, MapPin } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import Logo from "./logo";

const navigation = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/inventaris", label: "Barang", icon: ClipboardList },
  { to: "/ruangan", label: "Ruang", icon: Building2 },
  { to: "/tanah", label: "Tanah", icon: MapPin },
  { to: "/peminjaman", label: "Peminjaman", icon: Layers },
];

const Sidebar = () => {
  return (
    <aside className="hidden w-72 flex-col border-r bg-card/60 p-6 shadow-sm md:flex">
      <Logo />
      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition", 
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
            end
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <Button variant="outline" className="mt-auto w-full">Panduan Aplikasi</Button>
    </aside>
  );
};

export default Sidebar;
