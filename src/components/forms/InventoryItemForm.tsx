import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";
import FileDropInput from "./FileDropInput";
import FormField from "./FormField";
import { InventoryItemFormValues, inventoryItemSchema } from "./schemas";

interface InventoryItemFormProps {
  defaultValues?: Partial<InventoryItemFormValues>;
  rooms: { id: string; name: string }[];
  onSubmit: (values: InventoryItemFormValues) => Promise<void>;
  submitLabel?: string;
  existingPhotoUrl?: string;
}

const InventoryItemForm = ({ defaultValues, rooms, onSubmit, submitLabel, existingPhotoUrl }: InventoryItemFormProps) => {
  const hasRooms = rooms.length > 0;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InventoryItemFormValues>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      code: "",
      name: "",
      brand: "",
      specification: "",
      quantity: 0,
      totalPrice: 0,
      source: "",
      roomId: rooms[0]?.id ?? "",
      condition: "baik",
      photoFile: undefined,
      ...defaultValues,
    },
  });

  useEffect(() => {
    reset((prev) => ({ ...prev, ...defaultValues, photoFile: undefined }));
  }, [defaultValues, reset]);
  useEffect(() => {
    if (rooms.length > 0) {
      reset((prev) => ({ ...prev, roomId: prev.roomId || rooms[0].id }));
    }
  }, [rooms, reset]);

  const submitHandler = async (values: InventoryItemFormValues) => {
    await onSubmit(values);
    if (!defaultValues || Object.keys(defaultValues).length === 0) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 sm:space-y-6">
      {/* Top Section - Mobile First Layout */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Left Column - Basic Information */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide border-b border-muted pb-2">Informasi Barang</h4>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <FormField id="code" label="Kode Barang" error={errors.code}>
              <Input id="code" placeholder="Masukkan kode barang" {...register("code")} />
            </FormField>
            <FormField id="name" label="Nama Barang" error={errors.name}>
              <Input id="name" placeholder="Masukkan nama barang" {...register("name")} />
            </FormField>
            <div className="sm:col-span-2">
              <FormField id="brand" label="Merk" error={errors.brand}>
                <Input id="brand" placeholder="Masukkan merk barang" {...register("brand")} />
              </FormField>
            </div>
          </div>
        </div>

        {/* Right Column - Documentation */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide border-b border-muted pb-2">Dokumentasi</h4>
          <FormField
            id="photoFile"
            label="Foto Barang"
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
      </div>

      {/* Bottom Section - Details & Specification (Full Width) */}
      <div className="space-y-3 sm:space-y-4">
        <h4 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide border-b border-muted pb-2">Detail & Spesifikasi</h4>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <FormField id="source" label="Sumber" error={errors.source}>
            <Input id="source" placeholder="Sumber pengadaan" {...register("source")} />
          </FormField>
          <FormField id="quantity" label="Jumlah" error={errors.quantity}>
            <Input id="quantity" type="number" min={0} placeholder="0" inputMode="numeric" {...register("quantity", { valueAsNumber: true })} />
          </FormField>
          <FormField id="totalPrice" label="Harga Total" error={errors.totalPrice}>
            <Input
              id="totalPrice"
              type="number"
              min={0}
              step={1000}
              placeholder="0"
              inputMode="numeric"
              {...register("totalPrice", { valueAsNumber: true })}
            />
          </FormField>
          <div className="sm:col-span-2 lg:col-span-3">
            <FormField id="specification" label="Spesifikasi" error={errors.specification}>
              <Textarea id="specification" rows={2} placeholder="Deskripsi spesifikasi barang" {...register("specification")} className="resize-none" />
            </FormField>
          </div>
          <FormField id="roomId" label="Ruang" error={errors.roomId}>
            <Select id="roomId" disabled={!hasRooms} {...register("roomId")}>
              <option value="">Pilih Ruangan</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField id="condition" label="Kondisi" error={errors.condition}>
            <Select id="condition" {...register("condition")}>
              <option value="baik">Baik</option>
              <option value="cukup">Cukup</option>
              <option value="rusak">Rusak</option>
            </Select>
          </FormField>
        </div>
      </div>

      {!hasRooms ? (
        <p className="text-sm text-destructive">Tambahkan data ruangan terlebih dahulu sebelum mencatat barang.</p>
      ) : null}
      <div className="pt-4 border-t border-muted">
        <Button
          type="submit"
          disabled={isSubmitting || !hasRooms}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 sm:py-2.5 px-6 rounded-lg shadow-sm transition-colors touch-manipulation"
          size="lg"
        >
          {isSubmitting ? "Menyimpan..." : submitLabel ?? "Simpan"}
        </Button>
      </div>
    </form>
  );
};

export default InventoryItemForm;
