import { useState } from "react";
import { Plus } from "lucide-react";

import InventoryItemForm from "../components/forms/InventoryItemForm";
import type { InventoryItemFormValues } from "../components/forms/schemas";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import InventoryTable from "../components/tables/InventoryTable";
import { useInventory } from "../context/InventoryContext";
import { uploadInventoryImage } from "../lib/storage";
import type { InventoryItem } from "../types/inventory";

const InventoryPage = () => {
  const { items, rooms, allRooms, createItem, updateItem, deleteItem } = useInventory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
    setDialogMode("create");
  };

  const handleSubmit = async (values: InventoryItemFormValues) => {
    try {
      const { photoFile, ...rest } = values;
      let photoUrl = dialogMode === "edit" ? selectedItem?.photoUrl : undefined;

      if (photoFile) {
        const uploadResult = await uploadInventoryImage("inventory/items", photoFile);
        photoUrl = uploadResult.url;
      }

      if (dialogMode === "edit" && selectedItem) {
        await updateItem(selectedItem.id, { ...rest, photoUrl });
      } else {
        await createItem({ ...rest, photoUrl });
      }

      closeDialog();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Gagal menyimpan barang", error);
      alert(`Gagal menyimpan barang. ${message}`);
    }
  };

  const handleCreateClick = () => {
    setDialogMode("create");
    setSelectedItem(null);
  };

  const handleEditItem = (item: InventoryItem) => {
    setDialogMode("edit");
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = async (item: InventoryItem) => {
    const confirmed = window.confirm(`Hapus data barang "${item.name}"?`);
    if (!confirmed) return;

    try {
      await deleteItem(item.id);
    } catch (error) {
      console.error("Gagal menghapus barang", error);
      alert("Gagal menghapus barang. Silakan coba lagi.");
    }
  };

  const defaultValues = selectedItem
    ? {
        code: selectedItem.code,
        name: selectedItem.name,
        brand: selectedItem.brand,
        specification: selectedItem.specification,
        quantity: selectedItem.quantity,
        totalPrice: selectedItem.totalPrice,
        source: selectedItem.source,
        roomId: selectedItem.roomId,
        condition: selectedItem.condition,
      }
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Inventaris Barang</h2>
          <p className="text-sm text-muted-foreground">Kelola seluruh aset barang sekolah beserta kondisi terkini.</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setSelectedItem(null);
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
              Tambah Barang
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogMode === "edit" ? "Edit Barang" : "Tambah Barang"}</DialogTitle>
            </DialogHeader>
            <InventoryItemForm
              defaultValues={defaultValues}
              rooms={allRooms.map((room) => ({ id: room.id, name: room.name }))}
              onSubmit={handleSubmit}
              submitLabel={dialogMode === "edit" ? "Perbarui Barang" : "Simpan Barang"}
              existingPhotoUrl={selectedItem?.photoUrl}
            />
          </DialogContent>
        </Dialog>
      </div>
      <InventoryTable items={items} rooms={rooms} onEdit={handleEditItem} onDelete={handleDeleteItem} />
    </div>
  );
};

export default InventoryPage;
