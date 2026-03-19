import { useState } from "react";
import { Plus } from "lucide-react";

import IncomingMailForm from "../components/forms/IncomingMailForm";
import type { IncomingMailFormValues } from "../components/forms/schemas";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import IncomingMailTable from "../components/tables/IncomingMailTable";
import { useInventory } from "../context/InventoryContext";
import { uploadInventoryImage } from "../lib/storage";
import type { IncomingMail } from "../types/inventory";
import { DeleteConfirmationDialog } from "../components/ui/delete-confirmation-dialog";
import { useToast } from "../components/ui/toast";
import { ExportButton } from "../components/ui/export-button";
import { exportToCSV } from "../lib/export";

const IncomingMailPage = () => {
  const { incomingMail, createIncomingMail, updateIncomingMail, deleteIncomingMail } = useInventory();
  const { addToast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedMail, setSelectedMail] = useState<IncomingMail | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mailToDelete, setMailToDelete] = useState<IncomingMail | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedMail(null);
    setDialogMode("create");
  };

  const handleSubmit = async (values: IncomingMailFormValues) => {
    try {
      const { attachmentFile, ...rest } = values;
      let attachmentUrl = dialogMode === "edit" ? selectedMail?.attachmentUrl : undefined;

      if (attachmentFile) {
        const uploadResult = await uploadInventoryImage("mail/incoming", attachmentFile);
        attachmentUrl = uploadResult.url;
      }

      const payload: any = { ...rest };
      if (attachmentUrl !== undefined) {
        payload.attachmentUrl = attachmentUrl;
      }

      if (dialogMode === "edit" && selectedMail) {
        await updateIncomingMail(selectedMail.id, payload);
      } else {
        await createIncomingMail(payload);
      }

      closeDialog();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Gagal menyimpan surat masuk", error);
      alert(`Gagal menyimpan surat masuk. ${message}`);
    }
  };

  const handleCreateClick = () => {
    setDialogMode("create");
    setSelectedMail(null);
  };

  const handleEditMail = (mail: IncomingMail) => {
    setDialogMode("edit");
    setSelectedMail(mail);
    setIsDialogOpen(true);
  };

  const handleDeleteMail = (mail: IncomingMail) => {
    setMailToDelete(mail);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!mailToDelete) return;

    setIsDeleting(true);
    try {
      await deleteIncomingMail(mailToDelete.id);
      addToast({
        type: "success",
        title: "Berhasil",
        description: `Surat masuk "${mailToDelete.subject}" telah dihapus.`,
      });
    } catch (error) {
      console.error("Gagal menghapus surat masuk", error);
      addToast({
        type: "error",
        title: "Gagal",
        description: "Gagal menghapus surat masuk. Silakan coba lagi.",
      });
    } finally {
      setIsDeleting(false);
      setMailToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setMailToDelete(null);
  };

  const handleExportMail = () => {
    const headers = [
      "No. Surat",
      "Tanggal",
      "Pengirim",
      "Alamat Pengirim",
      "Penerima",
      "Perihal",
      "Prioritas",
      "Kategori",
      "Status",
      "Diterima Oleh",
      "Diproses Oleh",
      "Tanggal Diproses",
      "Isi Surat",
      "Catatan"
    ];

    const exportData = incomingMail.map(mail => ({
      "No. Surat": mail.mailNumber,
      "Tanggal": new Date(mail.date).toLocaleDateString("id-ID"),
      "Pengirim": mail.sender,
      "Alamat Pengirim": mail.senderAddress,
      "Penerima": mail.recipient,
      "Perihal": mail.subject,
      "Prioritas": mail.priority,
      "Kategori": mail.category,
      "Status": mail.status,
      "Diterima Oleh": mail.receivedBy,
      "Diproses Oleh": mail.processedBy || "",
      "Tanggal Diproses": mail.processedDate ? new Date(mail.processedDate).toLocaleDateString("id-ID") : "",
      "Isi Surat": mail.content,
      "Catatan": mail.notes || ""
    }));

    exportToCSV(exportData, "data-surat-masuk.csv", headers);
  };

  const defaultValues = selectedMail
    ? {
        mailNumber: selectedMail.mailNumber,
        date: selectedMail.date,
        sender: selectedMail.sender,
        senderAddress: selectedMail.senderAddress,
        recipient: selectedMail.recipient,
        subject: selectedMail.subject,
        content: selectedMail.content,
        priority: selectedMail.priority,
        category: selectedMail.category,
        status: selectedMail.status,
        notes: selectedMail.notes,
        receivedBy: selectedMail.receivedBy,
        processedBy: selectedMail.processedBy,
        processedDate: selectedMail.processedDate,
      }
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Surat Masuk</h2>
          <p className="text-sm text-muted-foreground">Kelola surat masuk yang diterima oleh institusi.</p>
        </div>
        <div className="flex gap-3">
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setSelectedMail(null);
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
                Tambah Surat Masuk
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{dialogMode === "edit" ? "Edit Surat Masuk" : "Tambah Surat Masuk"}</DialogTitle>
              </DialogHeader>
              <IncomingMailForm
                defaultValues={defaultValues}
                onSubmit={handleSubmit}
                submitLabel={dialogMode === "edit" ? "Perbarui Surat" : "Simpan Surat"}
                existingAttachmentUrl={selectedMail?.attachmentUrl}
              />
            </DialogContent>
          </Dialog>
          <ExportButton onExport={handleExportMail} />
        </div>
      </div>
      <IncomingMailTable
        incomingMail={incomingMail}
        onEdit={handleEditMail}
        onDelete={handleDeleteMail}
      />

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Hapus Surat Masuk"
        description="Apakah Anda yakin ingin menghapus surat masuk '{itemName}'? Data yang dihapus tidak dapat dikembalikan."
        itemName={mailToDelete?.subject || ""}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default IncomingMailPage;