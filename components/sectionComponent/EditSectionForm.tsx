"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { MuxData, Resource, Section } from "@prisma/client";
import React, { useState } from "react";
import z from "zod";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import RichTextEditor from "../customComponent/RichTextEditor";
import UploadFile from "../customComponent/UploadFile";
import { useForm } from "react-hook-form";
import { Switch } from "../ui/switch";
import MuxPlayer from "@mux/mux-player-react";
import ResourceForm from "./ResourceForm";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EditSectionProps {
  section:
    | (Section & { muxData: MuxData | null; resources: Resource[] })
    | null;
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required and must be at least 2 characters long",
  }),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  isFree: z.boolean().optional(),
});

const EditSectionForm = ({ section }: EditSectionProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: section?.title,
      description: section?.description || "",
      videoUrl: section?.videoUrl || "",
      isFree: section?.isFree,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      await axios.post(
        `/api/course/${section?.courseId}/sections/${section?.id}`,
        values
      );
      toast("Section Updated");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast("Internal Server Error");
    }finally{
      setIsLoading(false)
    }
  };
  return (
    <div className="space-y-6 ">
      <div>
        <h1 className="text-2xl font-bold">Section Details</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete this section with a title, description, video, and resources
          to give your students the best learning experience.
        </p>
      </div>

      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 bg-white p-6 rounded-xl shadow-sm border"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <Label className="font-semibold">Section Title</Label>
                  <FormControl>
                    <Input
                      {...field}
                      className="mt-2"
                      placeholder="Ex. Web Development"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Label className="font-semibold">Description</Label>
                  <FormControl>
                    <RichTextEditor
                      {...field}
                      placeholder="Write a short description about this section"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {section?.videoUrl && (
              <div className="my-5">
                <MuxPlayer
                  playbackId={section?.muxData?.playbackId || ""}
                  className="h-[500px] w-[500px]"
                />
              </div>
            )}
            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <Label className="font-semibold">Video Upload</Label>
                  <FormControl>
                    <UploadFile
                      value={field.value || ""}
                      page="Edit Course"
                      endpoint="sectionVideoUpload"
                      onChange={(url) => {
                        if (url) {
                          field.onChange(url);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Accessibility</FormLabel>
                    <FormDescription>
                      Everyone can access this section for FREE
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-start gap-4">
              <Button
                disabled={isLoading}
                className="cursor-pointer"
                variant={"primary"}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Save Section"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <ResourceForm section={section} />
    </div>
  );
};

export default EditSectionForm;
