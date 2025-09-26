
"use client";

import Image from "next/image";
import { toast } from "sonner";
import { X, UploadCloud } from "lucide-react";

import { ourFileRouter } from "../../app/api/uploadthing/core";
import { UploadDropzone } from "../../lib/uploadthing"; 
import { Button } from "../ui/button";

interface FileUploadProps {
  value: string;
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
  page?: string;
}

const UploadFile = ({ value, onChange, endpoint }: FileUploadProps) => {

  if (value) {
    return (
      <div className="relative group w-full h-48 md:h-56 rounded-xl overflow-hidden">
        <Image
        width={500}
        height={500}
          src={value}
          alt="Uploaded file preview"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-colors duration-300 flex items-center justify-center">
          <Button
            onClick={() => onChange("")}
            className="bg-rose-500 text-white p-2 rounded-full h-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            type="button"
            variant="destructive"
            size="icon"
            aria-label="Remove image"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-48 md:h-56">
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          if (res && res[0]) {
            onChange(res[0].ufsUrl);
          }
        }}
        onUploadError={(error: Error) => {
          toast.error(error.message);
        }}
        appearance={{
          container: {
            border: "2px dashed #9ca3af", 
            borderRadius: "0.75rem", 
            height: "100%",
            transition: "border-color 0.2s ease-in-out",
          },
          uploadIcon: {
            color: "#6b7280", 
            width: "3.5rem",
            height: "3.5rem",
          },
          label: {
            color: "#374151", 
            fontSize: "1.125rem",
            fontWeight: "600",
          },
          allowedContent: {
            color: "#6b7280", 
          },
          button: {
            backgroundColor: "#2563eb", 
            color: "#ffffff",
            padding: "0.5rem 1.25rem",
            borderRadius: "0.5rem",
            transition: "background-color 0.2s ease-in-out",
          },
        }}
        content={{
          uploadIcon: <UploadCloud />,
          label: "Drag and drop or click to upload",
        }}
      />
    </div>
  );
};

export default UploadFile;