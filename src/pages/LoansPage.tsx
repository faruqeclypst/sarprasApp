import { useState } from "react";
import { Plus } from "lucide-react";

import LoanForm from "../components/forms/LoanForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import LoansTable from "../components/tables/LoansTable";
import { useInventory } from "../context/InventoryContext";

const LoansPage = () => {
  const { loans, allItems, createLoan } = useInventory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async (values: Parameters<typeof createLoan>[0]) => {
    await createLoan(values);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Data Peminjaman</h2>
          <p className="text-sm text-muted-foreground">Pantau pergerakan barang dan jadwal pengembalian.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Catat Peminjaman
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Peminjaman</DialogTitle>
            </DialogHeader>
            <LoanForm items={allItems.map((item) => ({ id: item.id, name: item.name }))} onSubmit={handleSubmit} submitLabel="Simpan Peminjaman" />
          </DialogContent>
        </Dialog>
      </div>
      <LoansTable loans={loans} />
    </div>
  );
};

export default LoansPage;
