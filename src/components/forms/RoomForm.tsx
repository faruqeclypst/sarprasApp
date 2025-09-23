import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";
import FileDropInput from "./FileDropInput";
import FormField from "./FormField";
import { RoomFormValues, roomSchema } from "./schemas";

interface RoomFormProps {
  defaultValues?: Partial<RoomFormValues>;
  onSubmit: (values: RoomFormValues) => Promise<void>;
  submitLabel?: string;
  existingPhotoUrl?: string;
}

const RoomForm = ({
  defaultValues,
  onSubmit,
  submitLabel,
  existingPhotoUrl
}: RoomFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: "",
      buildingCode: "",
      condition: "baik",
      notes: "",
      capacity: undefined,
      roomType: undefined,
      floor: undefined,
      photoFile: undefined,
      ...defaultValues,
    },
  });

  useEffect(() => {
    reset((prev) => ({ ...prev, ...defaultValues, photoFile: undefined }));
  }, [defaultValues, reset]);

  const submitHandler = async (values: RoomFormValues) => {
    try {
      await onSubmit(values);
      if (!defaultValues || Object.keys(defaultValues).length === 0) {
        reset();
      }
    } catch (error) {
      console.error("Form submission error:", error);
      // Don't reset the form if there was an error, but show validation errors
      throw error;
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      {/* Responsive grid layout */}
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        <FormField id="name" label="Nama Ruang" error={errors.name}>
          <Input id="name" placeholder="Masukkan nama ruang" {...register("name")} />
        </FormField>
        <FormField id="buildingCode" label="Kode Gedung" error={errors.buildingCode}>
          <Input id="buildingCode" placeholder="Masukkan kode gedung" {...register("buildingCode")} />
        </FormField>
        <FormField id="condition" label="Kondisi" error={errors.condition}>
          <Select id="condition" {...register("condition")}>
            <option value="baik">Baik</option>
            <option value="cukup">Cukup</option>
            <option value="rusak">Rusak</option>
          </Select>
        </FormField>
        <FormField id="roomType" label="Jenis Ruang" error={errors.roomType}>
          <Select id="roomType" {...register("roomType")}>
            <option value="">Pilih jenis ruang</option>
            <option value="kelas">Kelas</option>
            <option value="laboratorium">Laboratorium</option>
            <option value="kantor">Kantor</option>
            <option value="ruang_rapat">Ruang Rapat</option>
            <option value="perpustakaan">Perpustakaan</option>
            <option value="lainnya">Lainnya</option>
          </Select>
        </FormField>
        <FormField id="capacity" label="Kapasitas (orang)" error={errors.capacity}>
          <Input
            id="capacity"
            type="number"
            min="1"
            placeholder="Jumlah kapasitas"
            {...register("capacity", { valueAsNumber: true })}
          />
        </FormField>
        <FormField id="floor" label="Lantai" error={errors.floor}>
          <Input
            id="floor"
            type="number"
            min="1"
            placeholder="Nomor lantai"
            {...register("floor", { valueAsNumber: true })}
          />
        </FormField>
        <FormField
          id="photoFile"
          label="Foto Ruangan"
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

      {/* Full-width notes field */}
      <FormField id="notes" label="Keterangan" error={errors.notes}>
        <Textarea
          id="notes"
          rows={3}
          placeholder="Tambahkan keterangan tambahan (opsional)"
          {...register("notes")}
          className="min-h-[80px] resize-none"
        />
      </FormField>

      {/* Form footer with actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-2 pt-4 border-t">
        <Button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Menyimpan..." : submitLabel ?? "Simpan"}
        </Button>
      </div>
    </form>
  );
};

export default RoomForm;
