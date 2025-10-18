import { Button } from "../../../../components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";
import React from "react";
import { DataTable } from "@/../components/customComponent/DataTable";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "../../../../lib/db";
import { columns } from "../../../../components/customComponent/Columns";

const page = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const courses = await db.course.findMany({
    where: {
      instructorId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="pt-2">
      <Button variant={"primary"} asChild>
        <Link href={"/instructor/create-course"}>
          <Edit />
          Create Course
        </Link>
      </Button>

      <div className="mt-5">
        <DataTable columns={columns} data={courses} />
      </div>
    </div>
  );
};

export default page;
