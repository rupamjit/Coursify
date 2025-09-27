import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/../lib/db";
import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string; sectionId: string } }
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { sectionId, courseId } = params;

    const course = await db.course.findUnique({
      where: {
        instructorId: userId,
        id: courseId,
      },
    });

    if (!course) {
      return new NextResponse("Course Not Found", { status: 404 });
    }

    const { title, description, videoUrl, isFree } = await req.json();

    const section = await db.section.update({
      where: {
        id: sectionId,
        courseId,
      },
      data: {
        title,
        description,
        videoUrl,
        isFree,
      },
    });

    if (videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          sectionId,
        },
      });

      if (existingMuxData) {
        await mux.video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      const asset = await mux.video.assets.create({
        inputs: [{ url: videoUrl }],
        playback_policy: ["public"],
        test: false,
      });

      await db.muxData.create({
        data: {
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
          sectionId,
        },
      });
    }

    return NextResponse.json(section, { status: 200 });
  } catch (error) {
    console.log("Error", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
