import { useState } from "react";
import { Plus } from "lucide-react";

import LandForm from "../components/forms/LandForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import LandsTable from "../components/tables/LandsTable";
import { useInventory } from "../context/InventoryContext";
import type { Land } from "../types/inventory";

const LandsPage = () => {
  const { lands, createLand, updateLand, deleteLand } = useInventory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedLand, setSelectedLand] = useState<Land | null>(null);

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedLand(null);
    setDialogMode("create");
  };

  const handleSubmit = async (values: Parameters<typeof createLand>[0]) => {
    if (dialogMode === "edit" && selectedLand) {
      await updateLand(selectedLand.id, values);
    } else {
      await createLand(values);
    }
    closeDialog();
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

  const handleDeleteLand = async (land: Land) => {
    const confirmed = window.confirm(`Hapus data tanah "${land.locationName}"?`);
    if (!confirmed) return;

    try {
      await deleteLand(land.id);
    } catch (error) {
      console.error("Gagal menghapus tanah", error);
      alert("Gagal menghapus tanah. Silakan coba lagi.");
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
        price: selectedLand.price,
        description: selectedLand.description ?? "",
      }
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Data Tanah</h2>
          <p className="text-sm text-muted-foreground">Catat aset tanah sekolah dengan detail kepemilikan.</p>
        </div>
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
            />
          </DialogContent>
        </Dialog>
      </div>
      <LandsTable lands={lands} onEdit={handleEditLand} onDelete={handleDeleteLand} />
    </div>
  );
};

export default LandsPage;
