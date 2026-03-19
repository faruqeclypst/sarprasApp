import { useState } from "react";
import { Plus } from "lucide-react";

import LandForm from "../components/forms/LandForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import LandsTable from "../components/tables/LandsTable";
import { useInventory } from "../context/InventoryContext";
import { uploadInventoryImage } from "../lib/storage";
import type { Land } from "../types/inventory";
import type { LandFormValues } from "../components/forms/schemas";
import { DeleteConfirmationDialog } from "../components/ui/delete-confirmation-dialog";
import { useToast } from "../components/ui/toast";
import { ExportButton } from "../components/ui/export-button";
import { ImportButton } from "../components/ui/import-button";
import { downloadLandsImportTemplate, exportLandsToExcel, parseLandsImportExcel } from "../lib/landsExcel";

const LandsPage = () => {
  const { lands, createLand, updateLand, deleteLand } = useInventory();
  const { addToast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedLand, setSelectedLand] = useState<Land | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [landToDelete, setLandToDelete] = useState<Land | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedLand(null);
    setDialogMode("create");
  };

  const handleSubmit = async (values: LandFormValues) => {
    try {
      // Handle photo upload if there's a file
      let photoUrl = selectedLand?.photoUrl; // Keep existing photo URL if editing

      if (values.photoFile) {
        try {
          // Upload new photo and get URL
          const uploadResult = await uploadInventoryImage("lands", values.photoFile);
          photoUrl = uploadResult.url;
        } catch (uploadError) {
          console.error("Error uploading photo:", uploadError);
          addToast({
            type: "error",
            title: "Gagal",
            description: "Gagal mengunggah foto. Silakan coba lagi.",
          });
          return;
        }
      }

      // Prepare the data to save (without the photoFile)
      const dataToSave = {
        locationName: values.locationName,
        locationCode: values.locationCode,
        area: values.area,
        acquisitionYear: values.acquisitionYear,
        address: values.address,
        certificateNumber: values.certificateNumber,
        origin: values.origin,
        description: values.description,
        photoUrl,
      };

      if (dialogMode === "edit" && selectedLand) {
        await updateLand(selectedLand.id, dataToSave);
      } else {
        await createLand(dataToSave);
      }
      closeDialog();
    } catch (error) {
      console.error("Error saving land:", error);
      addToast({
        type: "error",
        title: "Gagal",
        description: "Gagal menyimpan data tanah. Silakan coba lagi.",
      });
    }
  };

  const handleCreateClick = () => {
    setDialogMode("create");
    setSelectedLand(null);
  };

  const handleEditLand = (land: Land) => {
    setDialogMode("edit");
    setSelectedLand(land);
    setIsDialogOpen(true);
  };

  const handleDeleteLand = (land: Land) => {
    setLandToDelete(land);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!landToDelete) return;

    setIsDeleting(true);
    try {
      await deleteLand(landToDelete.id);
      addToast({
        type: "success",
        title: "Berhasil",
        description: `Data tanah "${landToDelete.locationName}" telah dihapus.`,
      });
    } catch (error) {
      console.error("Gagal menghapus tanah", error);
      addToast({
        type: "error",
        title: "Gagal",
        description: "Gagal menghapus tanah. Silakan coba lagi.",
      });
    } finally {
      setIsDeleting(false);
      setLandToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setLandToDelete(null);
  };

  const handleExportLands = () => {
    exportLandsToExcel({ lands, filename: "data-tanah.xlsx" });
  };

  const handleDownloadTemplate = () => {
    downloadLandsImportTemplate();
  };

  const handleImportLands = async (file: File) => {
    setIsImporting(true);
    try {
      const parsed = await parseLandsImportExcel(file);
      if (parsed.length === 0) {
        addToast({ type: "error", title: "Gagal", description: "File kosong atau tidak ada baris data." });
        return;
      }
      for (const row of parsed) {
        await createLand(row);
      }
      addToast({ type: "success", title: "Berhasil", description: `${parsed.length} baris diproses.` });
    } finally {
      setIsImporting(false);
    }
  };

  const defaultValues = selectedLand
    ? {
        locationName: selectedLand.locationName,
        locationCode: selectedLand.locationCode,
        area: selectedLand.area,
        acquisitionYear: selectedLand.acquisitionYear,
        address: selectedLand.address,
        certificateNumber: selectedLand.certificateNumber,
        origin: selectedLand.origin,
        description: selectedLand.description ?? "",
        photoFile: undefined,
      }
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Data Tanah</h2>
          <p className="text-sm text-muted-foreground">Catat aset tanah sekolah dengan detail kepemilikan.</p>
        </div>
        <div className="flex gap-3">
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setSelectedLand(null);
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
                Tambah Tanah
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{dialogMode === "edit" ? "Edit Data Tanah" : "Tambah Data Tanah"}</DialogTitle>
              </DialogHeader>
              <LandForm
                defaultValues={defaultValues}
                onSubmit={handleSubmit}
                submitLabel={dialogMode === "edit" ? "Perbarui Tanah" : "Simpan Tanah"}
                existingPhotoUrl={selectedLand?.photoUrl}
              />
            </DialogContent>
          </Dialog>
          <ImportButton onImport={handleImportLands} isLoading={isImporting} />
          <ExportButton onExport={handleExportLands} />
          <Button onClick={handleDownloadTemplate} variant="outline">
            Download Template
          </Button>
        </div>
      </div>
      <LandsTable lands={lands} onEdit={handleEditLand} onDelete={handleDeleteLand} />

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Hapus Tanah"
        description="Apakah Anda yakin ingin menghapus data tanah '{itemName}'? Data yang dihapus tidak dapat dikembalikan."
        itemName={landToDelete?.locationName || ""}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default LandsPage;
