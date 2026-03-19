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
  acquisitionDate: z.string().min(1, "Tanggal perolehan wajib diisi"),
  source: z.string().min(1, "Sumber wajib diisi"),
  roomId: z.string().min(1, "Ruang wajib dipilih"),
  condition: z.enum(["baik", "cukup", "rusak"]),
  photoFile: imageFileSchema,
});

export const fixedAssetSchema = z.object({
  code: z.string().min(2, "Kode wajib diisi"),
  name: z.string().min(2, "Nama aset wajib diisi"),
  brand: z.string().optional().default(""),
  specification: z.string().optional().default(""),
  quantity: z.coerce.number().min(0, "Jumlah tidak boleh negatif"),
  acquisitionDate: z.string().min(1, "Tanggal perolehan wajib diisi"),
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
  capacity: z.coerce.number().min(1, "Kapasitas minimal 1 orang").optional(),
  roomType: z.enum(["kelas", "laboratorium", "kantor", "ruang_rapat", "perpustakaan", "lainnya"]).optional(),
  floor: z.coerce.number().min(1, "Lantai minimal 1").optional(),
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
  description: z.string().optional().or(z.literal("")),
  photoFile: imageFileSchema,
});

export const loanSchema = z.object({
  loanDate: z.string().min(1, "Tanggal peminjaman wajib diisi"),
  returnDate: z.string().min(1, "Tanggal pengembalian wajib diisi"),
  itemId: z.string().min(1, "Barang wajib dipilih"),
  itemName: z.string().min(1, "Nama barang wajib diisi"),
  borrowerName: z.string().min(1, "Nama peminjam wajib diisi"),
  status: z.enum(["dipinjam", "dikembalikan"]),
  notes: z.string().optional().or(z.literal("")),
  photoFile: imageFileSchema,
});

export const incomingMailSchema = z.object({
  mailNumber: z.string().min(1, "Nomor surat wajib diisi"),
  date: z.string().min(1, "Tanggal surat wajib diisi"),
  sender: z.string().min(2, "Pengirim wajib diisi"),
  senderAddress: z.string().min(3, "Alamat pengirim wajib diisi"),
  recipient: z.string().min(2, "Penerima wajib diisi"),
  subject: z.string().min(3, "Perihal wajib diisi"),
  content: z.string().min(5, "Isi surat wajib diisi"),
  priority: z.enum(["rendah", "normal", "tinggi", "urgent"]),
  category: z.enum(["undangan", "pemberitahuan", "permohonan", "laporan", "lainnya"]),
  status: z.enum(["belum_dibaca", "sudah_dibaca", "ditindaklanjuti", "selesai"]),
  notes: z.string().optional().or(z.literal("")),
  receivedBy: z.string().min(2, "Nama penerima wajib diisi"),
  processedBy: z.string().optional().or(z.literal("")),
  processedDate: z.string().optional().or(z.literal("")),
  attachmentFile: imageFileSchema,
});

export const outgoingMailSchema = z.object({
  mailNumber: z.string().min(1, "Nomor surat wajib diisi"),
  date: z.string().min(1, "Tanggal surat wajib diisi"),
  sender: z.string().min(2, "Pengirim wajib diisi"),
  recipient: z.string().min(2, "Penerima wajib diisi"),
  recipientAddress: z.string().min(3, "Alamat penerima wajib diisi"),
  subject: z.string().min(3, "Perihal wajib diisi"),
  content: z.string().min(5, "Isi surat wajib diisi"),
  priority: z.enum(["rendah", "normal", "tinggi", "urgent"]),
  category: z.enum(["undangan", "pemberitahuan", "permohonan", "laporan", "lainnya"]),
  status: z.enum(["draft", "terkirim", "diterima", "ditolak"]),
  deliveryMethod: z.enum(["pos", "kurir", "email", "fax", "langsung"]),
  notes: z.string().optional().or(z.literal("")),
  createdBy: z.string().min(2, "Nama pembuat wajib diisi"),
  sentDate: z.string().optional().or(z.literal("")),
  attachmentFile: imageFileSchema,
});

export type InventoryItemFormValues = z.infer<typeof inventoryItemSchema>;
export type FixedAssetFormValues = z.infer<typeof fixedAssetSchema>;
export type RoomFormValues = z.infer<typeof roomSchema>;
export type LandFormValues = z.infer<typeof landSchema>;
export type LoanFormValues = z.infer<typeof loanSchema>;
export type IncomingMailFormValues = z.infer<typeof incomingMailSchema>;
export type OutgoingMailFormValues = z.infer<typeof outgoingMailSchema>;
