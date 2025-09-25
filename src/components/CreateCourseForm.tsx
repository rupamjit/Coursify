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
} from "@/components/ui/select";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod/v3";

interface CategoryProps {
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
  title: z.string(),
  subCategory: z.string(),
  category: z.string(),
});

const CreateCourseForm = ({ category }: CategoryProps) => {
  const [categories, setCategories] = useState<string>();
  const [subCategory, setSubCategory] = useState<
    { id: string; categoryId: string; name: string }[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subCategory: "",
      category: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  useEffect(() => {
    if (categories) {
      const selectedCategory = category.find(
        (item) => item.name === categories
      );
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
            name="category"
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
                          {category.map((item) => (
                            <SelectItem key={item.name} value={item.name}>
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
            name="subCategory"
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
                          subCategory.map((item) => (
                            <SelectItem key={item.name} value={item.name}>
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

          <Button type="submit">Create</Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateCourseForm;
