import { LogOut, Menu, Search, User, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useInventory } from "../../context/InventoryContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface TopNavigationProps {
  onMenuClick?: () => void;
}

const TopNavigation = ({ onMenuClick }: TopNavigationProps) => {
  const { search, setSearch } = useInventory();
  const { user, signOut, usernameFromEmail } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = user?.displayName?.trim() || usernameFromEmail(user?.email) || "Pengguna";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2) || "PG";

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Gagal keluar", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 flex w-full items-center gap-4 border-b bg-card/60 px-6 py-4 backdrop-blur">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari barang, ruang, atau peminjam..."
          className="pl-9"
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right md:flex md:flex-col">
          <span className="text-sm font-medium text-foreground">{displayName}</span>
          <span className="text-xs text-muted-foreground">{user?.email ?? ""}</span>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full p-0 hover:bg-transparent"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.photoURL || undefined} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 z-50">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{displayName}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user?.email ?? ""}
                  </p>
                </div>
              </div>
              <div className="my-1 h-px bg-muted" />
              <div
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Link
                  to="/profile"
                  className="flex items-center cursor-pointer w-full"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil & Nama</span>
                </Link>
              </div>
              <div
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Link
                  to="/change-password"
                  className="flex items-center cursor-pointer w-full"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Ubah Password</span>
                </Link>
              </div>
              <div className="my-1 h-px bg-muted" />
              <div
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground cursor-pointer text-red-600 focus:text-red-600"
                onClick={() => {
                  setIsDropdownOpen(false);
                  handleSignOut();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
