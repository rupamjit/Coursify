import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = await params;

    const {
      title,
      categoryId,
      subCategoryId,
      subtitle,
      description,
      levelId,
      price,
      imageUrl,
    } = await req.json();

    const data = await db.course.update({
      where: {
        id: courseId,
        instructorId: userId,
      },
      data: {
        title,
        categoryId,
        subCategoryId,
        subtitle,
        description,
        levelId,
        price,
        imageUrl,
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
