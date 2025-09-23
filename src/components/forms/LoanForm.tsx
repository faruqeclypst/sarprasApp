import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";
import FileDropInput from "./FileDropInput";
import FormField from "./FormField";
import { LoanFormValues, loanSchema } from "./schemas";

interface LoanFormProps {
  defaultValues?: Partial<LoanFormValues>;
  items: { id: string; name: string }[];
  onSubmit: (values: LoanFormValues) => Promise<void>;
  submitLabel?: string;
  existingPhotoUrl?: string;
}

const LoanForm = ({ defaultValues, items, onSubmit, submitLabel, existingPhotoUrl }: LoanFormProps) => {
  const hasItems = items.length > 0;
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoanFormValues>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      loanDate: new Date().toISOString().slice(0, 10),
      returnDate: new Date().toISOString().slice(0, 10),
      itemId: items[0]?.id ?? "",
      itemName: items[0]?.name ?? "",
      borrowerName: "",
      notes: "",
      photoFile: undefined,
      ...defaultValues,
    },
  });

  const itemId = watch("itemId");

  useEffect(() => {
    reset((prev) => ({ ...prev, ...defaultValues, photoFile: undefined }));
  }, [defaultValues, reset]);

  useEffect(() => {
    const selectedItem = items.find((item) => item.id === itemId);
    if (selectedItem) {
      setValue("itemName", selectedItem.name);
    }
  }, [itemId, items, setValue]);

  useEffect(() => {
    if (!itemId && items.length > 0) {
      setValue("itemId", items[0].id, { shouldDirty: true });
      setValue("itemName", items[0].name, { shouldDirty: true });
    }
  }, [itemId, items, setValue]);

  const submitHandler = async (values: LoanFormValues) => {
    await onSubmit(values);
    if (!defaultValues || Object.keys(defaultValues).length === 0) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="loanDate" label="Tanggal Peminjaman" error={errors.loanDate}>
          <Input id="loanDate" type="date" {...register("loanDate")} />
        </FormField>
        <FormField id="returnDate" label="Tanggal Pengembalian" error={errors.returnDate}>
          <Input id="returnDate" type="date" {...register("returnDate")} />
        </FormField>
        <FormField id="itemId" label="Barang" error={errors.itemId}>
          <Select id="itemId" disabled={!hasItems} {...register("itemId")}>
            <option value="">Pilih Barang</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField id="itemName" label="Nama Barang" error={errors.itemName}>
          <Input id="itemName" {...register("itemName")} />
        </FormField>
        <FormField id="borrowerName" label="Nama Peminjam" error={errors.borrowerName}>
          <Input id="borrowerName" {...register("borrowerName")} />
        </FormField>
        <FormField
          id="photoFile"
          label="Foto Dokumentasi"
          error={errors.photoFile}
          description="Format JPG, PNG, atau WEBP"
        >
          <Controller
            control={control}
            name="photoFile"
            render={({ field }) => (
              <FileDropInput
                id="photoFile"
                value={field.value}
                onChange={field.onChange}
                existingUrl={existingPhotoUrl}
              />
            )}
          />
        </FormField>
      </div>
      <FormField id="notes" label="Keterangan" error={errors.notes}>
        <Textarea id="notes" rows={3} {...register("notes")} />
      </FormField>
      {!hasItems ? (
        <p className="text-sm text-destructive">Tambahkan data barang terlebih dahulu sebelum mencatat peminjaman.</p>
      ) : null}
      <Button type="submit" className="w-full" disabled={isSubmitting || !hasItems}>
        {isSubmitting ? "Menyimpan..." : submitLabel ?? "Simpan"}
      </Button>
    </form>
  );
};

export default LoanForm;
