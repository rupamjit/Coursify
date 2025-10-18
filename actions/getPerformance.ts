import { Course, Purchase } from "@prisma/client";
import { db } from "../lib/db";

type PurchaseWithCourse = Purchase & { course: Course };

type CoursePerformance = {
  name: string;
  total: number;
  count: number;
};

type PerformanceResult = {
  data: CoursePerformance[];
  totalRevenue: number;
  totalSales: number;
};

const groupByCourse = (purchases: PurchaseWithCourse[]) =>
  purchases.reduce<Record<string, { total: number; count: number }>>(
    (grouped, purchase) => {
      const { title, price } = purchase.course;
      if (!grouped[title]) {
        grouped[title] = { total: 0, count: 0 };
      }
      grouped[title].total += price!;
      grouped[title].count += 1;
      return grouped;
    },
    {}
  );

export const getPerformance = async (
  userId: string
): Promise<PerformanceResult> => {
  try {
    const purchases = await db.purchase.findMany({
      where: { course: { instructorId: userId } },
      include: { course: true },
    });

    const groupedEarnings = groupByCourse(purchases);

    const data = Object.entries(groupedEarnings).map(
      ([name, { total, count }]) => ({ name, total, count })
    );

    const totalRevenue = data.reduce((sum, { total }) => sum + total, 0);

    return {
      data,
      totalRevenue,
      totalSales: purchases.length,
    };
  } catch (err) {
    console.error("[getPerformance]", err);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
