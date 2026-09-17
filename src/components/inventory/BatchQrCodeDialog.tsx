import { useState, useEffect, useMemo, useRef } from "react";
import { 
  Check, 
  Copy, 
  Download, 
  ExternalLink, 
  Printer, 
  QrCode, 
  Search, 
  Filter, 
  X, 
  Layers, 
  RefreshCw 
} from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Badge } from "../ui/badge";
import { generateQrCodeDataUrl, downloadQrCode, getItemPublicUrl } from "../../lib/qrCode";
import type { InventoryItem, Room } from "../../types/inventory";

interface BatchQrCodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  items: InventoryItem[];
  rooms: Room[];
  type?: "inventaris" | "aset-tetap";
  title?: string;
}

export const BatchQrCodeDialog = ({
  isOpen,
  onClose,
  items,
  rooms,
  type = "inventaris",
  title,
}: BatchQrCodeDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [labelSize, setLabelSize] = useState<"standard" | "compact">("standard");
  const [qrCodeMap, setQrCodeMap] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const roomLookup = useMemo(() => {
    return new Map(rooms.map((r) => [r.id, r.name]));
  }, [rooms]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRoom = selectedRoom === "all" || item.roomId === selectedRoom;

      return matchesSearch && matchesRoom;
    });
  }, [items, searchTerm, selectedRoom]);

  // Generate QR codes for visible items
  useEffect(() => {
    if (!isOpen || items.length === 0) return;

    let isMounted = true;
    setIsGenerating(true);

    const generateAll = async () => {
      const newMap: Record<string, string> = { ...qrCodeMap };
      const itemsToGenerate = items.filter((item) => !newMap[item.id]);

      for (const item of itemsToGenerate) {
        if (!isMounted) break;
        try {
          const publicUrl = getItemPublicUrl(item.code || item.id, type);
          const dataUrl = await generateQrCodeDataUrl(publicUrl, {
            width: labelSize === "compact" ? 180 : 250,
            margin: 1,
          });
          newMap[item.id] = dataUrl;
        } catch (err) {
          console.error(`Gagal generate QR untuk ${item.code}:`, err);
        }
      }

      if (isMounted) {
        setQrCodeMap(newMap);
        setIsGenerating(false);
      }
    };

    generateAll();

    return () => {
      isMounted = false;
    };
  }, [isOpen, items, labelSize, type]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = async (item: InventoryItem) => {
    const url = getItemPublicUrl(item.code || item.id, type);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownloadSingle = (item: InventoryItem) => {
    const dataUrl = qrCodeMap[item.id];
    if (dataUrl) {
      downloadQrCode(dataUrl, `qrcode-${item.code || item.name}.png`);
    }
  };

  const handleDownloadAll = async () => {
    // Download items sequentially with slight delay so browser doesn't block multiple downloads
    for (const item of filteredItems) {
      const dataUrl = qrCodeMap[item.id];
      if (dataUrl) {
        downloadQrCode(dataUrl, `qrcode-${item.code || item.name}.png`);
        await new Promise((r) => setTimeout(r, 200));
      }
    }
  };

  const isFixedAsset = type === "aset-tetap";
  const defaultTitle = isFixedAsset
    ? "Generate QR Code Semua Aset Tetap"
    : "Generate QR Code Semua Barang";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[95vh] flex flex-col p-0 gap-0 overflow-hidden print:m-0 print:p-0 print:border-none print:shadow-none print:max-w-none print:w-full">
        {/* Header - Hidden on print */}
        <div className="p-4 sm:p-6 border-b bg-card print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <QrCode className="w-5 h-5" />
              </div>
              <DialogTitle className="text-xl font-bold">
                {title || defaultTitle}
              </DialogTitle>
              <Badge variant="secondary" className="font-semibold text-xs ml-2">
                {filteredItems.length} dari {items.length} Item
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {isFixedAsset
                ? "Label QR Code siap cetak (stiker aset) yang langsung terhubung ke halaman detail publik masing-masing aset tetap."
                : "Label QR Code siap cetak (stiker aset) yang langsung terhubung ke halaman detail publik masing-masing barang."}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <Button
              onClick={handlePrint}
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm font-medium"
            >
              <Printer className="w-4 h-4" />
              Cetak Semua Label (Print)
            </Button>
            <Button
              onClick={handleDownloadAll}
              variant="outline"
              className="gap-2 text-xs"
              title="Unduh satu per satu sebagai file PNG"
            >
              <Download className="w-4 h-4" />
              Unduh Gambar PNG
            </Button>
          </div>
        </div>

        {/* Filter & Toolbar - Hidden on print */}
        <div className="p-4 bg-muted/30 border-b flex flex-col sm:flex-row gap-3 items-center justify-between print:hidden">
          <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto flex-1 max-w-xl">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari kode, nama, atau merk barang..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-xs h-9 bg-background"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Room Filter */}
            <Select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full sm:w-52 text-xs h-9 bg-background"
            >
              <option value="all">Semua Ruangan ({items.length})</option>
              {rooms.map((room) => {
                const count = items.filter((i) => i.roomId === room.id).length;
                return (
                  <option key={room.id} value={room.id}>
                    {room.name} ({count})
                  </option>
                );
              })}
            </Select>
          </div>

          {/* Label Size Toggle */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-xs font-medium text-muted-foreground">Ukuran Label:</span>
            <div className="flex rounded-lg border bg-background p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setLabelSize("standard")}
                className={`px-3 py-1 rounded-md transition font-medium ${
                  labelSize === "standard"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Standar
              </button>
              <button
                type="button"
                onClick={() => setLabelSize("compact")}
                className={`px-3 py-1 rounded-md transition font-medium ${
                  labelSize === "compact"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Kompak
              </button>
            </div>
          </div>
        </div>

        {/* Content / Printable QR Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/60 dark:bg-slate-950/40 print:p-0 print:bg-white print:overflow-visible">
          {/* Printable Header only shown when printing */}
          <div className="hidden print:block mb-4 text-center border-b pb-2">
            <h1 className="text-lg font-bold text-black uppercase tracking-wider">
              {isFixedAsset ? "Daftar Label QR Code Aset Tetap" : "Daftar Label QR Code Barang Inventaris"}
            </h1>
            <p className="text-xs text-gray-600">
              Total: {filteredItems.length} Barang — Dicetak pada {new Date().toLocaleDateString("id-ID")}
            </p>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-16 space-y-3 bg-card rounded-2xl border">
              <QrCode className="w-12 h-12 text-muted-foreground/40 mx-auto" />
              <h3 className="font-semibold text-foreground">Tidak Ada Barang Yang Cocok</h3>
              <p className="text-xs text-muted-foreground">
                Sesuaikan kata kunci pencarian atau filter ruangan Anda.
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-4 print:gap-3 ${
                labelSize === "compact"
                  ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 print:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 print:grid-cols-3"
              }`}
            >
              {filteredItems.map((item) => {
                const qrUrl = qrCodeMap[item.id];
                const publicUrl = getItemPublicUrl(item.code || item.id, type);
                const isCopied = copiedId === item.id;
                const room = roomLookup.get(item.roomId) || "Tidak diketahui";

                return (
                  <div
                    key={item.id}
                    className="bg-card text-card-foreground border-2 border-slate-300 dark:border-slate-800 rounded-xl p-3 shadow-xs hover:shadow-md transition flex flex-col items-center justify-between text-center relative group print:shadow-none print:border-black print:border print:rounded-none print:break-inside-avoid print:p-2"
                  >
                    {/* Header Label inside card */}
                    <div className="w-full pb-1.5 border-b border-border/60 flex items-center justify-between text-[9px] font-bold text-muted-foreground tracking-wider uppercase">
                      <span className="text-blue-600 dark:text-blue-400 font-extrabold truncate">
                        {isFixedAsset ? "ASET TETAP" : "SARPRAS"}
                      </span>
                      <span className="font-mono text-foreground font-semibold px-1 rounded bg-muted/60">
                        {item.code}
                      </span>
                    </div>

                    {/* QR Code Container */}
                    <div className="my-2 p-1.5 bg-white rounded-lg border border-slate-200 shadow-inner flex items-center justify-center print:border-none print:shadow-none print:p-0">
                      {qrUrl ? (
                        <img
                          src={qrUrl}
                          alt={`QR ${item.code}`}
                          className={
                            labelSize === "compact"
                              ? "w-28 h-28 object-contain"
                              : "w-36 h-36 object-contain"
                          }
                        />
                      ) : (
                        <div
                          className={`flex items-center justify-center bg-muted/20 animate-pulse ${
                            labelSize === "compact" ? "w-28 h-28" : "w-36 h-36"
                          }`}
                        >
                          <QrCode className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Item Information */}
                    <div className="w-full space-y-0.5 pt-1 border-t border-border/60">
                      <h4 className="font-bold text-xs text-foreground truncate px-1" title={item.name}>
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground truncate" title={item.brand}>
                        Merk: {item.brand || "-"}
                      </p>
                      <div className="flex items-center justify-center gap-1 text-[10px] font-medium text-slate-600 dark:text-slate-400 truncate">
                        <span>{room}</span>
                        <span>•</span>
                        <span className="capitalize">{item.condition}</span>
                      </div>
                    </div>

                    {/* Action buttons (Hidden when printing) */}
                    <div className="w-full mt-2 pt-2 border-t border-dashed border-border flex items-center justify-center gap-1.5 print:hidden">
                      <button
                        type="button"
                        onClick={() => handleDownloadSingle(item)}
                        className="p-1 rounded text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition"
                        title="Unduh QR Code (.png)"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyLink(item)}
                        className="p-1 rounded text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition"
                        title="Salin Tautan Publik"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <a
                        href={publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition"
                        title="Buka Halaman Publik"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer - Hidden on print */}
        <div className="p-3 sm:p-4 bg-card border-t flex items-center justify-between text-xs text-muted-foreground print:hidden">
          <span>
            {isGenerating ? (
              <span className="flex items-center gap-1.5 text-blue-600 font-medium">
                <RefreshCw className="w-3 h-3 animate-spin" /> Menyiapkan kode QR...
              </span>
            ) : (
              `Menampilkan ${filteredItems.length} dari total ${items.length} barang inventaris`
            )}
          </span>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs h-8">
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
