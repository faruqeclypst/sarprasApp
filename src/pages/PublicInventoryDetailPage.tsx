import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { get, ref } from "firebase/database";
import { 
  ArrowLeft, 
  Check, 
  Copy, 
  Download, 
  ExternalLink, 
  Printer, 
  QrCode, 
  ShieldCheck, 
  Package, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Layers, 
  Maximize2 
} from "lucide-react";

import { database } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { generateQrCodeDataUrl, downloadQrCode } from "../lib/qrCode";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import type { InventoryItem } from "../types/inventory";

const conditionLabels: Record<InventoryItem["condition"], string> = {
  baik: "Baik",
  cukup: "Cukup",
  rusak: "Rusak",
};

const PublicInventoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [item, setItem] = useState<InventoryItem | null>(null);
  const [roomName, setRoomName] = useState<string>("Tidak diketahui");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchItemData = async () => {
      if (!id) {
        setError("Kode atau ID barang tidak valid.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const decodedParam = decodeURIComponent(id).trim();
        let foundItem: InventoryItem | null = null;
        let foundId = decodedParam;

        // 1. Try direct fetch by ID
        const directSnapshot = await get(ref(database, `inventory/items/${decodedParam}`));
        if (directSnapshot.exists()) {
          foundItem = {
            ...directSnapshot.val(),
            id: decodedParam,
          };
        } else {
          // 2. Search through all items by item.code or item.id
          const allSnapshot = await get(ref(database, "inventory/items"));
          if (allSnapshot.exists()) {
            const allItems = allSnapshot.val();
            for (const [key, val] of Object.entries<any>(allItems)) {
              if (
                key === decodedParam ||
                val.code?.trim().toLowerCase() === decodedParam.toLowerCase() ||
                val.id === decodedParam
              ) {
                foundItem = {
                  ...val,
                  id: key,
                };
                foundId = key;
                break;
              }
            }
          }
        }

        if (!foundItem) {
          if (isMounted) {
            setError(`Barang dengan kode atau ID "${decodedParam}" tidak ditemukan.`);
            setIsLoading(false);
          }
          return;
        }

        if (isMounted) {
          setItem(foundItem);

          // Fetch Room Name if roomId exists
          if (foundItem.roomId) {
            try {
              const roomSnapshot = await get(ref(database, `inventory/rooms/${foundItem.roomId}`));
              if (roomSnapshot.exists()) {
                setRoomName(roomSnapshot.val().name || "Tidak diketahui");
              }
            } catch (err) {
              console.warn("Gagal memuat nama ruangan:", err);
            }
          }

          // Generate QR code for this public URL
          const currentUrl = window.location.href;
          const qrUrl = await generateQrCodeDataUrl(currentUrl, { width: 350 });
          setQrDataUrl(qrUrl);
        }
      } catch (err) {
        console.error("Gagal memuat detail barang:", err);
        if (isMounted) {
          setError("Gagal memuat data barang. Periksa koneksi internet Anda.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchItemData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadQr = () => {
    if (qrDataUrl && item) {
      downloadQrCode(qrDataUrl, `qrcode-${item.code || item.name}.png`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm w-full bg-card p-8 rounded-2xl border shadow-lg">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="font-semibold text-lg text-foreground">Memuat Informasi Barang...</h3>
          <p className="text-xs text-muted-foreground">Mengambil data inventaris sarana dan prasarana.</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md w-full bg-card p-8 rounded-2xl border shadow-xl">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-950/60 text-red-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-red-50 dark:ring-red-950/30">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">Barang Tidak Ditemukan</h2>
            <p className="text-sm text-muted-foreground">{error || "Data barang inventaris tidak tersedia atau telah dihapus."}</p>
          </div>
          <div className="pt-2 flex flex-col gap-2 sm:flex-row justify-center">
            {user ? (
              <Button asChild className="w-full sm:w-auto">
                <Link to="/inventaris">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Dashboard
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link to="/login">
                  Masuk ke Aplikasi
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/20 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-foreground py-6 px-4 sm:py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Navbar / Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 font-bold text-lg">
              S
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                Sistem Inventaris Sarpras
                <span className="text-[10px] uppercase font-semibold tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 px-2 py-0.5 rounded-full">
                  Publik
                </span>
              </h1>
              <p className="text-xs text-muted-foreground">Informasi Validasi & Spesifikasi Aset Sekolah</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <Button asChild variant="outline" size="sm" className="shadow-sm">
                <Link to="/inventaris">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Dashboard Inventaris
                </Link>
              </Button>
            ) : (
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">
                  Login Admin
                </Link>
              </Button>
            )}
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left / Main Details (2 cols) */}
          <div className="md:col-span-2 space-y-6">
            {/* Header Card */}
            <Card className="shadow-sm border-blue-100/60 dark:border-blue-900/30 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500" />
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-muted text-muted-foreground border">
                    {item.code}
                  </span>
                  <Badge
                    className="text-xs px-2.5 py-0.5 font-medium"
                    variant={item.condition === "rusak" ? "destructive" : item.condition === "cukup" ? "secondary" : "default"}
                  >
                    Kondisi: {conditionLabels[item.condition]}
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight text-foreground pt-1">
                  {item.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Merk / Pabrikan: <span className="font-medium text-foreground">{item.brand || "-"}</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-muted/40 rounded-xl">
                  <div className="space-y-1">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-blue-500" /> Jumlah
                    </span>
                    <p className="text-base font-bold text-foreground">{item.quantity} Unit</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500" /> Lokasi Ruang
                    </span>
                    <p className="text-sm font-semibold text-foreground truncate">{roomName}</p>
                  </div>
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Perolehan
                    </span>
                    <p className="text-sm font-semibold text-foreground">
                      {item.acquisitionDate ? new Date(item.acquisitionDate).toLocaleDateString("id-ID") : "-"}
                    </p>
                  </div>
                </div>

                {/* Spesifikasi */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Spesifikasi & Keterangan
                  </h3>
                  <div className="p-4 rounded-xl border bg-card text-sm leading-relaxed whitespace-pre-wrap">
                    {item.specification || "Tidak ada rincian spesifikasi khusus."}
                  </div>
                </div>

                {/* Sumber Perolehan & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-amber-500" /> Sumber Dana / Pengadaan
                    </span>
                    <p className="font-semibold text-sm">{item.source || "-"}</p>
                  </div>
                  <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Status Kelayakan
                    </span>
                    <p className="font-semibold text-sm flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        item.condition === "baik" ? "bg-emerald-500" : 
                        item.condition === "cukup" ? "bg-amber-500" : "bg-rose-500"
                      }`} />
                      {item.condition === "baik" ? "Siap Digunakan" : item.condition === "cukup" ? "Perlu Pemeliharaan" : "Tidak Layak Pakai"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photo Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                  Foto Fisik Barang
                </CardTitle>
              </CardHeader>
              <CardContent>
                {item.photoUrl ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="relative group cursor-pointer overflow-hidden rounded-xl border bg-muted">
                        <img
                          src={item.photoUrl}
                          alt={item.name}
                          className="w-full h-64 sm:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium gap-2">
                          <Maximize2 className="w-5 h-5" />
                          Klik untuk memperbesar
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl p-2 sm:p-4">
                      <img
                        src={item.photoUrl}
                        alt={item.name}
                        className="w-full max-h-[85vh] object-contain rounded-lg"
                      />
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="w-full h-48 rounded-xl bg-muted/40 border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center text-muted-foreground space-y-2">
                    <Package className="w-10 h-10 opacity-30" />
                    <p className="text-sm font-medium">Foto fisik barang belum tersedia</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: QR Code & Share Card */}
          <div className="space-y-6">
            <Card className="shadow-sm sticky top-6 border-blue-200/50 dark:border-blue-900/40">
              <CardHeader className="pb-2 text-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center mx-auto mb-2">
                  <QrCode className="w-5 h-5" />
                </div>
                <CardTitle className="text-base font-bold">QR Code Aset</CardTitle>
                <p className="text-xs text-muted-foreground">Scan untuk verifikasi dan membuka detail</p>
              </CardHeader>
              <CardContent className="space-y-5 text-center">
                {/* QR Code Container */}
                <div className="p-4 bg-white rounded-2xl border shadow-inner inline-block mx-auto">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`QR Code ${item.code}`}
                      className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <p className="text-[11px] font-mono font-bold text-slate-700 mt-2 tracking-wider">
                    {item.code}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className="w-full justify-center text-xs h-9"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1.5 text-green-600" />
                        Tautan Disalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1.5" />
                        Salin Tautan Publik
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleDownloadQr}
                    variant="secondary"
                    className="w-full justify-center text-xs h-9 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Unduh Gambar QR Code
                  </Button>

                  <Button
                    onClick={handlePrint}
                    variant="ghost"
                    className="w-full justify-center text-xs h-9 text-muted-foreground"
                  >
                    <Printer className="w-3.5 h-3.5 mr-1.5" />
                    Cetak Halaman Ini
                  </Button>
                </div>

                <div className="pt-2 text-[11px] text-muted-foreground border-t">
                  Tautan publik ini dapat diakses oleh siswa, guru, staf, atau pemeriksa tanpa memerlukan login.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicInventoryDetailPage;
