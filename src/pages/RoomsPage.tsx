import { useState } from "react";
import { Plus } from "lucide-react";

import RoomForm from "../components/forms/RoomForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import RoomsTable from "../components/tables/RoomsTable";
import { useInventory } from "../context/InventoryContext";

const RoomsPage = () => {
  const { rooms, createRoom } = useInventory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async (values: Parameters<typeof createRoom>[0]) => {
    await createRoom(values);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Data Ruangan</h2>
          <p className="text-sm text-muted-foreground">Kelola informasi kondisi dan dokumentasi ruang.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Ruang
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Ruang</DialogTitle>
            </DialogHeader>
            <RoomForm onSubmit={handleSubmit} submitLabel="Simpan Ruang" />
          </DialogContent>
        </Dialog>
      </div>
      <RoomsTable rooms={rooms} />
    </div>
  );
};

export default RoomsPage;
