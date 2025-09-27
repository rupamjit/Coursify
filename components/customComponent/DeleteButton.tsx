import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import axios from "axios";
import { Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface DeleteProps {
  item: string;
  courseId: string;
  sectionId?: string;
}

const DeleteButton = ({ item, courseId, sectionId }: DeleteProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async () => {
  try {
    setIsDeleting(true);
    const url =
      item === "course"
        ? `/api/course/${courseId}`
        : `/api/course/${courseId}/sections/${sectionId}`; 
    
    await axios.delete(url);

    const pushedUrl =
      item === "course"
        ? "/instructor/courses"
        : `/instructor/courses/${courseId}/sections`;
    
    router.push(pushedUrl);
    router.refresh();
    toast.success(`${item} deleted`);
  } catch (err) {
    toast.error(`Something went wrong!`);
    console.log(`Failed to delete the ${item}`, err);
  } finally {
    setIsDeleting(false);
  }
};


  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="cursor-pointer" variant={"destructive"}>
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your {item}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-[#FDAB04]" onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;