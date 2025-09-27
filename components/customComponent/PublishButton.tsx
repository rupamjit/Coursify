"use client";

import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface PublishButtonProps {
  disabled?: boolean;
  courseId: string;
  sectionId?: string;
  isPublished: boolean;
  page: string;
}

const PublishButton = ({
  disabled,
  courseId,
  sectionId,
  isPublished,
  page,
}: PublishButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
  try {
    setIsLoading(true);

    const url =
      page === "Section"
        ? `/api/course/${courseId}/sections/${sectionId}/${isPublished ? "unpublish" : "publish"}`
        : `/api/course/${courseId}/${isPublished ? "unpublish" : "publish"}`;

    await axios.post(url);

    toast(`${page} ${isPublished ? "unpublished" : "published"}`);
    router.refresh();
  } catch (err) {
    console.log(`Failed to ${isPublished ? "unpublish" : "publish"} ${page}`, err);
    toast("Internal Server Error!");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <Button
      variant="outline"
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isPublished ? (
        "Unpublish"
      ) : (
        "Publish"
      )}
    </Button>
  );
};

export default PublishButton;
