import EditCourseForm, {
  CategoryWithSubCategories,
  CourseWithRelations,
} from "@/../components/EditCourseForm";
import { db } from "@/../lib/db";
import { auth } from "@clerk/nextjs/server";
import { Level } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: { courseId: string } }) => {
  const { courseId } = params;
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const getCourse: CourseWithRelations | null = await db.course.findFirst({
    where: {
      instructorId: userId,
      id: courseId,
    },
    include: {
      category: true,
      subCategory: true,
      level: true,
    },
  });

  const categories: CategoryWithSubCategories[] = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { subCategories: true },
  });

  const levels: Level[] = await db.level.findMany();

  return (
    <div className="flex items-start justify-center bg-gray-50 py-10">
      <div className="w-full  bg-white shadow-lg rounded-2xl p-8">
        <EditCourseForm
          course={getCourse}
          categories={categories}
          levels={levels}
        />
      </div>
    </div>
  );
};

export default page;
