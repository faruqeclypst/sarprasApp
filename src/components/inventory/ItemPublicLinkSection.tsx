import { useEffect, useState } from "react";
import { Check, Copy, Download, ExternalLink, QrCode, Globe } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { generateQrCodeDataUrl, downloadQrCode, getItemPublicUrl } from "../../lib/qrCode";
import type { InventoryItem } from "../../types/inventory";

interface ItemPublicLinkSectionProps {
  item: InventoryItem;
}

export const ItemPublicLinkSection = ({ item }: ItemPublicLinkSectionProps) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  // Use code or id for clean public link
  const publicUrl = getItemPublicUrl(item.code || item.id);

  useEffect(() => {
    let active = true;
    generateQrCodeDataUrl(publicUrl, { width: 220 })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch((err) => console.error("Gagal generate QR Code:", err));

    return () => {
      active = false;
    };
  }, [publicUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("input");
      el.value = publicUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (qrDataUrl) {
      downloadQrCode(qrDataUrl, `qrcode-${item.code || item.name}.png`);
    }
  };

  return (
    <div className="bg-muted/20 rounded-lg p-4 space-y-3.5 border border-muted mt-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <div className="w-1 h-4 bg-sky-500 rounded-full" />
          <Globe className="w-4 h-4 text-sky-500" />
          Tautan & QR Code Publik
        </h3>
        <span className="text-[10px] uppercase font-bold text-sky-700 bg-sky-100 dark:bg-sky-950 dark:text-sky-300 px-2 py-0.5 rounded-full">
          Akses Bebas
        </span>
      </div>

      <p className="text-xs text-muted-foreground">
        Tautan ini dapat diakses langsung oleh publik atau siapapun tanpa perlu login.
      </p>

      {/* URL Input & Copy Button */}
      <div className="flex items-center gap-1.5">
        <Input
          readOnly
          value={publicUrl}
          className="text-xs font-mono h-8 bg-background selection:bg-blue-200"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="h-8 px-2.5 shrink-0 text-xs gap-1"
          title="Salin Link Publik"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-600" />
              <span>Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Salin</span>
            </>
          )}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          asChild
          className="h-8 px-2 shrink-0 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
          title="Buka Halaman Publik di Tab Baru"
        >
          <a href={publicUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </Button>
      </div>

      {/* QR Code and Download */}
      <div className="flex items-center gap-3 pt-1 border-t border-border/50">
        <div className="bg-white p-1.5 rounded-lg border shadow-sm shrink-0">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR Code ${item.code}`}
              className="w-16 h-16 object-contain"
            />
          ) : (
            <div className="w-16 h-16 flex items-center justify-center">
              <QrCode className="w-6 h-6 text-muted-foreground animate-pulse" />
            </div>
          )}
        </div>
        <div className="space-y-1.5 flex-1">
          <p className="text-[11px] font-medium text-foreground">
            Scan untuk membuka halaman detail barang
          </p>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleDownload}
            disabled={!qrDataUrl}
            className="h-7 text-[11px] gap-1 px-2.5 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-950 dark:text-sky-300"
          >
            <Download className="w-3 h-3" />
            Unduh QR Code (.png)
          </Button>
        </div>
      </div>
    </div>
  );
};
