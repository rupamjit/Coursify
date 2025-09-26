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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export interface CategoryProps {
  category: {
    id: string;
    name: string;
    subCategories: {
      id: string;
      categoryId: string;
      name: string;
    }[];
  }[];
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required and minimum 2 characters",
  }),
  categoryId: z.string().min(1, {
    message: "Category is required",
  }),
  subCategoryId: z.string().min(1, {
    message: "Subcategory is required",
  }),
});

const CreateCourseForm = ({ category }: CategoryProps) => {
  const [categories, setCategories] = useState<string>();
  const [subCategory, setSubCategory] = useState<
    { id: string; categoryId: string; name: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subCategoryId: "",
      categoryId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/course", values);
      if (response.status == 200) {
        router.push(`/instructor/courses/${response.data.id}/basic`);
        toast("New Course Created Succesfully", {
          duration: 3000,
          position: "top-center",
        });
      }
    } catch (err) {
      console.log("Failed to create new course", err);
      toast("Internal Server Error", {
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (categories) {
      const selectedCategory = category.find((item) => item.id === categories);
      setSubCategory(selectedCategory?.subCategories || []);
    }
  }, [categories, category]);

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
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-2">
                    <div className="space-y-2">
                      <Label className="font-semibold">Category</Label>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setCategories(value);
                        }}
                      >
                        <SelectTrigger className="w-5xl">
                          <SelectValue placeholder="Select Category..." />
                        </SelectTrigger>
                        <SelectContent>
                          {category.map((item, _idx) => (
                            <SelectItem key={_idx} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
              <FormItem>
                <FormControl>
                  <div className="space-y-2">
                    <Label className="font-semibold">Sub Category</Label>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-5xl">
                        <SelectValue placeholder="Select SubCategory..." />
                      </SelectTrigger>
                      <SelectContent>
                        {subCategory.length > 0 ? (
                          subCategory.map((item, _idx) => (
                            <SelectItem key={_idx} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled value="null">
                            First Select The Category
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="cursor-pointer"
            variant="primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="text-white animate-spin h-7 w-7" />
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateCourseForm;
