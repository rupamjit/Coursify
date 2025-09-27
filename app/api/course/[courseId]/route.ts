import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

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

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const { userId } = await auth();
    const { courseId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: { id: courseId, instructorId: userId },
      include: {
        sections: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    for (const section of course.sections) {
      if (section.muxData?.assetId) {
        await mux.video.assets.delete(section.muxData.assetId);
      }
    }

    await db.course.delete({
      where: { id: courseId, instructorId: userId },
    });

    return new NextResponse("Course Deleted", { status: 200 });
  } catch (err) {
    console.error(["courseId_DELETE", err]);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
