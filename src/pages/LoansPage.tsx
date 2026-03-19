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
import { DeleteConfirmationDialog } from "../components/ui/delete-confirmation-dialog";
import { useToast } from "../components/ui/toast";
import { ExportButton } from "../components/ui/export-button";
import { exportToCSV, formatCurrencyForExport, formatDateForExport } from "../lib/export";

const LoansPage = () => {
  const { loans, allItems, createLoan, updateLoan, deleteLoan } = useInventory();
  const { addToast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState<Loan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

      const payload: any = { ...rest };
      if (photoUrl !== undefined) {
        payload.photoUrl = photoUrl;
      }

      if (dialogMode === "edit" && selectedLoan) {
        await updateLoan(selectedLoan.id, payload);
      } else {
        await createLoan(payload);
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

  const handleDeleteLoan = (loan: Loan) => {
    setLoanToDelete(loan);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!loanToDelete) return;

    setIsDeleting(true);
    try {
      await deleteLoan(loanToDelete.id);
      addToast({
        type: "success",
        title: "Berhasil",
        description: `Data peminjaman oleh "${loanToDelete.borrowerName}" telah dihapus.`,
      });
    } catch (error) {
      console.error("Gagal menghapus peminjaman", error);
      addToast({
        type: "error",
        title: "Gagal",
        description: "Gagal menghapus peminjaman. Silakan coba lagi.",
      });
    } finally {
      setIsDeleting(false);
      setLoanToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setLoanToDelete(null);
  };

  const handleExportLoans = () => {
    const headers = [
      "Tanggal Pinjam",
      "Tanggal Kembali",
      "Nama Barang",
      "Nama Peminjam",
      "Status",
      "Catatan"
    ];

    const exportData = loans.map(loan => ({
      "Tanggal Pinjam": formatDateForExport(loan.loanDate),
      "Tanggal Kembali": formatDateForExport(loan.returnDate),
      "Nama Barang": loan.itemName,
      "Nama Peminjam": loan.borrowerName,
      "Status": loan.status,
      "Catatan": loan.notes || ""
    }));

    exportToCSV(exportData, "data-peminjaman.csv", headers);
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
        <div className="flex gap-3">
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
          <ExportButton onExport={handleExportLoans} />
        </div>
      </div>
      <LoansTable loans={loans} onEdit={handleEditLoan} onDelete={handleDeleteLoan} onMarkReturned={handleMarkReturned} />

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Hapus Peminjaman"
        description="Apakah Anda yakin ingin menghapus data peminjaman oleh '{itemName}'? Data yang dihapus tidak dapat dikembalikan."
        itemName={loanToDelete?.borrowerName || ""}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default LoansPage;
