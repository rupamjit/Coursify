import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../lib/db";

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const { userId } = await auth();
    const { courseId } =  params;

    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        instructorId: userId,
      },
    });

    if (!course) {
      return new NextResponse("Course Not Found", { status: 404 });
    }

    const lastPosition = await db.section.findFirst({
      where: {
        courseId: courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const position = lastPosition ? lastPosition?.position + 1 : 0;

    const newSection = await db.section.create({
      data: {
        position: position,
        courseId,
        title,
      },
    });

    return NextResponse.json(newSection, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
