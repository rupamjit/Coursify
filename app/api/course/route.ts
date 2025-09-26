import { db } from "../../../lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const { userId } = await auth();
    console.log(userId)

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, categoryId, subCategoryId } = await req.json();

    const newCourse = await db.course.create({
      data: {
        instructorId: userId,
        title,
        categoryId,
        subCategoryId,
      },
    });

    return NextResponse.json(newCourse, { status: 200 });
  } catch (err) {
    console.log("[courses_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

