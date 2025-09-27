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
import { DeleteConfirmationDialog } from "../components/ui/delete-confirmation-dialog";
import { useToast } from "../components/ui/toast";
import { ExportButton } from "../components/ui/export-button";
import { exportToCSV, formatCurrencyForExport } from "../lib/export";

const InventoryPage = () => {
  const { items, rooms, allRooms, createItem, updateItem, deleteItem } = useInventory();
  const { addToast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteItem = (item: InventoryItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await deleteItem(itemToDelete.id);
      addToast({
        type: "success",
        title: "Berhasil",
        description: `Barang "${itemToDelete.name}" telah dihapus.`,
      });
    } catch (error) {
      console.error("Gagal menghapus barang", error);
      addToast({
        type: "error",
        title: "Gagal",
        description: "Gagal menghapus barang. Silakan coba lagi.",
      });
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleExportInventory = () => {
    const headers = [
      "Kode Barang",
      "Nama Barang",
      "Merek",
      "Spesifikasi",
      "Jumlah",
      "Harga Total",
      "Sumber",
      "Ruangan",
      "Kondisi"
    ];

    const exportData = items.map(item => ({
      "Kode Barang": item.code,
      "Nama Barang": item.name,
      "Merek": item.brand,
      "Spesifikasi": item.specification,
      "Jumlah": item.quantity,
      "Harga Total": formatCurrencyForExport(item.totalPrice),
      "Sumber": item.source,
      "Ruangan": rooms.find(room => room.id === item.roomId)?.name || "",
      "Kondisi": item.condition
    }));

    exportToCSV(exportData, "data-inventaris.csv", headers);
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Inventaris Barang</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Kelola seluruh aset barang sekolah beserta kondisi terkini.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
                className="w-full sm:w-auto"
                size="lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Barang
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xs sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
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
          <ExportButton onExport={handleExportInventory} className="w-full sm:w-auto" />
        </div>
      </div>
      <InventoryTable items={items} rooms={rooms} onEdit={handleEditItem} onDelete={handleDeleteItem} />

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Hapus Barang"
        description="Apakah Anda yakin ingin menghapus barang '{itemName}'? Data yang dihapus tidak dapat dikembalikan."
        itemName={itemToDelete?.name || ""}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default InventoryPage;
