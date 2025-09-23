import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";
import FormField from "./FormField";
import {
  InventoryItemFormValues,
  inventoryItemSchema,
} from "./schemas";

interface InventoryItemFormProps {
  defaultValues?: Partial<InventoryItemFormValues>;
  rooms: { id: string; name: string }[];
  onSubmit: (values: InventoryItemFormValues) => Promise<void>;
  submitLabel?: string;
}

const InventoryItemForm = ({ defaultValues, rooms, onSubmit, submitLabel }: InventoryItemFormProps) => {
  const hasRooms = rooms.length > 0;
  const {
    register,
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
      photoUrl: "",
      condition: "baik",
      ...defaultValues,
    },
  });

  useEffect(() => {
    reset((prev) => ({ ...prev, ...defaultValues }));
  }, [defaultValues, reset]);
  useEffect(() => {
    if (rooms.length > 0) {
      reset((prev) => ({ ...prev, roomId: prev.roomId || rooms[0].id }));
    }
  }, [rooms, reset]);

  const submitHandler = async (values: InventoryItemFormValues) => {
    await onSubmit(values);
    reset({ ...values });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="code" label="Kode Barang" error={errors.code}>
          <Input id="code" {...register("code")} />
        </FormField>
        <FormField id="name" label="Nama Barang" error={errors.name}>
          <Input id="name" {...register("name")} />
        </FormField>
        <FormField id="brand" label="Merk" error={errors.brand}>
          <Input id="brand" {...register("brand")} />
        </FormField>
        <FormField id="specification" label="Spesifikasi" error={errors.specification}>
          <Textarea id="specification" rows={3} {...register("specification")} />
        </FormField>
        <FormField id="quantity" label="Jumlah" error={errors.quantity}>
          <Input id="quantity" type="number" min={0} {...register("quantity", { valueAsNumber: true })} />
        </FormField>
        <FormField id="totalPrice" label="Harga Total" error={errors.totalPrice}>
          <Input
            id="totalPrice"
            type="number"
            min={0}
            step={1000}
            {...register("totalPrice", { valueAsNumber: true })}
          />
        </FormField>
        <FormField id="source" label="Sumber" error={errors.source}>
          <Input id="source" {...register("source")} />
        </FormField>
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
        <FormField id="photoUrl" label="URL Foto" error={errors.photoUrl}>
          <Input id="photoUrl" type="url" placeholder="https://" {...register("photoUrl")} />
        </FormField>
      </div>
      {!hasRooms ? (
        <p className="text-sm text-destructive">Tambahkan data ruangan terlebih dahulu sebelum mencatat barang.</p>
      ) : null}
      <Button type="submit" disabled={isSubmitting || !hasRooms} className="w-full">
        {isSubmitting ? "Menyimpan..." : submitLabel ?? "Simpan"}
      </Button>
    </form>
  );
};

export default InventoryItemForm;
