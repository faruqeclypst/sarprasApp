import { z } from "zod";

const imageFileSchema = z
  .custom<File | undefined>(
    (value) => {
      if (value === undefined || value === null) return true;
      if (typeof File === "undefined") return true;
      return value instanceof File;
    },
    { message: "Berkas tidak valid" }
  )
  .refine((file) => !file || file.type.startsWith("image/"), {
    message: "Unggah file gambar (jpg, png, dll.)",
  })
  .optional();

export const inventoryItemSchema = z.object({
  code: z.string().min(2, "Kode wajib diisi"),
  name: z.string().min(2, "Nama barang wajib diisi"),
  brand: z.string().optional().default(""),
  specification: z.string().optional().default(""),
  quantity: z.coerce.number().min(0, "Jumlah tidak boleh negatif"),
  totalPrice: z.coerce.number().min(0, "Harga total tidak boleh negatif"),
  source: z.string().min(1, "Sumber wajib diisi"),
  roomId: z.string().min(1, "Ruang wajib dipilih"),
  condition: z.enum(["baik", "cukup", "rusak"]),
  photoFile: imageFileSchema,
});

export const roomSchema = z.object({
  name: z.string().min(2, "Nama ruang wajib diisi"),
  buildingCode: z.string().min(1, "Kode gedung wajib diisi"),
  condition: z.enum(["baik", "cukup", "rusak"]),
  notes: z.string().optional().or(z.literal("")),
  photoFile: imageFileSchema,
});

export const landSchema = z.object({
  locationName: z.string().min(2, "Nama lokasi wajib diisi"),
  locationCode: z.string().min(1, "Kode lokasi wajib diisi"),
  area: z.coerce.number().min(0.1, "Luas tanah wajib diisi"),
  acquisitionYear: z.coerce
    .number()
    .min(1950, "Tahun pengadaan tidak valid")
    .max(new Date().getFullYear(), "Tahun pengadaan tidak valid"),
  address: z.string().min(3, "Alamat wajib diisi"),
  certificateNumber: z.string().min(1, "Nomor sertifikat wajib diisi"),
  origin: z.string().min(1, "Asal wajib diisi"),
  price: z.coerce.number().min(0, "Harga wajib diisi"),
  description: z.string().optional().or(z.literal("")),
});

export const loanSchema = z.object({
  loanDate: z.string().min(1, "Tanggal peminjaman wajib diisi"),
  returnDate: z.string().min(1, "Tanggal pengembalian wajib diisi"),
  itemId: z.string().min(1, "Barang wajib dipilih"),
  itemName: z.string().min(1, "Nama barang wajib diisi"),
  borrowerName: z.string().min(1, "Nama peminjam wajib diisi"),
  notes: z.string().optional().or(z.literal("")),
  photoFile: imageFileSchema,
});

export type InventoryItemFormValues = z.infer<typeof inventoryItemSchema>;
export type RoomFormValues = z.infer<typeof roomSchema>;
export type LandFormValues = z.infer<typeof landSchema>;
export type LoanFormValues = z.infer<typeof loanSchema>;
