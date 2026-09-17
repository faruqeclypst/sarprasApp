import QRCode from "qrcode";

export interface QrCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

/**
 * Generate high-resolution QR code as base64 PNG data URL
 */
export async function generateQrCodeDataUrl(
  text: string,
  options: QrCodeOptions = {}
): Promise<string> {
  const {
    width = 300,
    margin = 2,
    color = {
      dark: "#0f172a",
      light: "#ffffff",
    },
  } = options;

  return QRCode.toDataURL(text, {
    width,
    margin,
    color,
    errorCorrectionLevel: "M",
  });
}

/**
 * Triggers download of QR Code PNG image in browser
 */
export function downloadQrCode(dataUrl: string, filename: string = "qrcode.png") {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Builds standard public detail URL for an inventory item
 */
export function getItemPublicUrl(codeOrId: string): string {
  const origin = window.location.origin;
  return `${origin}/publik/inventaris/${encodeURIComponent(codeOrId)}`;
}
