import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import FormField from "./FormField";
import { LandFormValues, landSchema } from "./schemas";

interface LandFormProps {
  defaultValues?: Partial<LandFormValues>;
  onSubmit: (values: LandFormValues) => Promise<void>;
  submitLabel?: string;
}

const LandForm = ({ defaultValues, onSubmit, submitLabel }: LandFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LandFormValues>({
    resolver: zodResolver(landSchema),
    defaultValues: {
      locationName: "",
      locationCode: "",
      area: 0,
      acquisitionYear: new Date().getFullYear(),
      address: "",
      certificateNumber: "",
      origin: "",
      price: 0,
      description: "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    reset((prev) => ({ ...prev, ...defaultValues }));
  }, [defaultValues, reset]);

  const submitHandler = async (values: LandFormValues) => {
    await onSubmit(values);
    if (!defaultValues || Object.keys(defaultValues).length === 0) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="locationName" label="Nama Lokasi" error={errors.locationName}>
          <Input id="locationName" {...register("locationName")} />
        </FormField>
        <FormField id="locationCode" label="Kode Lokasi" error={errors.locationCode}>
          <Input id="locationCode" {...register("locationCode")} />
        </FormField>
        <FormField id="area" label="Luas Tanah (m²)" error={errors.area}>
          <Input id="area" type="number" step="0.01" min={0} {...register("area", { valueAsNumber: true })} />
        </FormField>
        <FormField id="acquisitionYear" label="Tahun Pengadaan" error={errors.acquisitionYear}>
          <Input
            id="acquisitionYear"
            type="number"
            min={1950}
            max={new Date().getFullYear()}
            {...register("acquisitionYear", { valueAsNumber: true })}
          />
        </FormField>
        <FormField id="certificateNumber" label="No. Sertifikat" error={errors.certificateNumber}>
          <Input id="certificateNumber" {...register("certificateNumber")} />
        </FormField>
        <FormField id="origin" label="Asal" error={errors.origin}>
          <Input id="origin" {...register("origin")} />
        </FormField>
        <FormField id="price" label="Harga" error={errors.price}>
          <Input id="price" type="number" min={0} step={1000} {...register("price", { valueAsNumber: true })} />
        </FormField>
      </div>
      <FormField id="address" label="Alamat" error={errors.address}>
        <Textarea id="address" rows={3} {...register("address")} />
      </FormField>
      <FormField id="description" label="Keterangan" error={errors.description}>
        <Textarea id="description" rows={3} {...register("description")} />
      </FormField>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Menyimpan..." : submitLabel ?? "Simpan"}
      </Button>
    </form>
  );
};

export default LandForm;
