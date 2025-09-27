import React from "react";
import CreateSection from "@/../components/sectionComponent/CreateSection";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/../lib/db";
// ../../../../..

const page = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }
  const { courseId } = await params;

  const course = await db.course.findFirst({
    where: {
      id: courseId,
      instructorId: userId,
    },
    include: {
      sections: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    redirect("/instructor/courses");
  }
  // console.log(course)

  return (
    <div>
      <CreateSection course={course} />
    </div>
  );
};

export default page;
