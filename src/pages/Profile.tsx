import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/auth/useAuth";

export default function Profile() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  async function upload() {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/profile/profile-picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
        onUploadProgress: (event) => {
          if (!event.total) return;
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        },
      });

      await refreshUser();
      
      alert("Profile picture uploaded!");
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert(
        "Upload failed. Make sure you are logged in and try again."
      );
    } finally {
      setUploading(false);
    }
  }

  const { refreshUser } = useAuth();
  const fileSizeMB = file ? (file.size / (1024 * 1024)).toFixed(2) : null;

  return (
    <div className="max-w-md mx-auto p-6 space-y-4 rounded-xl border shadow-sm">
      <h2 className="text-xl font-semibold">Profile Picture</h2>

      {/* Choose File Button */}
      <div>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <Button
          className="w-full"
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          {file ? "Change File" : "Choose File"}
        </Button>
      </div>

      {/* File Info & Preview */}
      {file && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            File size: <span className="font-medium">{fileSizeMB} MB</span>
          </p>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-32 rounded-full object-cover border"
            />
          )}
        </div>
      )}

      {/* Progress Bar */}
      {uploading && (
        <div className="space-y-1">
          <div className="w-full h-2 bg-muted rounded">
            <div
              className="h-2 bg-primary rounded transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{progress}%</p>
        </div>
      )}

      {/* Upload Button */}
      <Button
        onClick={upload}
        disabled={!file || uploading}
        className="w-full"
      >
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}




