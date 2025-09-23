import { useState } from "react";
import { Plus } from "lucide-react";

import LoanForm from "../components/forms/LoanForm";
import type { LoanFormValues } from "../components/forms/schemas";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import LoansTable from "../components/tables/LoansTable";
import { useInventory } from "../context/InventoryContext";
import { uploadInventoryImage } from "../lib/storage";
import type { Loan } from "../types/inventory";

const LoansPage = () => {
  const { loans, allItems, createLoan, updateLoan, deleteLoan } = useInventory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedLoan(null);
    setDialogMode("create");
  };

  const handleSubmit = async (values: LoanFormValues) => {
    try {
      const { photoFile, ...rest } = values;
      let photoUrl = dialogMode === "edit" ? selectedLoan?.photoUrl : undefined;

      if (photoFile) {
        const uploadResult = await uploadInventoryImage("inventory/loans", photoFile);
        photoUrl = uploadResult.url;
      }

      if (dialogMode === "edit" && selectedLoan) {
        await updateLoan(selectedLoan.id, { ...rest, photoUrl });
      } else {
        await createLoan({ ...rest, photoUrl });
      }

      closeDialog();
    } catch (error) {
      console.error("Gagal menyimpan peminjaman", error);
      alert("Gagal menyimpan peminjaman. Pastikan koneksi dan konfigurasi penyimpanan sudah benar.");
    }
  };

  const handleCreateClick = () => {
    setDialogMode("create");
    setSelectedLoan(null);
  };

  const handleEditLoan = (loan: Loan) => {
    setDialogMode("edit");
    setSelectedLoan(loan);
    setIsDialogOpen(true);
  };

  const handleDeleteLoan = async (loan: Loan) => {
    const confirmed = window.confirm(`Hapus data peminjaman oleh "${loan.borrowerName}"?`);
    if (!confirmed) return;

    try {
      await deleteLoan(loan.id);
    } catch (error) {
      console.error("Gagal menghapus peminjaman", error);
      alert("Gagal menghapus peminjaman. Silakan coba lagi.");
    }
  };

  const handleMarkReturned = async (loan: Loan) => {
    const confirmed = window.confirm(`Tandai barang "${loan.itemName}" sudah dikembalikan oleh "${loan.borrowerName}"?`);
    if (!confirmed) return;

    try {
      await updateLoan(loan.id, { ...loan, status: "dikembalikan" });
    } catch (error) {
      console.error("Gagal menandai pengembalian", error);
      alert("Gagal menandai pengembalian. Silakan coba lagi.");
    }
  };

  const defaultValues = selectedLoan
    ? {
        loanDate: selectedLoan.loanDate,
        returnDate: selectedLoan.returnDate,
        itemId: selectedLoan.itemId,
        itemName: selectedLoan.itemName,
        borrowerName: selectedLoan.borrowerName,
        status: selectedLoan.status,
        notes: selectedLoan.notes ?? "",
      }
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Data Peminjaman</h2>
          <p className="text-sm text-muted-foreground">Pantau pergerakan barang dan jadwal pengembalian.</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setSelectedLoan(null);
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
              Catat Peminjaman
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogMode === "edit" ? "Edit Peminjaman" : "Tambah Peminjaman"}</DialogTitle>
            </DialogHeader>
            <LoanForm
              defaultValues={defaultValues}
              items={allItems.map((item) => ({ id: item.id, name: item.name }))}
              onSubmit={handleSubmit}
              submitLabel={dialogMode === "edit" ? "Perbarui Peminjaman" : "Simpan Peminjaman"}
              existingPhotoUrl={selectedLoan?.photoUrl}
            />
          </DialogContent>
        </Dialog>
      </div>
      <LoansTable loans={loans} onEdit={handleEditLoan} onDelete={handleDeleteLoan} onMarkReturned={handleMarkReturned} />
    </div>
  );
};

export default LoansPage;
