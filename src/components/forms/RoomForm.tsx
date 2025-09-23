import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";
import FormField from "./FormField";
import { RoomFormValues, roomSchema } from "./schemas";

interface RoomFormProps {
  defaultValues?: Partial<RoomFormValues>;
  onSubmit: (values: RoomFormValues) => Promise<void>;
  submitLabel?: string;
}

const RoomForm = ({ defaultValues, onSubmit, submitLabel }: RoomFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: "",
      buildingCode: "",
      condition: "baik",
      photoUrl: "",
      notes: "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    reset((prev) => ({ ...prev, ...defaultValues }));
  }, [defaultValues, reset]);

  const submitHandler = async (values: RoomFormValues) => {
    await onSubmit(values);
    reset(values);
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
        <FormField id="photoUrl" label="URL Foto Ruang" error={errors.photoUrl}>
          <Input id="photoUrl" type="url" placeholder="https://" {...register("photoUrl")} />
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
