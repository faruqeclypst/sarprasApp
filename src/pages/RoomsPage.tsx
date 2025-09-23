import { useState } from "react";
import { Plus } from "lucide-react";

import RoomForm from "../components/forms/RoomForm";
import type { RoomFormValues } from "../components/forms/schemas";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import RoomsTable from "../components/tables/RoomsTable";
import { useInventory } from "../context/InventoryContext";
import { uploadInventoryImage } from "../lib/storage";
import type { Room } from "../types/inventory";

const RoomsPage = () => {
  const { rooms, createRoom, updateRoom, deleteRoom } = useInventory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedRoom(null);
    setDialogMode("create");
  };

  const handleSubmit = async (values: RoomFormValues) => {
    try {
      const { photoFile, ...rest } = values;
      let photoUrl = dialogMode === "edit" ? selectedRoom?.photoUrl : undefined;

      if (photoFile) {
        const uploadResult = await uploadInventoryImage("inventory/rooms", photoFile);
        photoUrl = uploadResult.url;
      }

      if (dialogMode === "edit" && selectedRoom) {
        await updateRoom(selectedRoom.id, { ...rest, photoUrl });
        alert("Ruangan berhasil diperbarui!");
      } else {
        await createRoom({ ...rest, photoUrl });
        alert("Ruangan berhasil ditambahkan!");
      }

      closeDialog();
    } catch (error) {
      console.error("Gagal menyimpan ruangan", error);
      alert("Gagal menyimpan ruangan. Pastikan koneksi dan konfigurasi penyimpanan sudah benar.");
    }
  };

  const handleCreateClick = () => {
    setDialogMode("create");
    setSelectedRoom(null);
  };

  const handleEditRoom = (room: Room) => {
    setDialogMode("edit");
    setSelectedRoom(room);
    setIsDialogOpen(true);
  };

  const handleDeleteRoom = async (room: Room) => {
    const confirmed = window.confirm(`Hapus data ruang "${room.name}"?\n\nData yang dihapus tidak dapat dikembalikan.`);
    if (!confirmed) return;

    try {
      await deleteRoom(room.id);
      alert("Ruangan berhasil dihapus!");
    } catch (error) {
      console.error("Gagal menghapus ruangan", error);
      alert("Gagal menghapus ruangan. Silakan coba lagi.");
    }
  };

  const defaultValues = selectedRoom
    ? {
        name: selectedRoom.name,
        buildingCode: selectedRoom.buildingCode,
        condition: selectedRoom.condition,
        notes: selectedRoom.notes ?? "",
        capacity: selectedRoom.capacity,
        roomType: selectedRoom.roomType,
        floor: selectedRoom.floor,
      }
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Data Ruangan</h2>
          <p className="text-sm text-muted-foreground">Kelola informasi kondisi dan dokumentasi ruang.</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setSelectedRoom(null);
              setDialogMode("create");
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                handleCreateClick();
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Ruang
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogMode === "edit" ? "Edit Ruang" : "Tambah Ruang"}</DialogTitle>
            </DialogHeader>
            <RoomForm
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              submitLabel={dialogMode === "edit" ? "Perbarui Ruang" : "Simpan Ruang"}
              existingPhotoUrl={selectedRoom?.photoUrl}
            />
          </DialogContent>
        </Dialog>
      </div>
      <RoomsTable rooms={rooms} onEdit={handleEditRoom} onDelete={handleDeleteRoom} />
    </div>
  );
};

export default RoomsPage;
