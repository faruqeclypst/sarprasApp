import { useState } from "react";
import { Plus } from "lucide-react";

import InventoryItemForm from "../components/forms/InventoryItemForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import InventoryTable from "../components/tables/InventoryTable";
import { useInventory } from "../context/InventoryContext";

const InventoryPage = () => {
  const { items, rooms, allRooms, createItem } = useInventory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async (values: Parameters<typeof createItem>[0]) => {
    await createItem(values);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Inventaris Barang</h2>
          <p className="text-sm text-muted-foreground">Kelola seluruh aset barang sekolah beserta kondisi terkini.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Barang
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Barang</DialogTitle>
            </DialogHeader>
            <InventoryItemForm rooms={allRooms.map((room) => ({ id: room.id, name: room.name }))} onSubmit={handleSubmit} submitLabel="Simpan Barang" />
          </DialogContent>
        </Dialog>
      </div>
      <InventoryTable items={items} rooms={rooms} />
    </div>
  );
};

export default InventoryPage;
