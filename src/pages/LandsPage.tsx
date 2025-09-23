import { useState } from "react";
import { Plus } from "lucide-react";

import LandForm from "../components/forms/LandForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import LandsTable from "../components/tables/LandsTable";
import { useInventory } from "../context/InventoryContext";

const LandsPage = () => {
  const { lands, createLand } = useInventory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async (values: Parameters<typeof createLand>[0]) => {
    await createLand(values);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Data Tanah</h2>
          <p className="text-sm text-muted-foreground">Catat aset tanah sekolah dengan detail kepemilikan.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Tanah
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Data Tanah</DialogTitle>
            </DialogHeader>
            <LandForm onSubmit={handleSubmit} submitLabel="Simpan Tanah" />
          </DialogContent>
        </Dialog>
      </div>
      <LandsTable lands={lands} />
    </div>
  );
};

export default LandsPage;
