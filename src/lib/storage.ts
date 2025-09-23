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
