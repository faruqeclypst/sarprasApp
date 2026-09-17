import { useCallback, useEffect, useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";

import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { compressImage, formatBytes } from "../../lib/imageCompression";

interface FileDropInputProps {
  id: string;
  value?: File;
  onChange: (file: File | undefined) => void;
  accept?: string;
  existingUrl?: string;
  placeholder?: string;
}

const formatFileSize = (size: number) => {
  return formatBytes(size);
};

const FileDropInput = ({
  id,
  value,
  onChange,
  accept = "image/*",
  existingUrl,
  placeholder = "Seret & lepas berkas di sini atau klik untuk memilih",
}: FileDropInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      setCompressionInfo(null);
      return;
    }

    const url = URL.createObjectURL(value);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [value]);

  const handleFiles = useCallback(
    async (files: FileList | null | undefined) => {
      const file = files?.[0];
      if (!file) {
        onChange(undefined);
        setCompressionInfo(null);
        return;
      }

      if (file.type.startsWith("image/") && file.type !== "image/svg+xml" && file.type !== "image/gif") {
        setIsCompressing(true);
        try {
          const originalSize = file.size;
          const compressed = await compressImage(file);
          if (compressed.size < originalSize) {
            const saved = Math.round(((originalSize - compressed.size) / originalSize) * 100);
            setCompressionInfo(
              `Dikompres: ${formatBytes(compressed.size)} (hemat ${saved}% dari ${formatBytes(originalSize)})`
            );
          } else {
            setCompressionInfo(`${formatBytes(file.size)}`);
          }
          onChange(compressed);
        } catch {
          onChange(file);
        } finally {
          setIsCompressing(false);
        }
      } else {
        onChange(file);
        setCompressionInfo(null);
      }
    },
    [onChange]
  );

  const preventDefaults = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    preventDefaults(event);
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    preventDefaults(event);
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    preventDefaults(event);
    setIsDragging(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    preventDefaults(event);
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFileDialog();
    }
  };

  const clearSelection = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div
        id={id}
        role="button"
        tabIndex={0}
        onClick={openFileDialog}
        onKeyDown={handleKeyDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted bg-background px-4 py-4 text-center transition focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          isDragging && "border-primary bg-primary/5",
          value && "border-primary/60"
        )}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Pratinjau unggahan" className="h-16 w-16 rounded-md object-cover shadow-sm" />
        ) : existingUrl ? (
          <img src={existingUrl} alt="Foto tersimpan" className="h-16 w-16 rounded-md object-cover shadow-sm" />
        ) : (
          <UploadCloud className="h-8 w-8 text-muted-foreground" />
        )}
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {value ? value.name : "Unggah Berkas"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isCompressing ? (
              <span className="text-blue-500 font-medium animate-pulse">Mengompresi gambar...</span>
            ) : compressionInfo ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{compressionInfo}</span>
            ) : value ? (
              formatFileSize(value.size)
            ) : existingUrl ? (
              "Menggunakan file yang sudah ada"
            ) : (
              placeholder
            )}
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>
      {value ? (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={clearSelection}>
            <X className="mr-2 h-4 w-4" />
            Hapus Pilihan
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default FileDropInput;
