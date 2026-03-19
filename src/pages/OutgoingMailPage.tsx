import { useState } from "react";
import { Plus } from "lucide-react";

import OutgoingMailForm from "../components/forms/OutgoingMailForm";
import type { OutgoingMailFormValues } from "../components/forms/schemas";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import OutgoingMailTable from "../components/tables/OutgoingMailTable";
import { useInventory } from "../context/InventoryContext";
import { uploadInventoryImage } from "../lib/storage";
import type { OutgoingMail } from "../types/inventory";
import { DeleteConfirmationDialog } from "../components/ui/delete-confirmation-dialog";
import { useToast } from "../components/ui/toast";
import { ExportButton } from "../components/ui/export-button";
import { exportToCSV } from "../lib/export";

const OutgoingMailPage = () => {
  const { outgoingMail, createOutgoingMail, updateOutgoingMail, deleteOutgoingMail } = useInventory();
  const { addToast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedMail, setSelectedMail] = useState<OutgoingMail | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mailToDelete, setMailToDelete] = useState<OutgoingMail | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedMail(null);
    setDialogMode("create");
  };

  const handleSubmit = async (values: OutgoingMailFormValues) => {
    try {
      const { attachmentFile, ...rest } = values;
      let attachmentUrl = dialogMode === "edit" ? selectedMail?.attachmentUrl : undefined;

      if (attachmentFile) {
        const uploadResult = await uploadInventoryImage("mail/outgoing", attachmentFile);
        attachmentUrl = uploadResult.url;
      }

      const payload: any = { ...rest };
      if (attachmentUrl !== undefined) {
        payload.attachmentUrl = attachmentUrl;
      }

      if (dialogMode === "edit" && selectedMail) {
        await updateOutgoingMail(selectedMail.id, payload);
      } else {
        await createOutgoingMail(payload);
      }

      closeDialog();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Gagal menyimpan surat keluar", error);
      alert(`Gagal menyimpan surat keluar. ${message}`);
    }
  };

  const handleCreateClick = () => {
    setDialogMode("create");
    setSelectedMail(null);
  };

  const handleEditMail = (mail: OutgoingMail) => {
    setDialogMode("edit");
    setSelectedMail(mail);
    setIsDialogOpen(true);
  };

  const handleDeleteMail = (mail: OutgoingMail) => {
    setMailToDelete(mail);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!mailToDelete) return;

    setIsDeleting(true);
    try {
      await deleteOutgoingMail(mailToDelete.id);
      addToast({
        type: "success",
        title: "Berhasil",
        description: `Surat keluar "${mailToDelete.subject}" telah dihapus.`,
      });
    } catch (error) {
      console.error("Gagal menghapus surat keluar", error);
      addToast({
        type: "error",
        title: "Gagal",
        description: "Gagal menghapus surat keluar. Silakan coba lagi.",
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
      "Penerima",
      "Alamat Penerima",
      "Perihal",
      "Prioritas",
      "Kategori",
      "Status",
      "Metode Pengiriman",
      "Dibuat Oleh",
      "Tanggal Dikirim",
      "Isi Surat",
      "Catatan"
    ];

    const exportData = outgoingMail.map(mail => ({
      "No. Surat": mail.mailNumber,
      "Tanggal": new Date(mail.date).toLocaleDateString("id-ID"),
      "Pengirim": mail.sender,
      "Penerima": mail.recipient,
      "Alamat Penerima": mail.recipientAddress,
      "Perihal": mail.subject,
      "Prioritas": mail.priority,
      "Kategori": mail.category,
      "Status": mail.status,
      "Metode Pengiriman": mail.deliveryMethod,
      "Dibuat Oleh": mail.createdBy,
      "Tanggal Dikirim": mail.sentDate ? new Date(mail.sentDate).toLocaleDateString("id-ID") : "",
      "Isi Surat": mail.content,
      "Catatan": mail.notes || ""
    }));

    exportToCSV(exportData, "data-surat-keluar.csv", headers);
  };

  const defaultValues = selectedMail
    ? {
        mailNumber: selectedMail.mailNumber,
        date: selectedMail.date,
        sender: selectedMail.sender,
        recipient: selectedMail.recipient,
        recipientAddress: selectedMail.recipientAddress,
        subject: selectedMail.subject,
        content: selectedMail.content,
        priority: selectedMail.priority,
        category: selectedMail.category,
        status: selectedMail.status,
        deliveryMethod: selectedMail.deliveryMethod,
        notes: selectedMail.notes,
        createdBy: selectedMail.createdBy,
        sentDate: selectedMail.sentDate,
      }
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Surat Keluar</h2>
          <p className="text-sm text-muted-foreground">Kelola surat keluar yang dikirim oleh institusi.</p>
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
                Tambah Surat Keluar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{dialogMode === "edit" ? "Edit Surat Keluar" : "Tambah Surat Keluar"}</DialogTitle>
              </DialogHeader>
              <OutgoingMailForm
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
      <OutgoingMailTable
        outgoingMail={outgoingMail}
        onEdit={handleEditMail}
        onDelete={handleDeleteMail}
      />

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Hapus Surat Keluar"
        description="Apakah Anda yakin ingin menghapus surat keluar '{itemName}'? Data yang dihapus tidak dapat dikembalikan."
        itemName={mailToDelete?.subject || ""}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default OutgoingMailPage;