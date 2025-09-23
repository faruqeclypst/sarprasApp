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

const RoomForm = ({ defaultValues, onSubmit, submitLabel, existingPhotoUrl }: RoomFormProps) => {
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
      photoFile: undefined,
      ...defaultValues,
    },
  });

  useEffect(() => {
    reset((prev) => ({ ...prev, ...defaultValues, photoFile: undefined }));
  }, [defaultValues, reset]);

  const submitHandler = async (values: RoomFormValues) => {
    await onSubmit(values);
    if (!defaultValues || Object.keys(defaultValues).length === 0) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="name" label="Nama Ruang" error={errors.name}>
          <Input id="name" {...register("name")} />
        </FormField>
        <FormField id="buildingCode" label="Kode Gedung" error={errors.buildingCode}>
          <Input id="buildingCode" {...register("buildingCode")} />
        </FormField>
        <FormField id="condition" label="Kondisi" error={errors.condition}>
          <Select id="condition" {...register("condition")}>
            <option value="baik">Baik</option>
            <option value="cukup">Cukup</option>
            <option value="rusak">Rusak</option>
          </Select>
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
      <FormField id="notes" label="Keterangan" error={errors.notes}>
        <Textarea id="notes" rows={3} {...register("notes")} />
      </FormField>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Menyimpan..." : submitLabel ?? "Simpan"}
      </Button>
    </form>
  );
};

export default RoomForm;
