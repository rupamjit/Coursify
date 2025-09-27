import React from "react";
import EditSectionForm from "@/../components/sectionComponent/EditSectionForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/../lib/db";

const page = async ({
  params,
}: {
  params: { sectionId: string; courseId: string };
}) => {
  const { sectionId, courseId } = params;

  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const course = await db.course.findFirst({
    where: {
      id: courseId,
      instructorId: userId,
    },
  });

  if (!course) {
    return redirect("/instructor/courses");
  }

  const section = await db.section.findUnique({
    where: {
      id: sectionId,
      courseId: courseId,
    },
    include: {
        muxData:true,
        resources:true
    },
  });
 if (!section) {
    return redirect(`/instructor/courses/${params.courseId}/sections`);
  }
 
  return (
    <div>
      <EditSectionForm section={section}/>
    </div>
  );
};

export default page;
