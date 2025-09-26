import CreateCourseForm from "../../../../components/CreateCourseForm";
import { db } from "../../../../lib/db";
import React from "react";

const page = async () => {
  const category = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      subCategories: true,
    },
  });
  // console.log(category);

  return (
    <div>
      <CreateCourseForm category={category} />
    </div>
  );
};

export default page;
