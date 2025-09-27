import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";
import FileDropInput from "./FileDropInput";
import FormField from "./FormField";
import { IncomingMailFormValues, incomingMailSchema } from "./schemas";

interface IncomingMailFormProps {
  defaultValues?: Partial<IncomingMailFormValues>;
  onSubmit: (values: IncomingMailFormValues) => Promise<void>;
  submitLabel?: string;
  existingAttachmentUrl?: string;
}

const IncomingMailForm = ({ defaultValues, onSubmit, submitLabel, existingAttachmentUrl }: IncomingMailFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<IncomingMailFormValues>({
    resolver: zodResolver(incomingMailSchema),
    defaultValues: {
      mailNumber: "",
      date: new Date().toISOString().split("T")[0],
      sender: "",
      senderAddress: "",
      recipient: "",
      subject: "",
      content: "",
      priority: "normal",
      category: "pemberitahuan",
      status: "belum_dibaca",
      notes: "",
      receivedBy: "",
      processedBy: "",
      processedDate: "",
      attachmentFile: undefined,
      ...defaultValues,
    },
  });

  const status = watch("status");

  useEffect(() => {
    reset((prev) => ({ ...prev, ...defaultValues, attachmentFile: undefined }));
  }, [defaultValues, reset]);

  const submitHandler = async (values: IncomingMailFormValues) => {
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
          <FormField id="senderAddress" label="Alamat Pengirim" error={errors.senderAddress}>
            <Textarea id="senderAddress" rows={2} {...register("senderAddress")} className="resize-none" />
          </FormField>
        </div>
      </div>

      {/* Processing Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Pemrosesan</h4>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField id="receivedBy" label="Diterima Oleh" error={errors.receivedBy}>
            <Input id="receivedBy" {...register("receivedBy")} />
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
          <FormField id="status" label="Status" error={errors.status}>
            <Select id="status" {...register("status")}>
              <option value="belum_dibaca">Belum Dibaca</option>
              <option value="sudah_dibaca">Sudah Dibaca</option>
              <option value="ditindaklanjuti">Ditindaklanjuti</option>
              <option value="selesai">Selesai</option>
            </Select>
          </FormField>
          {(status === "ditindaklanjuti" || status === "selesai") && (
            <>
              <FormField id="processedBy" label="Diproses Oleh" error={errors.processedBy}>
                <Input id="processedBy" {...register("processedBy")} />
              </FormField>
              <FormField id="processedDate" label="Tanggal Diproses" error={errors.processedDate}>
                <Input id="processedDate" type="date" {...register("processedDate")} />
              </FormField>
            </>
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

export default IncomingMailForm;