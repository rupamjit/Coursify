
"use client";
import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import RichTextEditor from "./customComponent/RichTextEditor";
import { Prisma } from "@prisma/client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useUploadThing } from "../lib/uploadthing";
import UploadFile from "./customComponent/UploadFile";

export type CourseWithRelations = Prisma.CourseGetPayload<{
  include: {
    category: true;
    subCategory: true;
    level: true;
  };
}>;

export type CategoryWithSubCategories = Prisma.CategoryGetPayload<{
  include: {
    subCategories: true;
  };
}>;

export type Level = Prisma.LevelGetPayload<object>;

interface EditCourseFormProps {
  course: CourseWithRelations | null;
  categories: CategoryWithSubCategories[];
  levels: Level[];
}
interface FileDetails {
  key: string;
  name: string;
  size: number;
  type: string;
  ufsUrl: string;
}


const formSchema = z.object({
  title: z.string().trim().min(2, { message: "Title is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
  subCategoryId: z.string().min(1, { message: "Subcategory is required" }),
  subtitle: z.string().trim().optional(),
  description: z
    .string()
    .trim()
    .min(10, { message: "Description must be 10 characters" }),
  levelId: z.string().min(1, { message: "Level is required" }),
  price: z.number().optional(),
  imageUrl: z.string(),
});

const EditCourseForm = ({
  course,
  categories,
  levels,
}: EditCourseFormProps) => {
  const [category, setCategory] = useState<string>();
  const [subCategory, setSubCategory] = useState<
    { id: string; categoryId: string; name: string }[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  //   console.log(course);
  //   console.log(categories);
  //   console.log(levels);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course?.title ?? "",
      subtitle: course?.subtitle ?? "",
      subCategoryId: course?.subCategoryId ?? "",
      categoryId: course?.categoryId ?? "",
      description: course?.description ?? "",
      levelId: course?.levelId ?? "",
      imageUrl: course?.imageUrl || "",
      price: course?.price || undefined,
    },
  });

  useEffect(() => {
    const selectedCategoryId = category ?? course?.categoryId;
    const selectedCategory = categories.find(
      (item) => item.id === selectedCategoryId
    );
    setSubCategory(selectedCategory?.subCategories || []);
  }, [categories, category, course?.categoryId]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-5">
          <div className="mb-6">
            <p className="text-2xl font-extrabold text-gray-900">
              Some Basic Information About Your Course
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Please fill in the details. You can change the details later.
            </p>
          </div>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-2">
                    <Label className="font-semibold">Title</Label>
                    <Input
                      {...field}
                      className="mt-2 w-5xl"
                      placeholder="Ex. Web Development"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-2">
                    <Label className="font-semibold">SubTitle</Label>
                    <Input
                      {...field}
                      className="mt-2 w-5xl"
                      placeholder="Ex. Become a Full Stack Developer"
                    />
                  </div>
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
                <FormControl>
                  <div className="space-y-2">
                    <Label className="font-semibold">Description</Label>
                    <RichTextEditor
                      {...field}
                      placeholder="Description About this course"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-6">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="space-y-2">
                      <Label className="font-semibold">Category</Label>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setCategory(value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((item, _idx) => (
                            <SelectItem key={_idx} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subCategoryId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="space-y-2">
                      <Label className="font-semibold">SubCategory</Label>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select SubCategory..." />
                        </SelectTrigger>
                        <SelectContent>
                          {subCategory.map((item, _idx) => (
                            <SelectItem key={_idx} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="levelId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="space-y-2">
                      <Label className="font-semibold">Level</Label>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Level..." />
                        </SelectTrigger>
                        <SelectContent>
                          {levels.map((item, _idx) => (
                            <SelectItem key={_idx} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="space-y-2">
                    <Label className="font-semibold">Course Banner</Label>
                    <UploadFile
                      value={field.value || ""}
                      page="Edit Course"
                      endpoint="courseBanner"
                      onChange={(url) => {
                        // Fixed: properly handle the optional url parameter
                        if (url) {
                          field.onChange(url);
                        }
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-2">
                    <Label className="font-semibold">Price (USD)</Label>
                    <Input
                      {...field}
                      step="0.01"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      type="number"
                      className="mt-2 w-5xl"
                      placeholder="199.99"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-5">
            <Link href="/instructor/courses">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button
              className="cursor-pointer"
              variant="primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="text-white animate-spin h-7 w-7" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default EditCourseForm;