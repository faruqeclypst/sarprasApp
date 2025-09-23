import axios from "axios";

export interface PresignedRequest {
  url: string;
  fields?: Record<string, string>;
}

export interface UploadResult {
  key: string;
  url: string;
}

export async function uploadFileToR2(
  file: File,
  presigned: PresignedRequest
): Promise<UploadResult> {
  if (presigned.fields) {
    const formData = new FormData();
    Object.entries(presigned.fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("file", file);
    await axios.post(presigned.url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return {
      key: presigned.fields.key ?? file.name,
      url: `${presigned.url}/${presigned.fields.key ?? file.name}`,
    };
  }

  await axios.put(presigned.url, file, {
    headers: { "Content-Type": file.type },
  });

  return { key: file.name, url: presigned.url.split("?")[0] };
}

const sanitizeFileName = (name: string) =>
  name
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

export async function requestPresignedUpload(key: string, file: File): Promise<PresignedRequest> {
  const signerEndpoint = import.meta.env.VITE_R2_SIGNER_URL;
  if (!signerEndpoint) {
    throw new Error("VITE_R2_SIGNER_URL belum dikonfigurasi");
  }

  const response = await axios.post<PresignedRequest>(signerEndpoint, {
    key,
    contentType: file.type,
    size: file.size,
  });

  return response.data;
}

export async function uploadInventoryImage(folder: string, file: File): Promise<UploadResult> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeName = sanitizeFileName(file.name);
  const key = `${folder}/${timestamp}-${safeName}`;
  const presigned = await requestPresignedUpload(key, file);
  return uploadFileToR2(file, presigned);
}
