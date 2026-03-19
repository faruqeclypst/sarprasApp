import { useState } from "react";
import { Plus } from "lucide-react";

import FixedAssetForm from "../components/forms/FixedAssetForm";
import type { FixedAssetFormValues } from "../components/forms/schemas";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import FixedAssetTable from "../components/tables/FixedAssetTable";
import { useInventory } from "../context/InventoryContext";
import { uploadFixedAssetImage } from "../lib/storage";
import type { FixedAsset } from "../types/inventory";
import { DeleteConfirmationDialog } from "../components/ui/delete-confirmation-dialog";
import { useToast } from "../components/ui/toast";
import { ExportButton } from "../components/ui/export-button";
import { ImportButton } from "../components/ui/import-button";
import { downloadFixedAssetImportTemplate, parseFixedAssetImportExcel } from "../lib/fixedAssetExcel";
import { exportFixedAssetToExcel } from "../lib/fixedAssetExcelExport";

const FixedAssetsPage = () => {
  const { fixedAssets, rooms, allRooms, createFixedAsset, updateFixedAsset, deleteFixedAsset } = useInventory();
  const { addToast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedItem, setSelectedItem] = useState<FixedAsset | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<FixedAsset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
    setDialogMode("create");
  };

  const handleSubmit = async (values: FixedAssetFormValues) => {
    try {
      const { photoFile, ...rest } = values;
      let photoUrl = dialogMode === "edit" ? selectedItem?.photoUrl : undefined;

      if (photoFile) {
        const uploadResult = await uploadFixedAssetImage("inventory/fixedAssets", photoFile);
        photoUrl = uploadResult.url;
      }

      const payload: any = { ...rest };
      if (photoUrl !== undefined) {
        payload.photoUrl = photoUrl;
      }

      if (dialogMode === "edit" && selectedItem) {
        await updateFixedAsset(selectedItem.id, payload);
      } else {
        await createFixedAsset(payload);
      }

      closeDialog();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Gagal menyimpan aset tetap", error);
      alert(`Gagal menyimpan aset tetap. ${message}`);
    }
  };

  const handleCreateClick = () => {
    setDialogMode("create");
    setSelectedItem(null);
  };

  const handleEditItem = (item: FixedAsset) => {
    setDialogMode("edit");
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (item: FixedAsset) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await deleteFixedAsset(itemToDelete.id);
      addToast({
        type: "success",
        title: "Berhasil",
        description: `Aset Tetap "${itemToDelete.name}" telah dihapus.`,
      });
    } catch (error) {
      console.error("Gagal menghapus aset tetap", error);
      addToast({
        type: "error",
        title: "Gagal",
        description: "Gagal menghapus aset tetap. Silakan coba lagi.",
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
    exportFixedAssetToExcel({
      fixedAssets,
      rooms,
      filename: "data-aset-tetap.xlsx",
    });
  };

  const handleDownloadTemplate = () => {
    downloadFixedAssetImportTemplate({
      roomNames: allRooms.map((r) => r.name),
    });
  };

  const handleImportInventory = async (file: File) => {
    setIsImporting(true);
    try {
      const parsed = await parseFixedAssetImportExcel(file);
      if (parsed.length === 0) {
        addToast({
          type: "error",
          title: "Gagal",
          description: "File kosong atau tidak ada baris data.",
        });
        return;
      }

      const roomLookup = new Map(allRooms.map((r) => [r.name.trim().toLowerCase(), r.id]));
      const errors: string[] = [];

      for (let i = 0; i < parsed.length; i++) {
        const row = parsed[i];
        const roomId = roomLookup.get(row.roomName.trim().toLowerCase());
        if (!roomId) {
          errors.push(`Baris ${i + 2}: Ruangan "${row.roomName}" tidak ditemukan. Pastikan nama ruangan sama persis.`);
          continue;
        }
        await createFixedAsset({
          code: row.code,
          name: row.name,
          brand: row.brand,
          specification: row.specification,
          quantity: row.quantity,
          acquisitionDate: row.acquisitionDate,
          source: row.source,
          roomId,
          condition: row.condition,
        });
      }

      if (errors.length > 0) {
        throw new Error(errors.slice(0, 20).join("\n"));
      }

      addToast({
        type: "success",
        title: "Berhasil",
        description: `${parsed.length} baris diproses.`,
      });
    } finally {
      setIsImporting(false);
    }
  };

  const defaultValues = selectedItem
    ? {
        code: selectedItem.code,
        name: selectedItem.name,
        brand: selectedItem.brand,
        specification: selectedItem.specification,
        quantity: selectedItem.quantity,
        acquisitionDate: selectedItem.acquisitionDate,
        source: selectedItem.source,
        roomId: selectedItem.roomId,
        condition: selectedItem.condition,
      }
    : undefined;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:gap-4 md:flex-row md:fixedAssets-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Aset Tetap</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Kelola seluruh aset aset tetap sekolah beserta kondisi terkini.</p>
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
                Tambah Aset Tetap
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xs sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{dialogMode === "edit" ? "Edit Aset Tetap" : "Tambah Aset Tetap"}</DialogTitle>
              </DialogHeader>
              <FixedAssetForm
                defaultValues={defaultValues}
                rooms={allRooms.map((room) => ({ id: room.id, name: room.name }))}
                onSubmit={handleSubmit}
                submitLabel={dialogMode === "edit" ? "Perbarui Aset Tetap" : "Simpan Aset Tetap"}
                existingPhotoUrl={selectedItem?.photoUrl}
              />
            </DialogContent>
          </Dialog>
          <ImportButton onImport={handleImportInventory} isLoading={isImporting} className="w-full sm:w-auto" />
          <ExportButton onExport={handleExportInventory} className="w-full sm:w-auto" />
          <Button onClick={handleDownloadTemplate} variant="outline" className="w-full sm:w-auto">
            Download Template
          </Button>
        </div>
      </div>
      <FixedAssetTable items={fixedAssets} rooms={rooms} onEdit={handleEditItem} onDelete={handleDeleteItem} />

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Hapus Aset Tetap"
        description="Apakah Anda yakin ingin menghapus aset tetap '{itemName}'? Data yang dihapus tidak dapat dikembalikan."
        itemName={itemToDelete?.name || ""}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default FixedAssetsPage;
