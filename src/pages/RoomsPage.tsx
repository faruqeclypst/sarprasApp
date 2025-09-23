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
import { DeleteConfirmationDialog } from "../components/ui/delete-confirmation-dialog";
import { useToast } from "../components/ui/toast";
import { ExportButton } from "../components/ui/export-button";
import { exportToCSV, formatCurrencyForExport } from "../lib/export";

const RoomsPage = () => {
  const { rooms, createRoom, updateRoom, deleteRoom } = useInventory();
  const { addToast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
        addToast({
          type: "success",
          title: "Berhasil",
          description: "Ruangan berhasil diperbarui!",
        });
      } else {
        await createRoom({ ...rest, photoUrl });
        addToast({
          type: "success",
          title: "Berhasil",
          description: "Ruangan berhasil ditambahkan!",
        });
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

  const handleDeleteRoom = (room: Room) => {
    setRoomToDelete(room);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!roomToDelete) return;

    setIsDeleting(true);
    try {
      await deleteRoom(roomToDelete.id);
      addToast({
        type: "success",
        title: "Berhasil",
        description: `Ruangan "${roomToDelete.name}" telah dihapus.`,
      });
    } catch (error) {
      console.error("Gagal menghapus ruangan", error);
      addToast({
        type: "error",
        title: "Gagal",
        description: "Gagal menghapus ruangan. Silakan coba lagi.",
      });
    } finally {
      setIsDeleting(false);
      setRoomToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRoomToDelete(null);
  };

  const handleExportRooms = () => {
    const headers = [
      "Nama Ruangan",
      "Kode Gedung",
      "Kondisi",
      "Kapasitas",
      "Jenis Ruangan",
      "Lantai",
      "Catatan"
    ];

    const exportData = rooms.map(room => ({
      "Nama Ruangan": room.name,
      "Kode Gedung": room.buildingCode,
      "Kondisi": room.condition,
      "Kapasitas": room.capacity,
      "Jenis Ruangan": room.roomType,
      "Lantai": room.floor,
      "Catatan": room.notes || ""
    }));

    exportToCSV(exportData, "data-ruangan.csv", headers);
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
        <div className="flex gap-3">
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
          <ExportButton onExport={handleExportRooms} />
        </div>
      </div>
      <RoomsTable rooms={rooms} onEdit={handleEditRoom} onDelete={handleDeleteRoom} />

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Hapus Ruangan"
        description="Apakah Anda yakin ingin menghapus ruangan '{itemName}'? Data yang dihapus tidak dapat dikembalikan."
        itemName={roomToDelete?.name || ""}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default RoomsPage;
