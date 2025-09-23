import { Menu, Search } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useInventory } from "../../context/InventoryContext";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const TopNavigation = () => {
  const { search, setSearch } = useInventory();
  const { user, signOut, usernameFromEmail } = useAuth();

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

  return (
    <header className="sticky top-0 z-40 flex w-full items-center gap-4 border-b bg-card/60 px-6 py-4 backdrop-blur">
      <Button variant="ghost" size="icon" className="md:hidden">
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
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          Keluar
        </Button>
      </div>
    </header>
  );
};

export default TopNavigation;
