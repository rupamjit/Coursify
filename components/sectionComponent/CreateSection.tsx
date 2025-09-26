"use client";
import { Course, Section } from "@prisma/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateSectionProps {
  course: Course & { sections: Section[] };
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required and must be at least 2 characters long",
  }),
});

const CreateSection = ({ course }: CreateSectionProps) => {
  //   console.log(course);

  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const routes = [
    {
      label: "Basic Information",
      path: `/instructor/courses/${course.id}/basic`,
    },
    { label: "Curriculum", path: `/instructor/courses/${course.id}/sections` },
  ];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div>
      <div className="flex gap-5 py-2">
        {routes.map((route) => (
          <Link key={route.path} href={route.path}>
            <Button
              className="cursor-pointer"
              variant={pathname === route.path ? "primary" : "outline"}
            >
              {route.label}
            </Button>
          </Link>
        ))}
      </div>

      {/* Add Previous Section list */}

      <h1 className="font-extrabold text-xl mt-4  p-2">Add New Section</h1>
      <div className="p-2 mt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-2">
                      <Label className="font-semibold">New Section</Label>
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
            <div className="flex gap-4">
              <Link href={`/instructor/courses/${course.id}/basic`}>
                <Button className="cursor-pointer" variant={"outline"}>
                  Cancel
                </Button>
              </Link>
              <Button className="cursor-pointer" variant={"primary"}>
                {isLoading ? (
                  <Loader2 className="h-7 w-7 animate-spin" />
                ) : (
                  "Create Section"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateSection;
