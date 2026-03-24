import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import FormField from "./FormField";
import FileDropInput from "./FileDropInput";
import { LandFormValues, landSchema } from "./schemas";

interface LandFormProps {
  defaultValues?: Partial<LandFormValues>;
  onSubmit: (values: LandFormValues) => Promise<void>;
  submitLabel?: string;
  existingPhotoUrl?: string;
}

const LandForm = ({ defaultValues, onSubmit, submitLabel, existingPhotoUrl }: LandFormProps) => {
  const {
    register,
    control,
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
      description: "",
      photoFile: undefined,
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset((prev) => ({ ...prev, ...defaultValues, photoFile: undefined }));
    }
  }, [defaultValues, reset]);

  const submitHandler = async (values: LandFormValues) => {
    try {
      await onSubmit(values);
      if (!defaultValues || Object.keys(defaultValues).length === 0) {
        reset({
          locationName: "",
          locationCode: "",
          area: 0,
          acquisitionYear: new Date().getFullYear(),
          address: "",
          certificateNumber: "",
          origin: "",
          description: "",
          photoFile: undefined,
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      // Don't reset the form if there was an error, but show validation errors
      throw error;
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      {/* Basic Information Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Informasi Dasar</h4>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>
      </div>

      {/* Location & Description Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Lokasi & Keterangan</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField id="address" label="Alamat" error={errors.address}>
              <Textarea id="address" rows={2} {...register("address")} className="resize-none" />
            </FormField>
          </div>
          <div className="sm:col-span-2">
            <FormField id="description" label="Keterangan" error={errors.description}>
              <Textarea id="description" rows={2} {...register("description")} className="resize-none" />
            </FormField>
          </div>
        </div>
      </div>
      {/* Documentation Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Dokumentasi</h4>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-3">
            <FormField
              id="photoFile"
              label="Foto"
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
                    accept="image/*"
                    placeholder="Seret & lepas foto di sini atau klik untuk memilih"
                  />
                )}
              />
            </FormField>
          </div>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-colors"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Menyimpan..." : submitLabel ?? "Simpan"}
      </Button>
    </form>
  );
};

export default LandForm;
