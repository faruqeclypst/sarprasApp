import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export interface UploadResult {
  key: string;
  url: string;
}

const bucket = import.meta.env.VITE_R2_BUCKET as string | undefined;
const endpoint = import.meta.env.VITE_R2_ENDPOINT as string | undefined;
const accessKeyId = import.meta.env.VITE_R2_ACCESS_KEY_ID as string | undefined;
const secretAccessKey = import.meta.env.VITE_R2_SECRET_ACCESS_KEY as string | undefined;
const publicBaseUrl = import.meta.env.VITE_R2_PUBLIC_BASE_URL as string | undefined;

let cachedClient: S3Client | null = null;
let cachedConfig:
  | {
      bucket: string;
      endpoint: string;
      accessKeyId: string;
      secretAccessKey: string;
      publicBaseUrl?: string;
    }
  | null = null;

const sanitizeFileName = (name: string) =>
  name
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

const getConfig = () => {
  if (!cachedConfig) {
    if (!bucket || !endpoint || !accessKeyId || !secretAccessKey) {
      throw new Error(
        "Konfigurasi R2 belum lengkap. Pastikan VITE_R2_BUCKET, VITE_R2_ENDPOINT, VITE_R2_ACCESS_KEY_ID, dan VITE_R2_SECRET_ACCESS_KEY terisi."
      );
    }

    cachedConfig = {
      bucket,
      endpoint,
      accessKeyId,
      secretAccessKey,
      publicBaseUrl,
    };
  }

  return cachedConfig;
};

const ensureClient = () => {
  const config = getConfig();

  if (!cachedClient) {
    cachedClient = new S3Client({
      region: "auto",
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  return cachedClient;
};

export async function uploadInventoryImage(folder: string, file: File): Promise<UploadResult> {
  const config = getConfig();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeName = sanitizeFileName(file.name);
  const key = `${folder}/${timestamp}-${safeName}`;

  const client = ensureClient();
  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: file,
      ContentType: file.type || "application/octet-stream",
    })
  );

  let baseUrl = config.publicBaseUrl;
  if (!baseUrl) {
    try {
      const endpointUrl = new URL(config.endpoint);
      baseUrl = `https://${config.bucket}.${endpointUrl.host}`;
    } catch (error) {
      console.warn("Tidak dapat membentuk URL publik R2 dari endpoint", error);
      baseUrl = config.endpoint;
    }
  }

  if (!baseUrl) {
    throw new Error("Gagal menentukan URL publik R2. Periksa konfigurasi endpoint atau VITE_R2_PUBLIC_BASE_URL.");
  }

  if (!/^https?:\/\//i.test(baseUrl)) {
    baseUrl = `https://${baseUrl}`;
  }

  const normalizedBase = baseUrl.replace(/\/$/, "");
  return { key, url: `${normalizedBase}/${key}` };
}
