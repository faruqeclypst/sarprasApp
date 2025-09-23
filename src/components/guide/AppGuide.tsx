import * as React from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";

interface AppGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const AppGuide: React.FC<AppGuideProps> = ({ isOpen, onClose }) => {
  const [currentSection, setCurrentSection] = React.useState<number>(0);

  const guideSections: GuideSection[] = [
    {
      id: "welcome",
      title: "Selamat Datang",
      icon: <Home className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Panduan Aplikasi Inventory Sekolah</h3>
            <p className="text-muted-foreground">
              Sistem manajemen inventaris yang komprehensif untuk mengelola aset sekolah
            </p>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Fitur Utama
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Manajemen barang inventaris dengan foto dan detail lengkap</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Pengelolaan data ruangan dan gedung</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Pencatatan data tanah dan aset tetap</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Sistem peminjaman dengan tracking terlambat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Laporan dan export data dalam format CSV</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Akses & Keamanan
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                  <p>• Login dengan email/password atau Google Account</p>
                  <p>• Data tersimpan dengan aman menggunakan Firebase</p>
                  <p>• Backup otomatis dan sinkronisasi real-time</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "inventory",
      title: "Manajemen Barang",
      icon: <FileText className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Cara Menambah Barang Baru</h4>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>Klik menu "Barang" di sidebar</li>
              <li>Klik tombol "Tambah Barang" (+)</li>
              <li>Isi form dengan informasi lengkap:
                <ul className="ml-4 mt-1 space-y-1 list-disc">
                  <li>Kode barang (wajib unik)</li>
                  <li>Nama dan spesifikasi</li>
                  <li>Merk dan jumlah</li>
                  <li>Harga total dan sumber dana</li>
                  <li>Ruangan penempatan</li>
                  <li>Kondisi barang</li>
                  <li>Upload foto (opsional)</li>
                </ul>
              </li>
              <li>Klik "Simpan" untuk menyimpan data</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tips Pengelolaan Barang</h4>
            <ul className="space-y-1 text-sm">
              <li>• Selalu foto barang untuk dokumentasi</li>
              <li>• Gunakan kode yang sistematis (contoh: BRG-001)</li>
              <li>• Update kondisi secara berkala</li>
              <li>• Catat spesifikasi teknis yang lengkap</li>
              <li>• Kelompokkan barang berdasarkan ruangan</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Fitur Pencarian & Filter</h4>
            <ul className="space-y-1 text-sm">
              <li>• Gunakan search box untuk mencari cepat</li>
              <li>• Klik header kolom untuk sorting</li>
              <li>• Sembunyikan/tampilkan kolom sesuai kebutuhan</li>
              <li>• Export data ke CSV untuk laporan</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "rooms",
      title: "Manajemen Ruangan",
      icon: <Settings className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Menambah Data Ruangan</h4>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>Pilih menu "Ruang" di sidebar</li>
              <li>Klik tombol "Tambah Ruang" (+)</li>
              <li>Isi informasi ruangan:
                <ul className="ml-4 mt-1 space-y-1 list-disc">
                  <li>Nama ruangan</li>
                  <li>Kode gedung</li>
                  <li>Kondisi ruangan</li>
                  <li>Keterangan tambahan</li>
                  <li>Upload foto ruangan</li>
                </ul>
              </li>
              <li>Simpan data ruangan</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Kode Gedung yang Direkomendasikan</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <strong>Gedung A:</strong> Lantai 1-3
              </div>
              <div>
                <strong>Gedung B:</strong> Lantai 1-2
              </div>
              <div>
                <strong>Gedung C:</strong> Lab & Workshop
              </div>
              <div>
                <strong>Gedung D:</strong> Aula & Ruang Serba Guna
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Pengecekan Kondisi</h4>
            <ul className="space-y-1 text-sm">
              <li>• <strong>Baik:</strong> Kondisi prima, tidak ada kerusakan</li>
              <li>• <strong>Cukup:</strong> Masih bisa digunakan, ada kekurangan minor</li>
              <li>• <strong>Rusak:</strong> Tidak bisa digunakan, perlu perbaikan</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "lands",
      title: "Manajemen Tanah",
      icon: <FileText className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Menambah Data Tanah</h4>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>Klik menu "Tanah" di sidebar</li>
              <li>Klik tombol "Tambah Tanah" (+)</li>
              <li>Isi form data tanah:
                <ul className="ml-4 mt-1 space-y-1 list-disc">
                  <li>Nama lokasi tanah</li>
                  <li>Kode lokasi unik</li>
                  <li>Luas dalam meter persegi</li>
                  <li>Tahun perolehan</li>
                  <li>Alamat lengkap</li>
                  <li>Nomor sertifikat</li>
                  <li>Asal perolehan</li>
                  <li>Harga pembelian</li>
                  <li>Keterangan tambahan</li>
                  <li>Upload foto sertifikat/tanah</li>
                </ul>
              </li>
              <li>Klik "Simpan" untuk menyimpan</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Dokumen Penting</h4>
            <ul className="space-y-1 text-sm">
              <li>• <strong>Sertifikat Tanah:</strong> SHM, SHGB, atau Letter C</li>
              <li>• <strong>IMB:</strong> Izin Mendirikan Bangunan</li>
              <li>• <strong>PBB:</strong> Pajak Bumi dan Bangunan</li>
              <li>• <strong>Surat Ukut:</strong> Pengukuran tanah resmi</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tips Manajemen Aset Tanah</h4>
            <ul className="space-y-1 text-sm">
              <li>• Simpan sertifikat asli di tempat aman</li>
              <li>• Lakukan survei rutin batas tanah</li>
              <li>• Bayar PBB tepat waktu</li>
              <li>• Dokumentasi foto lokasi secara berkala</li>
              <li>• Update nilai aset sesuai NJOP</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "loans",
      title: "Sistem Peminjaman",
      icon: <Users className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Proses Peminjaman Barang</h4>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>Buka menu "Peminjaman" di sidebar</li>
              <li>Klik tombol "Tambah Peminjaman" (+)</li>
              <li>Pilih barang yang akan dipinjam</li>
              <li>Isi data peminjaman:
                <ul className="ml-4 mt-1 space-y-1 list-disc">
                  <li>Nama peminjam</li>
                  <li>Tanggal peminjaman</li>
                  <li>Tanggal batas pengembalian</li>
                  <li>Catatan tambahan (opsional)</li>
                  <li>Upload foto kondisi barang</li>
                </ul>
              </li>
              <li>Simpan data peminjaman</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Status Peminjaman</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Dipinjam</Badge>
                <span className="text-sm">Barang sedang dipinjam, belum jatuh tempo</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Terlambat</Badge>
                <span className="text-sm">Barang belum dikembalikan melebihi batas waktu</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Proses Pengembalian</h4>
            <ol className="space-y-1 text-sm list-decimal list-inside">
              <li>Cari data peminjaman di tabel</li>
              <li>Klik tombol "Edit" pada peminjaman</li>
              <li>Update status menjadi "Dikembalikan"</li>
              <li>Tambahkan catatan kondisi barang saat kembali</li>
              <li>Upload foto kondisi setelah pemakaian</li>
              <li>Simpan perubahan</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Kebijakan Peminjaman</h4>
            <ul className="space-y-1 text-sm">
              <li>• Maksimal 7 hari untuk barang elektronik</li>
              <li>• Maksimal 14 hari untuk buku dan media pembelajaran</li>
              <li>• Maksimal 30 hari untuk peralatan olahraga</li>
              <li>• Denda keterlambatan: Rp 5.000/hari</li>
              <li>• Kerusakan akibat kelalaian menjadi tanggung jawab peminjam</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "tips",
      title: "Tips & Trik",
      icon: <Search className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Tips Fotografi</h4>
            <ul className="space-y-1 text-sm">
              <li>• Foto dengan pencahayaan yang cukup</li>
              <li>• Gunakan background polos untuk barang</li>
              <li>• Foto sertifikat tanah dengan jelas</li>
              <li>• Ambil foto dari berbagai sudut</li>
              <li>• Pastikan teks dan nomor terbaca jelas</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Optimasi Pencarian</h4>
            <ul className="space-y-1 text-sm">
              <li>• Gunakan kata kunci spesifik</li>
              <li>• Coba berbagai variasi penulisan</li>
              <li>• Gunakan filter kolom untuk pencarian lebih tepat</li>
              <li>• Export data untuk analisis lebih lanjut</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Backup Data</h4>
            <ul className="space-y-1 text-sm">
              <li>• Export data secara berkala</li>
              <li>• Simpan file backup di tempat yang aman</li>
              <li>• Gunakan Google Drive untuk backup otomatis</li>
              <li>• Lakukan backup sebelum migrasi data besar</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Keamanan Akun</h4>
            <ul className="space-y-1 text-sm">
              <li>• Gunakan password yang kuat</li>
              <li>• Aktifkan 2FA jika tersedia</li>
              <li>• Jangan bagikan kredensial login</li>
              <li>• Logout saat selesai menggunakan aplikasi</li>
              <li>• Gunakan VPN saat akses dari jaringan publik</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Pemeliharaan Sistem</h4>
            <ul className="space-y-1 text-sm">
              <li>• Update browser ke versi terbaru</li>
              <li>• Bersihkan cache secara berkala</li>
              <li>• Pastikan koneksi internet stabil</li>
              <li>• Laporkan bug atau error ke admin</li>
              <li>• Ikuti update fitur terbaru</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  const nextSection = () => {
    setCurrentSection((prev) => (prev + 1) % guideSections.length);
  };

  const prevSection = () => {
    setCurrentSection((prev) => (prev - 1 + guideSections.length) % guideSections.length);
  };

  const goToSection = (index: number) => {
    setCurrentSection(index);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Panduan Aplikasi Inventory Sekolah
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex">
          {/* Sidebar Navigation */}
          <div className="w-64 border-l flex-shrink-0 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold mb-3">Daftar Isi</h3>
              <div className="space-y-1">
                {guideSections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => goToSection(index)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                      currentSection === index
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {section.icon}
                    {section.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                {guideSections[currentSection].icon}
                <h2 className="text-lg font-semibold">
                  {guideSections[currentSection].title}
                </h2>
              </div>

              <div className="prose prose-sm max-w-none">
                {guideSections[currentSection].content}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between p-4 border-t flex-shrink-0">
          <Button
            variant="outline"
            onClick={prevSection}
            disabled={currentSection === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Sebelumnya
          </Button>

          <div className="flex items-center gap-2">
            {guideSections.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSection(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentSection === index ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            onClick={nextSection}
            disabled={currentSection === guideSections.length - 1}
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppGuide;