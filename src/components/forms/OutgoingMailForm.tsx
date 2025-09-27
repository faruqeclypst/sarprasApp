import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";
import FileDropInput from "./FileDropInput";
import FormField from "./FormField";
import { OutgoingMailFormValues, outgoingMailSchema } from "./schemas";

interface OutgoingMailFormProps {
  defaultValues?: Partial<OutgoingMailFormValues>;
  onSubmit: (values: OutgoingMailFormValues) => Promise<void>;
  submitLabel?: string;
  existingAttachmentUrl?: string;
}

const OutgoingMailForm = ({ defaultValues, onSubmit, submitLabel, existingAttachmentUrl }: OutgoingMailFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<OutgoingMailFormValues>({
    resolver: zodResolver(outgoingMailSchema),
    defaultValues: {
      mailNumber: "",
      date: new Date().toISOString().split("T")[0],
      sender: "",
      recipient: "",
      recipientAddress: "",
      subject: "",
      content: "",
      priority: "normal",
      category: "pemberitahuan",
      status: "draft",
      deliveryMethod: "pos",
      notes: "",
      createdBy: "",
      sentDate: "",
      attachmentFile: undefined,
      ...defaultValues,
    },
  });

  const status = watch("status");

  useEffect(() => {
    reset((prev) => ({ ...prev, ...defaultValues, attachmentFile: undefined }));
  }, [defaultValues, reset]);

  const submitHandler = async (values: OutgoingMailFormValues) => {
    await onSubmit(values);
    if (!defaultValues || Object.keys(defaultValues).length === 0) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      {/* Basic Information Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Informasi Dasar</h4>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField id="mailNumber" label="Nomor Surat" error={errors.mailNumber}>
            <Input id="mailNumber" {...register("mailNumber")} />
          </FormField>
          <FormField id="date" label="Tanggal" error={errors.date}>
            <Input id="date" type="date" {...register("date")} />
          </FormField>
          <FormField id="subject" label="Perihal" error={errors.subject}>
            <Input id="subject" {...register("subject")} />
          </FormField>
        </div>
      </div>

      {/* Sender & Recipient Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Pengirim & Penerima</h4>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField id="sender" label="Pengirim" error={errors.sender}>
            <Input id="sender" {...register("sender")} />
          </FormField>
          <FormField id="recipient" label="Penerima" error={errors.recipient}>
            <Input id="recipient" {...register("recipient")} />
          </FormField>
          <FormField id="recipientAddress" label="Alamat Penerima" error={errors.recipientAddress}>
            <Textarea id="recipientAddress" rows={2} {...register("recipientAddress")} className="resize-none" />
          </FormField>
        </div>
      </div>

      {/* Processing Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Pemrosesan & Pengiriman</h4>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField id="createdBy" label="Dibuat Oleh" error={errors.createdBy}>
            <Input id="createdBy" {...register("createdBy")} />
          </FormField>
          <FormField id="priority" label="Prioritas" error={errors.priority}>
            <Select id="priority" {...register("priority")}>
              <option value="rendah">Rendah</option>
              <option value="normal">Normal</option>
              <option value="tinggi">Tinggi</option>
              <option value="urgent">Urgent</option>
            </Select>
          </FormField>
          <FormField id="category" label="Kategori" error={errors.category}>
            <Select id="category" {...register("category")}>
              <option value="undangan">Undangan</option>
              <option value="pemberitahuan">Pemberitahuan</option>
              <option value="permohonan">Permohonan</option>
              <option value="laporan">Laporan</option>
              <option value="lainnya">Lainnya</option>
            </Select>
          </FormField>
          <FormField id="deliveryMethod" label="Metode Pengiriman" error={errors.deliveryMethod}>
            <Select id="deliveryMethod" {...register("deliveryMethod")}>
              <option value="pos">Pos</option>
              <option value="kurir">Kurir</option>
              <option value="email">Email</option>
              <option value="fax">Fax</option>
              <option value="langsung">Langsung</option>
            </Select>
          </FormField>
          <FormField id="status" label="Status" error={errors.status}>
            <Select id="status" {...register("status")}>
              <option value="draft">Draft</option>
              <option value="terkirim">Terkirim</option>
              <option value="diterima">Diterima</option>
              <option value="ditolak">Ditolak</option>
            </Select>
          </FormField>
          {(status === "terkirim" || status === "diterima" || status === "ditolak") && (
            <FormField id="sentDate" label="Tanggal Dikirim" error={errors.sentDate}>
              <Input id="sentDate" type="date" {...register("sentDate")} />
            </FormField>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Konten</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField id="content" label="Isi Surat" error={errors.content}>
              <Textarea id="content" rows={4} {...register("content")} className="resize-none" />
            </FormField>
          </div>
          <div className="sm:col-span-2">
            <FormField id="notes" label="Catatan" error={errors.notes}>
              <Textarea id="notes" rows={2} {...register("notes")} className="resize-none" />
            </FormField>
          </div>
          <div className="sm:col-span-2">
            <FormField
              id="attachmentFile"
              label="Lampiran"
              error={errors.attachmentFile}
              description="Format JPG, PNG, PDF, atau dokumen lainnya"
            >
              <Controller
                control={control}
                name="attachmentFile"
                render={({ field }) => (
                  <FileDropInput
                    id="attachmentFile"
                    value={field.value}
                    onChange={field.onChange}
                    existingUrl={existingAttachmentUrl}
                  />
                )}
              />
            </FormField>
          </div>
        </div>
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-colors"
      >
        {isSubmitting ? "Menyimpan..." : submitLabel ?? "Simpan"}
      </Button>
    </form>
  );
};

export default OutgoingMailForm;