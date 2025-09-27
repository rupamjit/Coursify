"use client";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import UploadFile from "../customComponent/UploadFile";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Resource, Section } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import axios from "axios";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name is required and must be at least 2 characters long",
  }),
  fileUrl: z.string().min(1, {
    message: "File is required",
  }),
});

interface ResourceFormProps {
  section: Section & { resources: Resource[] };
}
const ResourceForm = ({ section }: ResourceFormProps) => {
  // console.log(section);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      fileUrl: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await axios.post(
        `/api/course/${section.courseId}/sections/${section.id}/resources`,
        values
      );
      form.reset();
      router.refresh();
      toast("Resource uploaded succesfully");
    } catch (error) {
      console.log(error);
      toast("Internal Server Error!!!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `/api/course/${section.courseId}/sections/${section.id}/resources/${id}`
      );
      toast("Resource deleted!");
      router.refresh();
    } catch (err) {
      toast("Something went wrong!");
      console.log("Failed to delete resource", err);
    }
  };

  return (
    <div>
      <div className="flex gap-2 items-center text-xl font-bold mt-12">
        <PlusCircle />
        Add Resources (optional)
      </div>

      <p className="text-sm font-medium mt-2">
        Add resources to this section to help students learn better.
      </p>

      <div className="mt-5 flex flex-col gap-5">
        {section.resources.map((resource) => (
          <div
            key={resource.id}
            className="flex justify-between bg-[#b2cef0] rounded-lg text-sm font-medium p-3"
          >
            <div className="flex items-center">
              <File className="h-4 w-4 mr-4" />
              {resource.name}
            </div>
            <Button
              className="cursor-pointer"
              onClick={() => handleDelete(resource.id)}
              variant={"destructive"}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </div>
        ))}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 my-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Textbook" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Upload File</FormLabel>
                  <FormControl>
                    <UploadFile
                      value={field.value || ""}
                      onChange={(url) => field.onChange(url)}
                      endpoint="sectionResource"
                      page="Edit Section"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Upload"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResourceForm;
